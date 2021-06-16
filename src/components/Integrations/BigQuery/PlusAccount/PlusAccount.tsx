import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import  MultiInputContainer from './MultiInputContainer'

interface IPlusAccountProps {
  values?: string[];
  onChange: (newValues: string[]) => void;
}

const PlusAccount: React.FunctionComponent<IPlusAccountProps> = (props) => {
    const intl = useIntl();
    const _ = (id: string, values: any) => intl.formatMessage({ id: id }, values);
    const [values, setValues] = React.useState<string[]>([]);

    return (
    <>
      <header className="hero-banner">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <nav className="dp-breadcrumb">
                <ul>
                  <li>
                    <a href="#">{_('big_query.plus_beginning', '')}</a>
                  </li>
                  <li>
                    <a href="#">{_('big_query.plus_configuration', '')}</a>
                  </li>
                  <li>
                    <a href="#">{_('big_query.plus_control_panel', '')}</a>
                  </li>
                  <li>{_('big_query.plus_big_query', '')}</li>
                </ul>
              </nav>
              <h2>{_('big_query.plus_title', '')}</h2>
            </div>
            <div className="col-sm-7">
              <p>
              {_('big_query.plus_paragraph_one', '')} <a href="www.datastudio.com">{_('big_query.plus_paragraph_two', '')}</a> {_('big_query.plus_paragraph_three', '')}
              </p>
            </div>
          </div>
          <span className="arrow"></span>
        </div>
      </header>
      <div className="dp-container">
        <div className="dp-rowflex">
            <div className="col-lg-6">
                <div>
                  <h4>1er Paso</h4>
                  <strong>Agregar permiso para cuentas de google. <a href="www.datastudio.com">{_('big_query.plus_paragraph_two', '')}</a>
                  </strong>
                </div>
                
                <div className="dp-rowflex p-t-54">
                  <MultiInputContainer values={values} onChange={setValues} />
                </div>
                <div>
                <button type="button" className="dp-button button-medium primary-green"> Iniciar campaña </button>
                <button type="button" className="dp-button button-medium primary-grey">Iniciar campaña </button>
                </div>

            </div>
            <div className="col-lg-6">

            </div>
            <hr/>
        </div>
      </div>
    </>
  );
};

export default PlusAccount;
