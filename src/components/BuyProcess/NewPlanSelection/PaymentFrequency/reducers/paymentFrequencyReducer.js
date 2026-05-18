export const INITIAL_STATE_PAYMENT_FREQUENCY = {
  paymentFrequencies: [],
  selectedPaymentFrequency: null,
  selectedPaymentFrequencyIndex: -1,
};

export const PAYMENT_FREQUENCY_ACTIONS = {
  RECEIVE_PAYMENT_FREQUENCIES: 'RECEIVE_PAYMENT_FREQUENCIES',
  SELECT_PAYMENT_FREQUENCY: 'SELECT_PAYMENT_FREQUENCY',
};

export const paymentFrequencyReducer = (state, action) => {
  switch (action.type) {
    case PAYMENT_FREQUENCY_ACTIONS.RECEIVE_PAYMENT_FREQUENCIES:
      const { paymentFrequencies, currentSubscriptionUser } = action.payload;

      const selectPaymentFrequencyIndexByDefault = getSelectPaymentFrequencyIndexByDefault(
        paymentFrequencies,
        currentSubscriptionUser,
        state.selectedPaymentFrequencyIndex,
      );

      return {
        ...state,
        paymentFrequencies,
        selectedPaymentFrequency: paymentFrequencies[selectPaymentFrequencyIndexByDefault],
        selectedPaymentFrequencyIndex: selectPaymentFrequencyIndexByDefault,
      };

    case PAYMENT_FREQUENCY_ACTIONS.SELECT_PAYMENT_FREQUENCY:
      const { payload: selectedPaymentFrequency } = action;
      const selectPaymentFrequencyIndexAux =
        state.paymentFrequencies.indexOf(selectedPaymentFrequency);
      const _selectedPaymentFrequencyIndex =
        selectPaymentFrequencyIndexAux !== -1 ? selectPaymentFrequencyIndexAux : 0;

      return {
        ...state,
        selectedPaymentFrequency: state.paymentFrequencies[_selectedPaymentFrequencyIndex],
        selectedPaymentFrequencyIndex: _selectedPaymentFrequencyIndex,
      };
    default:
      return state;
  }
};

const getSelectPaymentFrequencyIndexByDefault = (
  newPaymentFrequencies,
  currentSubscriptionUser,
  selectedPaymentFrequencyIndex,
) => {
  if (!newPaymentFrequencies.length) {
    return -1;
  }

  const index = newPaymentFrequencies.findIndex(
    (pf) => pf.numberMonths === currentSubscriptionUser,
  );
  return index < 0 ? newPaymentFrequencies.length - 1 : index;
};
