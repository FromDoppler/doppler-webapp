import { InjectAppServices } from '../../../services/pure-di';
import { CustomReports } from './CustomReports';
import { DedicatedEnvironment } from './DedicatedEnvironment';
import { DedicatedIP } from './DedicatedIP';
import { LandingPages } from './LandingPages';
import { LayoutService } from './LayoutService';
import { ListConditioning } from './ListConditioning';
import { Sms } from './Sms';
import { TransactionalEmails } from './TransactionalEmails';

export const AddOns = InjectAppServices(({ dependencies: { appSessionRef } }) => {
  const { sms, landings } = appSessionRef.current.userData.user;

  var hasLandings = landings?.landingPacks.filter((lp) => lp.packageQty > 0).length > 0;
  var hasSms = sms.remainingCredits > 0;

  return (
    <div className="dp-container col-p-l-0 col-p-r-0">
      <div className="dp-rowflex">
        <div className="col-lg-9 col-md-12 m-b-24">
          <ListConditioning></ListConditioning>
          <CustomReports></CustomReports>
          {!hasSms && <Sms sms={sms}></Sms>}
          <LayoutService></LayoutService>
          <DedicatedEnvironment></DedicatedEnvironment>
          <DedicatedIP></DedicatedIP>
          <TransactionalEmails></TransactionalEmails>
          {!hasLandings && <LandingPages></LandingPages>}
        </div>
        <div className="col-lg-3 col-sm-12">
          <div className="dp-box-shadow">
            <p>Add-ons - Columna</p>
          </div>
        </div>
      </div>
    </div>
  );
});
