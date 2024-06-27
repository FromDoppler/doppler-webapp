import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { Breadcrumb, BreadcrumbItem } from '../../shared/Breadcrumb/Breadcrumb';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { Modal } from './Modal';

export const ColaboratorsSections = InjectAppServices(() => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [activeMenu, setActiveMenus] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const stepOneForm = [
    {
      name: _('colaborators.form_modal.email'),
      type: 'email',
      placeholder: _('colaborators.form_modal.email_placeholder'),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setData([
        {
          email: 'fgonzalez@makingsense.com',
          firstname: 'Fernando',
          lastname: 'Gonzalez',
          invitationDate: '9/9/2019 5:00:24 PM',
          status: 'Pendiente',
        },
        {
          email: 'fgonzalez2@makingsense.com',
          firstname: 'Fernando',
          lastname: 'Gonzalez',
          invitationDate: '9/9/2019 5:00:24 PM',
          status: 'Activa',
        },
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const toggleMenu = (index) => {
    if (activeMenu === index) {
      setActiveMenus(false);
    } else {
      setActiveMenus(index);
    }
  };

  if (loading) {
    return <Loading page />;
  }

  return (
    <>
      <Helmet>
        <title>{_('colaborators.meta_title')}</title>
      </Helmet>
      <HeaderSection>
        <div className="col-sm-12 col-md-12 col-lg-12">
          <Breadcrumb>
            <BreadcrumbItem href={_('common.control_panel_url')} text={_('common.control_panel')} />
            <BreadcrumbItem text={_('colaborators.title')} />
          </Breadcrumb>
          <h2>{_('colaborators.title')}</h2>
        </div>
        <div className="col-sm-7">
          <p>{_('colaborators.subtitle')}</p>
        </div>
        <div className="col-sm-5 text-align--right">
          <button
            type="button"
            className="dp-button button-medium primary-green ng-binding"
            onClick={() => setModalOpen(true)}
          >
            {_('colaborators.add_colaborator')}
          </button>
        </div>
      </HeaderSection>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12 m-t-24 m-b-36">
            <h3 className="m-t-24 m-b-30">{_('colaborators.title_second')}</h3>
            <div className="dp-table-responsive">
              <table
                className="dp-table-multilogin"
                aria-label="Resultado multilogin"
                summary="Resultado de multilogin"
              >
                <thead>
                  <tr>
                    <th aria-label={_('colaborators.table.email')} scope="col">
                      <span>{_('colaborators.table.email')}</span>
                    </th>
                    <th aria-label={_('colaborators.table.firstname')} scope="col">
                      <span>{_('colaborators.table.firstname')}</span>
                    </th>
                    <th aria-label={_('colaborators.table.lastname')} scope="col">
                      <span>{_('colaborators.table.lastname')}</span>
                    </th>
                    <th aria-label={_('colaborators.table.invitation_date')} scope="col">
                      <span>{_('colaborators.table.invitation_date')}</span>
                    </th>
                    <th aria-label={_('colaborators.table.status')} scope="col">
                      <span>{_('colaborators.table.status')}</span>
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
                          <span>{item.status}</span>
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
                                    <button type="button">{_('colaborators.menu.edit')}</button>
                                  </li>
                                  <li role="menuitem">
                                    <button type="button">{_('colaborators.menu.invite')}</button>
                                  </li>
                                  <li role="menuitem">
                                    <button type="button">{_('colaborators.menu.disable')}</button>
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
            {modalOpen ? (
              <Modal
                title={_('colaborators.add_colaborator')}
                subtitle="parrafo de descripcion"
                items={stepOneForm}
                onClose={() => setModalOpen()}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </section>
    </>
  );
});
