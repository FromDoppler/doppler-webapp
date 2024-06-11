import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { Breadcrumb, BreadcrumbItem } from '../../shared/Breadcrumb/Breadcrumb';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';

export const ColaboratorsSections = InjectAppServices(() => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

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
          <button className="dp-button button-medium primary-green ng-binding">
            {_('colaborators.add_colaborator')}
          </button>
        </div>
      </HeaderSection>
      <div class="dp-container">
        <div class="dp-rowflex">
          <div class="col-sm-12 col-md-12 col-lg-12">
            <table className="dp-c-table">
              <caption></caption>
              <thead>
                <tr>
                  <th>
                    <span>{_('colaborators.table.email')}</span>
                  </th>
                  <th>
                    <span>{_('colaborators.table.firstname')}</span>
                  </th>
                  <th>
                    <span>{_('colaborators.table.lastname')}</span>
                  </th>
                  <th>
                    <span>{_('colaborators.table.invitation_date')}</span>
                  </th>
                  <th>
                    <span>{_('colaborators.table.status')}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr>
                    <td>
                      <span>{item.email}</span>
                    </td>
                    <td>{item.firstname}</td>
                    <td>{item.lastname}</td>
                    <td>{item.invitationDate}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
});
