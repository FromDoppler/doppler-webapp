import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { Breadcrumb, BreadcrumbItem } from '../../shared/Breadcrumb/Breadcrumb';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { CollaboratorInviteForm } from './Forms/CollaboratorInviteForm';
import { CollaboratorPermissionsForm } from './Forms/CollaboratorPermissionsForm';
import { SuccessStepForm } from './Forms/SuccessStepForm';
import Modal from '../../Modal/Modal';
import { Navigate } from 'react-router-dom';
import { isCollaboratorPermissionsEnabled } from '../../../services/collaborator-permissions-flag';
import useTimeout from '../../../hooks/useTimeout';

const modalSteps = {
  initial: 'INITIAL_STEP',
  addPermissions: 'ADD_PERMISSIONS_STEP',
  addSuccess: 'ADD_SUCCESS_STEP',
  editPermissions: 'EDIT_PERMISSIONS_STEP',
  editSuccess: 'EDIT_SUCCESS_STEP',
};

const SEARCH_DEBOUNCE_DELAY = 700;

const normalizeSearchValue = (value) => value.trim();

export const CollaboratorsSections = InjectAppServices(
  ({ dependencies: { dopplerUserApiClient, appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const createTimeout = useTimeout();
    const collaboratorPermissionsEnabled = isCollaboratorPermissionsEnabled();
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [data, setData] = useState([]);
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const [activeMenu, setActiveMenus] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalError, setmodalError] = useState(null);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [selectedCollaboratorUserId, setSelectedCollaboratorUserId] = useState(null);
    const [selectedCollaboratorUserAccountId, setSelectedCollaboratorUserAccountId] =
      useState(null);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshTable, setRefreshTable] = useState(false);
    const invitationsRequestIdRef = useRef(0);
    const permissionsLoadedRef = useRef(!collaboratorPermissionsEnabled);
    const hasLoadedInvitationsRef = useRef(false);
    const latestSearchValueRef = useRef('');
    const redirectToDashboard =
      appSessionRef.current.userData.userAccount?.userProfileType &&
      appSessionRef.current.userData.userAccount.userProfileType !== 'USER';

    const modalFirstStep = {
      step: modalSteps.initial,
      title: _('collaborators.add_collaborator'),
      description: _('collaborators.form_modal.description'),
    };

    const modalPermissionsStep = {
      step: modalSteps.addPermissions,
      title: _('collaborators.form_modal.permissions_title'),
      description: _('collaborators.form_modal.permissions_description'),
    };

    const modalFinalStep = {
      step: modalSteps.addSuccess,
      title: _('collaborators.form_modal.success_title'),
      description: _('collaborators.form_modal.success_subtitle'),
    };

    const createModalEditPermissionsStep = (email) => ({
      step: modalSteps.editPermissions,
      title: `${_('collaborators.form_modal.edit_permissions_title')}: ${email}`,
      description: _('collaborators.form_modal.permissions_description'),
    });

    const modalEditSuccessStep = {
      step: modalSteps.editSuccess,
      title: _('collaborators.form_modal.edit_success_title'),
      description: _('collaborators.form_modal.edit_success_subtitle'),
    };

    const [modalStep, setModalStep] = useState(modalFirstStep);

    const handleModalOpen = (open) => {
      if (open) {
        setmodalError(null);
        setModalOpen(open);
      } else {
        setSelectedEmail('');
        setSelectedCollaboratorUserId(null);
        setSelectedCollaboratorUserAccountId(null);
        setSelectedPermissionIds([]);
        setmodalError(null);
        setModalStep(modalFirstStep);
        setModalOpen(open);
      }
    };

    useEffect(() => {
      if (!collaboratorPermissionsEnabled) {
        return;
      }

      const fetchPermissions = async () => {
        const permissions = await dopplerUserApiClient.getAvailableCollaboratorSections();
        if (permissions.success) {
          setAvailablePermissions(permissions.value);
        }

        permissionsLoadedRef.current = true;

        if (hasLoadedInvitationsRef.current) {
          setLoading(false);
        }
      };

      fetchPermissions();
    }, [collaboratorPermissionsEnabled, dopplerUserApiClient]);

    useEffect(() => {
      const fetchInvitations = async () => {
        const currentRequestId = invitationsRequestIdRef.current + 1;
        invitationsRequestIdRef.current = currentRequestId;

        if (hasLoadedInvitationsRef.current) {
          setTableLoading(true);
        }

        const invitations = await dopplerUserApiClient.getCollaborationInvites(searchTerm);
        if (invitationsRequestIdRef.current !== currentRequestId) {
          return;
        }

        if (invitations.success) {
          setData(invitations.value);
          setActiveMenus(false);
        }

        hasLoadedInvitationsRef.current = true;
        setTableLoading(false);

        if (permissionsLoadedRef.current) {
          setLoading(false);
        }
      };

      fetchInvitations();
    }, [dopplerUserApiClient, refreshTable, searchTerm]);

    const toggleMenu = (index) => {
      if (activeMenu === index) {
        setActiveMenus(false);
      } else {
        setActiveMenus(index);
      }
    };

    const sendInvitation = async (invitationData) => {
      setActiveMenus(false);
      const result = await dopplerUserApiClient.sendCollaboratorInvite(invitationData);
      if (result.success) {
        setRefreshTable((currentValue) => !currentValue);
      }

      return result.success;
    };

    const goToPermissionsStep = async (email) => {
      setmodalError(null);
      setSelectedEmail(email);

      if (!collaboratorPermissionsEnabled) {
        const success = await sendInvitation({ email });

        if (success) {
          setModalStep(modalFinalStep);
        } else {
          setmodalError(_('common.unexpected_error'));
        }

        return;
      }

      setModalStep(modalPermissionsStep);
    };

    const goToEditPermissionsStep = (collaborator) => {
      if (!collaboratorPermissionsEnabled) {
        return;
      }

      setActiveMenus(false);
      setmodalError(null);
      setSelectedEmail(collaborator.email);
      setSelectedCollaboratorUserId(collaborator.idUser);
      setSelectedCollaboratorUserAccountId(collaborator.idUserAccount);
      setSelectedPermissionIds(collaborator.sections || []);
      setModalStep(createModalEditPermissionsStep(collaborator.email));
      setModalOpen(true);
    };

    const goBackToInviteStep = (permissions = []) => {
      setmodalError(null);
      setSelectedPermissionIds(permissions);
      setModalStep(modalFirstStep);
    };

    const formSendInvitation = async (permissions) => {
      setmodalError(null);
      const success = await sendInvitation({
        email: selectedEmail,
        sections: permissions,
      });
      if (success) {
        setModalStep(modalFinalStep);
      } else {
        setmodalError(_('common.unexpected_error'));
      }
    };

    const updateCollaboratorPermissions = async (permissions) => {
      setmodalError(null);

      if (!selectedCollaboratorUserId) {
        setmodalError(_('common.unexpected_error'));
        return;
      }

      const result = await dopplerUserApiClient.updateCollaborator({
        email: selectedEmail,
        idUser: selectedCollaboratorUserId,
        idUserAccount: selectedCollaboratorUserAccountId,
        sections: permissions,
      });

      if (result.success) {
        setRefreshTable((currentValue) => !currentValue);
        setModalStep(modalEditSuccessStep);
      } else {
        setmodalError(_('common.unexpected_error'));
      }
    };

    const sendInvitationCancelation = async (email) => {
      setActiveMenus(false);
      await dopplerUserApiClient.cancelCollaboratorInvite(email);
      setRefreshTable((currentValue) => !currentValue);
    };

    const handleSearchChange = ({ target: { value } }) => {
      setSearchValue(value);
      latestSearchValueRef.current = value;
      setActiveMenus(false);
      createTimeout(() => {
        if (latestSearchValueRef.current === value) {
          setSearchTerm(normalizeSearchValue(value));
        }
      }, SEARCH_DEBOUNCE_DELAY);
    };

    const handleSearchClick = () => {
      setSearchTerm(normalizeSearchValue(searchValue));
    };

    if (loading) {
      return <Loading page />;
    }

    if (redirectToDashboard) {
      return <Navigate to="/dashboard" />;
    }

    return (
      <>
        <Helmet>
          <title>{_('collaborators.meta_title')}</title>
        </Helmet>
        <HeaderSection>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <Breadcrumb>
              <BreadcrumbItem
                href={_('common.control_panel_url')}
                text={_('common.control_panel')}
              />
              <BreadcrumbItem text={_('collaborators.title')} />
            </Breadcrumb>
            <h2>{_('collaborators.title')}</h2>
          </div>
          <div className="col-sm-8">
            <p>
              {_('collaborators.subtitle')}
              <br />
              <a
                href={_('collaborators.help_center_url')}
                target="_blank"
                rel="noopener noreferrer"
              >
                {_('collaborators.help_center')}
              </a>
            </p>
          </div>
          <div className="col-sm-4 text-align--right">
            <button
              type="button"
              className="dp-button button-medium primary-green ng-binding"
              onClick={() => handleModalOpen(true)}
            >
              {_('collaborators.add_collaborator_button')}
            </button>
          </div>
        </HeaderSection>
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 m-t-24 m-b-36">
              <div className="dp-rowflex">
                <div className="col-sm-12 col-md-4 col-lg-4 m-b-24">
                  <div className="awa-form">
                    <label
                      htmlFor="collaborators-search"
                      className="labelcontrol"
                      aria-disabled="false"
                    >
                      <div className="dp-wrap-search">
                        <button
                          type="button"
                          className="dp-button button-medium dp-button--search grey"
                          onClick={handleSearchClick}
                          aria-label={_('collaborators.search.label')}
                        >
                          <span className="ms-icon icon-search" aria-hidden="true"></span>
                        </button>
                        <input
                          type="search"
                          id="collaborators-search"
                          placeholder={_('collaborators.search.placeholder')}
                          aria-invalid="false"
                          aria-label={_('collaborators.search.label')}
                          aria-controls="collaborators-table"
                          className="silver"
                          value={searchValue}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <h6 className="m-b-18">{_('collaborators.title_second')}</h6>
              <div className="dp-table-responsive" aria-busy={tableLoading}>
                {tableLoading && <Loading />}
                <table
                  id="collaborators-table"
                  className="dp-table-multilogin"
                  aria-label="Resultado multilogin"
                  summary="Resultado de multilogin"
                >
                  <thead>
                    <tr>
                      <th aria-label={_('collaborators.table.email')} scope="col">
                        <span>{_('collaborators.table.email')}</span>
                      </th>
                      <th aria-label={_('collaborators.table.full_name')} scope="col">
                        <span>{_('collaborators.table.full_name')}</span>
                      </th>
                      <th aria-label={_('collaborators.table.invitation_date')} scope="col">
                        <span>{_('collaborators.table.invitation_date')}</span>
                      </th>
                      <th aria-label={_('collaborators.table.status')} scope="col">
                        <span>{_('collaborators.table.status')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td aria-label="Email">
                          <span>{item.email}</span>
                        </td>
                        <td aria-label={_('collaborators.table.full_name')}>
                          <span>{[item.firstname, item.lastname].filter(Boolean).join(' ')}</span>
                        </td>
                        <td aria-label="Fecha de Invitacion">
                          <div className="dp-icon-wrapper">
                            <span>
                              {intl.formatDate(new Date(item.invitationDate + 'Z'), {
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                              })}
                            </span>
                          </div>
                        </td>
                        <td aria-label="estado">
                          <div className="dp-flex-wrap">
                            <span>
                              {_(`collaborators.table.statusType.${item.invitationStatus}`)}
                            </span>
                            <div className="dp-button-dropdown-wrap dp-wrap-medium">
                              <div className="dp-button-box">
                                <button
                                  type="button"
                                  className={`dp-button button-medium dp-button-dropdown dp-three-points-vertical ${
                                    activeMenu === index ? 'active' : ''
                                  }`}
                                  onClick={() => toggleMenu(index)}
                                  aria-controls="dp-exit-editor"
                                  data-testid={`collaborator-menu-toggle-${index}`}
                                ></button>
                                <div
                                  className="dp-content-menu"
                                  style={{
                                    display: `${activeMenu === index ? 'block' : 'none'}`,
                                  }}
                                >
                                  <ul className="dp-list-dropdown" id="dropdown">
                                    {collaboratorPermissionsEnabled ? (
                                      <li role="menuitem">
                                        <button
                                          type="button"
                                          onClick={() => goToEditPermissionsStep(item)}
                                          data-testid={`collaborator-menu-edit-${index}`}
                                        >
                                          {_('collaborators.menu.edit')}
                                        </button>
                                      </li>
                                    ) : (
                                      <></>
                                    )}
                                    {item.invitationStatus !== 'APPROVED' ? (
                                      <li role="menuitem">
                                        <button
                                          type="button"
                                          onClick={() => sendInvitation({ email: item.email })}
                                        >
                                          {_('collaborators.menu.invite')}
                                        </button>
                                      </li>
                                    ) : (
                                      <></>
                                    )}
                                    {item.invitationStatus !== 'CANCELED' ? (
                                      <li role="menuitem">
                                        <button
                                          type="button"
                                          onClick={() => sendInvitationCancelation(item.email)}
                                        >
                                          {_('collaborators.menu.disable')}
                                        </button>
                                      </li>
                                    ) : (
                                      <></>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Modal
                isOpen={modalOpen}
                type="large"
                handleClose={() => handleModalOpen()}
                modalId="modal-new-collaborator"
                isCenter
              >
                <h2 className="modal-title">{modalStep.title}</h2>
                <p>{modalStep.description}</p>
                {modalError ? (
                  <div className="dp-wrap-message dp-wrap-cancel" role="alert">
                    <span className="dp-message-icon" />
                    <div className="dp-content-message">{modalError}</div>
                  </div>
                ) : (
                  <></>
                )}
                {modalStep.step === modalSteps.initial ? (
                  <CollaboratorInviteForm
                    title={modalStep.title}
                    initialEmail={selectedEmail}
                    existingInvitations={data}
                    onCancel={() => handleModalOpen(false)}
                    onSubmit={goToPermissionsStep}
                  />
                ) : modalStep.step === modalSteps.addPermissions ||
                  modalStep.step === modalSteps.editPermissions ? (
                  <CollaboratorPermissionsForm
                    title={modalStep.title}
                    permissions={availablePermissions}
                    selectedPermissions={selectedPermissionIds}
                    secondaryActionText={
                      modalStep.step === modalSteps.editPermissions
                        ? _('common.cancel')
                        : _('common.back')
                    }
                    submitButtonText={
                      modalStep.step === modalSteps.editPermissions
                        ? _('common.save')
                        : _('common.next')
                    }
                    onSecondaryAction={
                      modalStep.step === modalSteps.editPermissions
                        ? () => handleModalOpen(false)
                        : goBackToInviteStep
                    }
                    onSubmit={
                      modalStep.step === modalSteps.editPermissions
                        ? updateCollaboratorPermissions
                        : formSendInvitation
                    }
                  />
                ) : modalStep.step === modalSteps.addSuccess ||
                  modalStep.step === modalSteps.editSuccess ? (
                  <SuccessStepForm
                    onFinish={handleModalOpen}
                    buttonLabelMessageId={
                      modalStep.step === modalSteps.editSuccess
                        ? 'collaborators.form_modal.edit_success_acknowledge'
                        : 'common.finish'
                    }
                  />
                ) : (
                  <></>
                )}
              </Modal>
            </div>
          </div>
        </section>
      </>
    );
  },
);
