import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useDefaultPlanType } from '../../../hooks/useDefaultPlanType';
import { InjectAppServices } from '../../../services/pure-di';
import { thousandSeparatorNumber } from '../../../utils';
import { BreadcrumbNew, BreadcrumbNewItem } from '../../shared/BreadcrumbNew';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { Slider } from '../Slider';

export const PlanChat = InjectAppServices(({ dependencies: { planService, appSessionRef } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const { planType: planTypeUrlSegment } = useParams();
  useDefaultPlanType({ appSessionRef, planTypeUrlSegment, window });

  return (
    <>
      <HeaderSection>
        <div className="col-sm-12 col-md-12 col-lg-12">
          <BreadcrumbNew>
            <BreadcrumbNewItem
              href={_('buy_process.plan_selection.breadcumb_plan_url')}
              text={_('buy_process.plan_selection.breadcumb_plan_text')}
            />
            <BreadcrumbNewItem
              href={_('buy_process.plan_selection.breadcumb_plan_url')}
              text={'Plan de chat'}
            />
          </BreadcrumbNew>
          <h2 className="dp-first-order-title">
            Quieres agregar un plan de chat?
            <span className="dpicon iconapp-chatting" />
          </h2>
        </div>
      </HeaderSection>
      <div className="dp-container p-b-48">
        <div className="dp-rowflex">
          <div className="col-md-12 col-lg-8 m-b-24">
            <p>
              Contactanos para que Lorem ipsum dolor sit amet consectetur. Ac eleifend diam lobortis
              montes eget proin purus. Faucibus viverra suspendisse molestie viverra.
            </p>
            <section className="dp-rowflex m-t-24">
              <div className="col-lg-6">
                <h6>
                  <strong>Subtitulo</strong>
                </h6>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Ac eleifend diam lobortis montes eget
                  proin purus. Faucibus viverra suspendisse molestie viverra hac.
                </p>
              </div>
              <div className="col-lg-6">
                <h6>
                  <strong>Subtitulo</strong>
                </h6>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Ac eleifend diam lobortis montes eget
                  proin purus. Faucibus viverra suspendisse molestie viverra hac.
                </p>
              </div>
            </section>
            <section className="m-t-42">
              <h3 className="dp-second-order-title">¿Cuántas conversaciones necesitas por mes?</h3>
              <Slider
                items={[1000, 2000, 3500, 5000, 10000]}
                selectedItemIndex={0}
                handleChange={() => null}
                labelQuantity={`${thousandSeparatorNumber(
                  intl.defaultLocale,
                  1000,
                )} conversaciones`}
              />
            </section>
            <section>
              <div className="dp-boxgrey">
                <div className="dp-price">
                  <h2>US$ 30,00*/mes</h2>
                  <span>
                    Antes <span className="dp-line-through">US$ 41,00*</span>
                  </span>
                </div>
                <h3>Plan Conversaciones*</h3>
                <ul className="dp-items-plan">
                  <li>
                    <div className="dp-icon-lock">
                      <span className="dp-ico--ok"></span>{' '}
                      <span>Incluye hasta 500 conversaciones</span>
                    </div>
                  </li>
                  <li>
                    <div className="dp-icon-lock">
                      <span className="dp-ico--ok"></span> <span>1 Agente</span>
                    </div>
                  </li>
                  <li>
                    <div className="dp-icon-lock">
                      <span className="dp-ico--ok"></span> <span>4 Canales</span>
                    </div>
                  </li>
                </ul>
                <hr className="dp-h-divider m-t-12 m-b-12" />
                <button type="button" className="dp-button button-medium ctaTertiary">
                  Agregar al carrito
                </button>
              </div>
              <span className="dp-reminder">
                *Recuerda que al contratar un plan de conversaciones, finalizara de manera
                automática la versión de prueba de tres meses.
              </span>
            </section>
          </div>
        </div>
      </div>
    </>
  );
});
