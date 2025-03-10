import { InjectAppServices } from '../../services/pure-di';

export const MyPlan = InjectAppServices(() => {
  return (
    <>
      <header class="hero-banner">
        <div class="dp-container">
          <div class="dp-rowflex">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <h2 class="dp-first-order-title">
                Mi Plan <span class="dpicon iconapp-checklist"></span>
              </h2>
            </div>
            <div class="col-sm-7">
              <p>
                Lorem ipsum dolor sit amet consectetur. Ac eleifend diam lobortis montes eget proin
                purus. Faucibus viverra suspendisse molestie viverra.
              </p>
            </div>
          </div>
          <span class="arrow"></span>
        </div>
      </header>
    </>
  );
});
