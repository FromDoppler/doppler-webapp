import { useState } from 'react';

export const PlanBenefits = () => {
  const [open, setOpen] = useState(true);

  const toogleOpen = () => setOpen(!open);

  return (
    <section className="m-t-42">
      <h3 className="dp-second-order-title">Beneficios plan</h3>
      <div className="dp-table-plans dp-table-description-plan">
        <div className="dp-table-responsive">
          <table className="dp-c-table m-b-24" aria-label="" summary="">
            <tbody>
              {planBenefits.map((item, index) => (
                <tr key={`id-${index}`}>
                  <td>
                    <span>
                      <strong>{item.name}</strong>
                    </span>
                  </td>
                  <td>
                    <div className="dp-icon-lock">
                      <span className="dp-ico--ok"></span>
                      <span>{item.feature}</span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <span className="dp-name-text">
                    <button
                      type="button"
                      className={`dp-expand-results ${open ? 'dp-open-results' : ''}`}
                      onClick={toogleOpen}
                    >
                      <i className="ms-icon icon-arrow-next" />
                    </button>
                    <strong>Costos Adicionales</strong>
                  </span>
                </td>
                <td>
                  <div className="dp-icon-lock">
                    <span className="ico-extra-cost" />
                    <span>Costos extras</span>
                  </div>
                </td>
              </tr>
              <tr className={`dp-expanded-table ${open ? 'show' : ''}`}>
                <td className="dp-list-results" colspan="2">
                  <table className="dp-table-results">
                    <tbody>
                      <tr>
                        <td>
                          <ul className="dp-additional-cost">
                            <li>
                              <div className="dp-icon-lock">
                                <span className="dp-ico--ok" /> <span>Conversación adicional.</span>
                              </div>
                            </li>
                            <li>
                              <div className="dp-icon-lock">
                                <span className="dp-ico--ok"></span> <span>Agente adicional.</span>
                              </div>
                            </li>
                            <li>
                              <div className="dp-icon-lock">
                                <span className="dp-ico--ok"></span> <span>Canal adicional.</span>
                              </div>
                            </li>
                          </ul>
                        </td>
                        <td>
                          <ul className="dp-additional-cost">
                            <li>
                              <strong>US$00.00*</strong>
                            </li>
                            <li>
                              <strong>US$04.00*</strong>
                            </li>
                            <li>
                              <strong>US$00.00*</strong>
                            </li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <p>
                            *Podrá contratar adicionales desde Mi Plan una vez superados los valores
                            establecidos por su plan.
                          </p>
                          <p>
                            Etiam rhoncus leo ut ante faucibus laoreet. Cras eros nibh, semper
                            sodales ex id, ullamcorper mattis.
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const planBenefits = [
  {
    name: 'Chat en Sitio Web',
    feature: 'Incluido en todos los planes',
  },
  {
    name: 'Chat en Facebook Messenger',
    feature: 'Incluido en todos los planes',
  },
  {
    name: 'Chat en Instagram',
    feature: 'Incluido en todos los planes',
  },
  {
    name: 'Chat en WhatsApp Business API',
    feature: 'Incluido en todos los planes pagos',
  },
  {
    name: 'Envio de mensajes en WhatsApp Business API',
    feature: 'Incluido en todos los planes pagos',
  },
  {
    name: 'Generador de Leads',
    feature: 'Incluido en todos los planes',
  },
  {
    name: 'Mensajes por árbol de conversaciones',
    feature: 'Incluido en todos los planes pagos',
  },
  {
    name: 'Integraciones personalizadas',
    feature: 'Incluido en todos los planes pagos',
  },
  {
    name: 'Etiquetas',
    feature: 'Incluido en todos los planes',
  },
  {
    name: 'Mensajes predeterminados ',
    feature: 'Incluido en todos los planes',
  },
  {
    name: 'Seguimiento de mensajes',
    feature: 'Incluido en todos los planes',
  },
  {
    name: 'Atención colaborativa',
    feature: 'Incluido en todos los planes',
  },
  {
    name: 'Soporte',
    feature: 'Incluido en todos los planes',
  },
];
