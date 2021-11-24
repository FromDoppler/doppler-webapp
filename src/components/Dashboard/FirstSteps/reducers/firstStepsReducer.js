export const PENDING_STATUS = 0;
export const COMPLETED_STATUS = 1;
export const WARNING_STATUS = 2;

export const INFO_BY_STATE = {
  [PENDING_STATUS]: {
    classNames: 'dp-step--number',
  },
  [COMPLETED_STATUS]: {
    classNames: 'dp-step--success',
  },
  [WARNING_STATUS]: {
    classNames: 'dp-step--warning',
  },
};

export const firstStepsFake = {
  completed: false,
  firstSteps: [
    {
      status: PENDING_STATUS,
      title: 'Crea una lista y añade Contactos',
      description:
        "Quiénes recibiran tus envios? Comienza <a href='http://localhost:3000/dashboard'>creando una Lista</a>. Si no sabes como hacerlo <a href='http://localhost:3000/dashboard'>Mira este video tutorial</a>.",
      order: 0,
      textStep: 1,
    },
    {
      status: PENDING_STATUS,
      title: 'Realiza tu primer envío y observa los reportes',
      description:
        'Envia la campaña que haz creado. Puedes revisar el estado de las mismas desde Campañas Enviadas, Campañas Programadas, o Borradores de Campaña.',
      order: 3,
      textStep: 3,
    },
    {
      status: WARNING_STATUS,
      title: 'Configuración de DKIM y SPF',
      description:
        'Es sumamente importante la configuración del DKIM y SPF para evitar que tus mails lleguen como <b>"correo no deseado"</b>. <a href="http://localhost:3000/dashboard">Hagámoslo AHORA!</a>',
      order: 1,
      textStep: null,
    },
    {
      status: PENDING_STATUS,
      title: 'Crea tu primera Campaña',
      description:
        "Continua <a href='http://localhost:3000/dashboard'>creando tu primera Campaña</a>. Tiene tres tipos diferentes para elegir. <a href='http://localhost:3000/dashboard'>Mira este video tutorial</a>.",
      order: 2,
      textStep: 2,
    },
  ],
  notifications: [
    {
      iconClass: 'dp-welcom',
      title: 'Bienvenido! Ya haz creado tu cuenta.',
      description:
        'Continua cumpliendo las acciones recomendadas que te enumerados a continuacion para ir subiendo de nivel :)',
    },
  ],
};

export const orderItem = (currentStep, nextStep) => currentStep.order - nextStep.order;

export const INITIAL_STATE_FIRST_STEPS = {
  firstStepsData: {
    completed: false,
    firstSteps: firstStepsFake.firstSteps,
    notifications: firstStepsFake.notifications,
  },
  loading: false,
  hasError: false,
};

export const FIRST_STEPS_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  RECEIVE_FIRST_STEPS: 'RECEIVE_FIRST_STEPS',
  FETCH_FAILED: 'FETCH_FAILED',
};

export const firstStepsReducer = (state, action) => {
  switch (action.type) {
    case FIRST_STEPS_ACTIONS.FETCHING_STARTED:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case FIRST_STEPS_ACTIONS.RECEIVE_FIRST_STEPS:
      const { payload: firstStepsData } = action;
      return {
        ...state,
        loading: false,
        firstStepsData: {
          ...firstStepsData,
          firstSteps: firstStepsData.firstSteps.sort(orderItem),
          notifications: firstStepsData.notifications.sort(orderItem),
        },
      };
    case FIRST_STEPS_ACTIONS.FETCH_FAILED:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
