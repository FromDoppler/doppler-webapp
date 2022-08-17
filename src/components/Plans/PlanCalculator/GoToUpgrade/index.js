import React from 'react';
import { PlanCalculator } from '..';
import { InjectAppServices } from '../../../../services/pure-di';

//TODO: In the future, this component should be replaced to PlanCalculator component.
export const GoToUpgrade = InjectAppServices(() => {
  return <PlanCalculator />;
});
