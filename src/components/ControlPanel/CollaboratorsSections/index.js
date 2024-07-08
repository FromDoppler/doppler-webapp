import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { Breadcrumb, BreadcrumbItem } from '../../shared/Breadcrumb/Breadcrumb';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { CollaboratorInviteForm } from './Forms/CollaboratorInviteForm';
import { SuccessStepForm } from './Forms/SuccessStepForm';
import Modal from '../../Modal/Modal';

export const CollaboratorsSections = InjectAppServices(
  ({ dependencies: { dopplerUserApiClient } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [activeMenu, setActiveMenus] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalError, setmodalError] = useState(null);
    const [refreshTable, setRefreshTable] = useState(false);

    const modalFirstStep = {
      step: 'INITIAL_STEP',
      title: _('collaborators.add_collaborator'),
      description: _('collaborators.form_modal.description'),
    };

    const modalFinalStep = {
      step: 'FINAL_STEP',
      title: _('collaborators.form_modal.success_title'),
      description: _('collaborators.form_modal.success_subtitle'),
    };

    const [modalStep, setModalStep] = useState(modalFirstStep);

    const handleModalOpen = (open) => {
      if (open) {
        setModalOpen(open);
      } else {
        setModalStep(modalFirstStep);
        setModalOpen(open);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        const invitations = await dopplerUserApiClient.getCollaborationInvites();
        if (invitations.success) {
          setData(invitations.value);
        }

        setLoading(false);
      };

      fetchData();
    }, [dopplerUserApiClient, refreshTable]);

    const toggleMenu = (index) => {
      if (activeMenu === index) {
        setActiveMenus(false);
      } else {
        setActiveMenus(index);
      }
    };

    const sendInvitation = async (email) => {
      const result = await dopplerUserApiClient.sendCollaboratorInvite(email);
      if (result.success) {
        setModalStep(modalFinalStep);
        setRefreshTable(!refreshTable);
      } else {
        setmodalError(_('common.unexpected_error'));
      }
    };

    if (loading) {
      return <Loading page />;
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
                            <span>{item.invitationDate}</span>
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
                                  className={`dp-button button-medium dp-button-dropdown dp-three-points-vertical ${
                                    activeMenu === index ? 'active' : ''
                                  }`}
                                  onClick={() => toggleMenu(index)}
                                  aria-controls="dp-exit-editor"
                                ></button>
                                <div
                                  className="dp-content-menu"
                                  style={{
                                    display: `${activeMenu === index ? 'block' : 'none'}`,
                                  }}
                                >
                                  <ul className="dp-list-dropdown" id="dropdown">
                                    <li role="menuitem">
                                      <button type="button">{_('collaborators.menu.edit')}</button>
                                    </li>
                                    <li role="menuitem">
                                      <button type="button">
                                        {_('collaborators.menu.invite')}
                                      </button>
                                    </li>
                                    <li role="menuitem">
                                      <button type="button">
                                        {_('collaborators.menu.disable')}
                                      </button>
                                    </li>
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
                {modalStep.step === 'INITIAL_STEP' ? (
                  <CollaboratorInviteForm title={modalStep.title} onSubmit={sendInvitation} />
                ) : modalStep.step === 'FINAL_STEP' ? (
                  <SuccessStepForm
                    onBack={() => setModalStep(modalFirstStep)}
                    onFinish={handleModalOpen}
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
