import React, { useEffect, useState } from 'react';
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

const modalSteps = {
  initial: 'INITIAL_STEP',
  addPermissions: 'ADD_PERMISSIONS_STEP',
  addSuccess: 'ADD_SUCCESS_STEP',
  editPermissions: 'EDIT_PERMISSIONS_STEP',
  editSuccess: 'EDIT_SUCCESS_STEP',
};

export const CollaboratorsSections = InjectAppServices(
  ({ dependencies: { dopplerUserApiClient, appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [loading, setLoading] = useState(true);
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
    const [refreshTable, setRefreshTable] = useState(false);
    const [permissionsLoaded, setPermissionsLoaded] = useState(false);
    const [invitationsLoaded, setInvitationsLoaded] = useState(false);
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

    const modalEditPermissionsStep = {
      step: modalSteps.editPermissions,
      title: _('collaborators.form_modal.edit_permissions_title'),
      description: _('collaborators.form_modal.permissions_description'),
    };

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
      const fetchPermissions = async () => {
        const permissions = await dopplerUserApiClient.getAvailableCollaboratorSections();
        if (permissions.success) {
          setAvailablePermissions(permissions.value);
        }

        setPermissionsLoaded(true);
      };

      fetchPermissions();
    }, [dopplerUserApiClient]);

    useEffect(() => {
      const fetchInvitations = async () => {
        const invitations = await dopplerUserApiClient.getCollaborationInvites();
        if (invitations.success) {
          setData(invitations.value);
        }

        setInvitationsLoaded(true);
      };

      fetchInvitations();
    }, [dopplerUserApiClient, refreshTable]);

    useEffect(() => {
      if (permissionsLoaded && invitationsLoaded) {
        setLoading(false);
      }
    }, [invitationsLoaded, permissionsLoaded]);

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

    const goToPermissionsStep = (email) => {
      setmodalError(null);
      setSelectedEmail(email);
      setModalStep(modalPermissionsStep);
    };

    const goToEditPermissionsStep = (collaborator) => {
      setActiveMenus(false);
      setmodalError(null);
      setSelectedEmail(collaborator.email);
      setSelectedCollaboratorUserId(collaborator.idUser);
      setSelectedCollaboratorUserAccountId(collaborator.idUserAccount);
      setSelectedPermissionIds(collaborator.sections || []);
      setModalStep(modalEditPermissionsStep);
      setModalOpen(true);
    };

    const goBackToInviteStep = (permissions = []) => {
      setmodalError(null);
      setSelectedPermissionIds(permissions);
      setModalStep(modalFirstStep);
    };

    const formSendInvitation = async (permissions) => {
      setmodalError(null);
      setSelectedPermissionIds(permissions);
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
      setSelectedPermissionIds(permissions);

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
          <div className="col-sm-7">
            <p>{_('collaborators.subtitle')}</p>
          </div>
          <div className="col-sm-5 text-align--right">
            <button
              type="button"
              className="dp-button button-medium primary-green ng-binding"
              onClick={() => handleModalOpen(true)}
            >
              {_('collaborators.add_collaborator')}
            </button>
          </div>
        </HeaderSection>
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 m-t-24 m-b-36">
              <h3 className="m-t-24 m-b-30">{_('collaborators.title_second')}</h3>
              <div className="dp-table-responsive">
                <table
                  className="dp-table-multilogin"
                  aria-label="Resultado multilogin"
                  summary="Resultado de multilogin"
                >
                  <thead>
                    <tr>
                      <th aria-label={_('collaborators.table.email')} scope="col">
                        <span>{_('collaborators.table.email')}</span>
                      </th>
                      <th aria-label={_('collaborators.table.firstname')} scope="col">
                        <span>{_('collaborators.table.firstname')}</span>
                      </th>
                      <th aria-label={_('collaborators.table.lastname')} scope="col">
                        <span>{_('collaborators.table.lastname')}</span>
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
                        <td aria-label="Nombre">
                          <span>{item.firstname}</span>
                        </td>
                        <td aria-label="Apellido">
                          <span>{item.lastname}</span>
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
                                    <li role="menuitem">
                                      <button
                                        type="button"
                                        onClick={() => goToEditPermissionsStep(item)}
                                        data-testid={`collaborator-menu-edit-${index}`}
                                      >
                                        {_('collaborators.menu.edit')}
                                      </button>
                                    </li>
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
                type="medium"
                handleClose={() => handleModalOpen()}
                modalId="modal-new-collaborator"
              >
                <h2 className="modal-title">{modalStep.title}</h2>
                <p>{modalStep.description}</p>
                {modalError ? (
                  <div className="dp-msj-error dpsg-slow-animation bounceIn">
                    <p>{modalError}</p>
                  </div>
                ) : (
                  <></>
                )}
                {modalStep.step === modalSteps.initial ? (
                  <CollaboratorInviteForm
                    title={modalStep.title}
                    initialEmail={selectedEmail}
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
