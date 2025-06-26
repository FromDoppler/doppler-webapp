import { CustomReports } from './CustomReports';
import { DedicatedEnvironment } from './DedicatedEnvironment';
import { LayoutService } from './LayoutService';
import { ListConditioning } from './ListConditioning';
import { Sms } from './Sms';

export const AddOns = () => {
  return (
    <div className="dp-container col-p-l-0 col-p-r-0">
      <div className="dp-rowflex">
        <div className="col-lg-9 col-md-12 m-b-24">
          <ListConditioning></ListConditioning>
          <CustomReports></CustomReports>
          <Sms></Sms>
          <LayoutService></LayoutService>
          <DedicatedEnvironment></DedicatedEnvironment>
        </div>
        <div className="col-lg-3 col-sm-12">
          <div className="dp-box-shadow">
            <p>Add-ons - Columna</p>
          </div>
        </div>
      </div>
    </div>
  );
};
