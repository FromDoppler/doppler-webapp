export const INITIAL_STATE = {
  validationFormData: {},
  loading: false,
  hasError: false,
};

export const VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS = {
  START_FETCH: 'START_FETCH',
  FINISH_FETCH: 'FINISH_FETCH',
  FAIL_FETCH: 'FAIL_FETCH',
};

export const validateMaxSubscribersFormReducer = (state, action) => {
  switch (action.type) {
    case VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS.START_FETCH:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS.FINISH_FETCH:
      return {
        ...state,
        loading: false,
        validationFormData: action.payload,
      };
    case VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS.FAIL_FETCH:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
