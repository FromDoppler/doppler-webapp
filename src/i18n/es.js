import signupBannerImagePath from '../img/signup-es.png';
import loginBannerImagePath from '../img/login-es.png';

// Basic constants
const year = new Date().getFullYear();
const urlDopplerLegacy = process.env.REACT_APP_DOPPLER_LEGACY_URL;
const urlSite = `https://www.fromdoppler.com`;
const urlHelp = `https://help.fromdoppler.com/es`;
const urlShopify = process.env.REACT_APP_SHOPIFY_URL;
const dopplerUiLibraryVersion = process.env.REACT_APP_DOPPLER_UI_LIBRARY_VERSION;

// Common URLs
const urlHelpAdvancedReports = `${urlHelp}/reportes-avanzados`;
const urlPrivacy = `${urlSite}/legal/privacidad`;
const urlPrivacyFromSignup = `${urlPrivacy}`;
const urlPrivacyFromSignup_HTMLEncoded = `${urlPrivacy}`;
const urlPrivacyFromLogin = `${urlPrivacy}`;
const urlPrivacyFromForgot = `${urlPrivacy}`;
const mailtoSupport = `mailto:soporte@fromdoppler.com`;
const mailtoAdmin = `mailto:administracion@fromdoppler.com`;
const subjectBlockedAccountNoPay = `?subject=Cuenta%20suspendida%20por%20falta%20de%20pago%20-%20Login`;
const subjectCanceledAccountNoPay = `?subject=Cuenta%20cancelada%20por%20falta%20de%20pago%20-%20Login`;
const subjectCanceledAccountOtherReason = `?subject=Cuenta%20cancelada%20-%20Login`;
const subjectBlockedAccountInvalidPassword = `?subject=Cuenta%20bloqueada%20por%20intentos%20fallidos%20-%20Login`;
const urlControlPanel = `${urlDopplerLegacy}/ControlPanel`;
const urlBuyMonthly = `${urlControlPanel}/AccountPreferences/UpgradeAccount?Plan=monthly`;
const urlSiteTracking = `${urlControlPanel}/CampaignsPreferences/SiteTrackingSettings`;
const urlSiteFromSignup = `${urlSite}/`;
const urlSiteFromLogin = `${urlSite}/`;
const urlSiteFromForgot = `${urlSite}/`;
const urlSiteContact = `${urlSite}/contacto/`;
const urlControlPanelMain = `${urlControlPanel}/ControlPanel`;
const urlMasterSubscriber = `${urlDopplerLegacy}/Lists/MasterSubscriber/`;
const urlDraft = `${urlDopplerLegacy}/Campaigns/Draft/`;
const urlUpgradePlan = `${urlDopplerLegacy}/ControlPanel/AccountPreferences/UpgradeAccount`;

const messages_es = {
  agencies: {
    breadcrumb: 'Planes',
    breadcrumb_url: `${urlBuyMonthly}`,
    feature_access: 'Acceso al panel de Client Manager para gestionar las cuentas de tus clientes.',
    feature_admin: 'Administración de perfiles de usuario y permisos de acceso para tus clientes.',
    feature_consultancy: 'Asesoramiento exclusivo para gestionar múltiples cuentas.',
    feature_custom: 'Personalización con el logo de tu empresa.',
    feature_reports: 'Reportes Avanzados sobre el desempeño de las Campañas.',
    features_title: '¿Qué incluye el Plan para Agencias?',
    form_legend: 'Completa este Formulario y te contactaremos en breve.',
    label_volume: 'Volumen de Emails por mes:',
    submit: 'Solicitar demo',
    submitted: 'Continuar en Doppler',
    subtitle_MD: `Conoce todo lo que el Email Marketing puede hacer por tu Agencia con una **demo personalizada**.`,
    success_msg: '¡Excelente! Nos pondremos en contacto contigo.',
    title: 'Plan para Agencias',
    volume_0: 'Menos de 500k',
    volume_10m: 'Más de 10m',
    volume_1m: 'Entre 1m y 10m',
    volume_500: 'Entre 500k y 1m',
    volume_do_not_know: 'No lo sé',
  },
  big_query: {
    free_alt_image: `big query`,
    free_btn_redirect: `Conoce nuestro plan Plus`,
    free_text_data_studio_MD: `Aprende a configurar nuestro tablero de [Data Studio en unos pocos pasos](https://datastudio.google.com/overview),
    o accede a BigQuery mediante otra herramienta de visualización de datos como Tableau.`,
    free_text_strong: `¡Potencia tu cuenta con reportes de BigQuery!`,
    free_text_summary: `Integra Google BigQuery para analizar reportes detallados sobre tus campañas,tus suscriptores y otros datos de tu cuenta en un tablero personalizable.`,
    free_title: `Big Query`,
    free_ul_item_filter: `Podras filtrar los reportes en base a todas tus campañas o seleccionar solo algunas en particular.`,
    free_ul_item_insights: `Obtén valiosos insights sobre tu cuenta`,
    upgrade_plan_url: `${urlUpgradePlan}`,
  },
  change_plan: {
    all_of_plan: `Todo lo de {plan} más:`,
    ask_demo: 'Solicita una demo',
    banner_exclusive_features_description: 'Si necesitas funcionalidades especiales, podemos brindarte un servicio pensado para ti.',
    banner_exclusive_features_title: 'Solicita características personalizadas para tu negocio',
    big_data_tooltip: 'Funcionalidad Big Data',
    calculate_price: 'Calcular Precio',
    card_agencies_description: 'Gestiona y monitorea las cuentas de tus clientes desde un solo lugar.',
    card_agencies_title: 'Agencias',
    card_free_description: 'Prueba Doppler GRATIS sin contratos ni tarjetas de crédito. Hasta 500 Contactos.',
    card_free_title: 'GRATUITO',
    card_plus_description: 'Funciones avanzadas para profesionales que necesitan mas personalización.',
    card_plus_title: 'Plus',
    card_standard_description: 'Prueba nuestros planes que se ajusten mas a tus necesidades: mensuales o prepagos.',
    card_standard_title: 'Standard',
    compare_features: 'Comparar Funcionalidades',
    current_plan: 'Plan Actual',
    features_HTML_agencies: `
    <option>Administración de varias cuentas</option>
    <option>Administración de permisos</option>
    <option>Administración de roles</option>`,
    features_HTML_free: `
    <option>Atención al Cliente</option>
    <option>Campañas Convencionales</option>
    <option>Campañas Automation</option>`,
    features_HTML_plus: `
    <star>Atención preferencial</star>
    <newOption>Detener Campañas</newOption>
    <option>Landing pages con dominio personalizado</option>
    <newBigData>Recomendación de Asuntos</newBigData>`,
    features_HTML_standard: `
    <option>Acceso a la API de Doppler</option>
    <option>Campañas Automation de Comportamiento en Sitio</option>
    <option>Envíos con tu firma personalizada</option>`,
    features_title_plus: 'Todo lo de standard mas:',
    features_title_standard: 'Todo lo de gratis mas:',
    increase_action_monthly_deliveries: 'Aumentar Envíos',
    increase_action_prepaid: 'Comprar Créditos',
    increase_action_subscribers: 'Aumentar Contactos',
    link_exclusive_features: 'Contáctanos',
    new_label: 'Nuevo',
    per_month: 'por mes',
    recommended: 'Recomendado',
    since: 'Desde',
    title: 'Planes a la medida de tu negocio',
    until_x_subscribers: `Hasta {subscribers} Contactos.`,
  },
  common: {
    advanced_preferences: `Integraciones y Preferencias Avanzadas`,
    back: `Atrás`,
    cancel: `Cancelar`,
    connect: `Conectar`,
    control_panel: `Panel de Control`,
    control_panel_advanced_pref_url: `${urlControlPanelMain}?section=AdvancedPreferences`,
    control_panel_section_url: `${urlControlPanel}`,
    control_panel_url: `${urlControlPanelMain}`,
    copyright_MD: `© ${year} Doppler LLC. Todos los derechos reservados. [Política de Privacidad y Legales](${urlPrivacy}).`,
    draft_url: `${urlDraft}`,
    emails: 'Emails',
    empty_data: `Tu dominio no tiene datos para mostrar en esta sección aún.`,
    feature_no_available: `La funcionalidad no está disponible aún`,
    hide: `Ocultar`,
    message: `Mensaje`,
    message_last_plan:`Cuéntanos tus necesidades y diseñaremos el Plan perfecto para ti`,
    message_success:`¡Hecho! Tu solicitud ha sido enviada`,
    new: `Nueva`,
    recaptcha_legal_MD: `Sitio protegido por reCAPTCHA. [Política de Privacidad](https://policies.google.com/privacy?hl=es) y [Condiciones del Servicio](https://policies.google.com/terms?hl=es) de Google.`,
    save: `Guardar`,
    send: `Enviar`,
    show: `Mostrar`,
    synchronizing: `Syncronizando`,
    ui_library_image: `https://cdn.fromdoppler.com/doppler-ui-library/${dopplerUiLibraryVersion}/img/{imageUrl}`,
    unexpected_error: `¡Ouch! Ocurrio un error inesperado, intenta nuevamente`,
  },
  contact_policy: {
    amount_description: 'Enviar hasta',
    interval_description: 'en un plazo de',
    interval_unit: 'días',
    meta_title: 'Doppler | Política de Contacto',
    subtitle_MD: `
Define la **cantidad máxima de Emails** que tus Suscriptores podrán recibir en un período de tiempo determinado.

¿Quieres saber más? Presiona [HELP](${urlHelp}/politica-de-contacto).`,
    success_msg: 'Cambios guardados con éxito.',
    title: 'Política de Contacto',
    toggle_text: 'Definir número máximo de envíos',
  },
  default_banner_data: {
    background_url: `https://cdn.fromdoppler.com/doppler-ui-library/${dopplerUiLibraryVersion}/img/violet-yellow.png`,
    description: 'Clásicos y pop-ups con suscripción Simple o Doble Opt-In. ¡Tú eliges cómo quieres que luzcan, qué datos solicitar y dónde ubicarlos!',
    functionality: 'Formularios de suscripción',
    image_url: `https://cdn.fromdoppler.com/doppler-ui-library/${dopplerUiLibraryVersion}/img/login-es.png`,
    title: 'Suma contactos a tus Listas con Formularios personalizados',
  },
  empty_notification_text: `No tienes notificaciones pendientes.`,
  exclusive_form: {
    advisory: 'Asesoría y Consultoría.',
    breadcrumb: 'Planes',
    breadcrumb_url: `${urlBuyMonthly}`,
    custom_onboarding: 'Onboarding personalizado',
    custom_reports: 'Reportes a medida',
    dedicated_ip: 'IPs Dedicadas',
    demo: 'ENVIAR',
    description: '¿Necesitas funcionalidades especiales para tu negocio? Cuéntanos cuáles son y podremos ayudarte con un Plan pensado para ti.',
    design_layout_emails: 'Diseño, maquetacion y envio de Emails',
    development_custom_features: 'Desarrollo de Funcionalidades personalizadas',
    features_for_you: 'Funcionalidades a tu medida',
    form_features: 'Selecciona las características que te interesan:',
    form_hour_contact: '¿En qué horario podemos llamarte?',
    form_legend: 'Completa el siguiente formulario de planes',
    form_title: 'Completa este Formulario y te contactaremos en breve.',
    message: 'Cuéntanos que necesitas',
    meta_description: 'Características especiales pensados para los usuarios más exigentes.',
    new: 'Nueva',
    others: 'Otras',
    strategic_accompaniment: 'Acompañamiento Estratégico.',
    success: '¡Excelente! Nos pondremos en contacto a la brevedad',
    testAb: 'Campañas Test A/B',
    title: 'Características personalizadas',
  },
  faq: {
    answer_1: `En tu cuenta, selecciona Actualizar Plan. Elige tu Plan y completa tus datos. Haz clic en "Poseo un código de promoción", luego ingrésalo y valídalo.`,
    answer_2: `Dependiendo de la cantidad de Contactos que poseas, puedes adquirir un Plan Mensual de Alto Volumen que se adecuará mejor a tu necesidad y tendrá un menor costo por Email.`,
    answer_3: `Los Créditos de Planes Prepagos no tienen ningún tipo de restricción ni vencimiento. Podrás utilizarlos para hacer tus envíos cuando lo desees.`,
    answer_4: `Podrás pagar con Tarjetas de Crédito internacionales (Mastercard, VISA o Amex). En México, Argentina o España, también con transferencia bancaria a partir de US$77.`,
    answer_5: `No existe un tiempo mínimo que debas cumplir dentro de Doppler. Solo se cobrará el mes vigente. Si necesitas un contrato, este puede realizarse pero no es excluyente.`,
    answer_6: `Si has seleccionado un Plan de Pago por adelantado, luego de cumplirse el tiempo pactado, el mismo se renovará automáticamente por el mismo período de tiempo elegido.`,
    question_1: `¿Cómo se aplica un Código de Promoción para acceder a un descuento?`,
    question_2: `¿Se puede adquirir un Plan Mensual para más de 100.000 Contactos?`,
    question_3: `¿Los Créditos de Planes Prepagos tienen fecha límite para su uso?`,
    question_4: `¿Cuáles son los métodos de pago disponibles para adquirir un Plan Pago?`,
    question_5: `¿Existe un contrato o mínimo de permanencia al comprar un Plan Pago?`,
    question_6: `¿Cómo es la renovación del Plan al pagar por adelantado 3, 6, o 12 meses?`,
    title: `Preguntas frecuentes`,
  },
  feature_panel: {
    email_automation: `Email Automation`,
    email_automation_description: `Llega con el mensaje adecuado en el momento justo`,
    email_automation_remarks: `Envía Emails 100% personalizados de acuerdo al comportamiento y los intereses de tus Suscriptores. ¡Gana tiempo y ahorra dinero!`,
    forms: `Formularios de suscripción`,
    forms_description: `Suma contactos a tus Listas con Formularios personalizados`,
    forms_remarks: `Clásicos y pop-ups con suscripción Simple o Doble Opt-In. ¡Tú eliges cómo quieres que luzcan, qué datos solicitar y dónde ubicarlos!`,
  },
  footer: {
    iso: `Certificación de Calidad ISO 9001:2008`,
  },
  forgot_password: {
    back_login: `¿Recordaste tu Contraseña? ¡Haz clic aquí y vuelve atrás!`,
    back_login_after_forgot: `Volver al Log in`,
    blocked_account_MD: `Tu cuenta se encuentra cancelada. Para más información [contáctanos](${urlSiteContact}).`,
    button_request: `Solicitar`,
    confirmation_message_MD: `
¡Revisa tu casilla!

Encontrarás un Email con los pasos a seguir.`,
    copyright_MD: `© ${year} Doppler LLC. Todos los derechos reservados. [Política de Privacidad y Legales](${urlPrivacyFromForgot}).`,
    description: `¡No te preocupes! Nos sucede a todos. Ingresa tu Email y te ayudaremos a recuperarla.`,
    expired_data: `Tus datos expiraron. Por favor regresa al Email que te enviamos para restablecer tu contraseña.`,
    expired_link: `¡Link expirado! Por favor haz click en ¿No recuerdas tu contraseña?.`,
    image_path: `${loginBannerImagePath}`,
    max_attempts_sec_question: `No ha respondido correctamente. Por favor, inicie nuevamente el proceso para reestablecer su contraseña de Doppler. `,
    pass_reset_ok: `¡Tu Contraseña ha sido actualizada exitosamente!`,
    placeholder_email: `¡Psst! Es el Email con el que creaste tu cuenta`,
    url_site: `${urlSiteFromForgot}`,
  },
  forms: {
    label_contact_schedule: `¿En qué horario podemos llamarte?`,
    label_email: `Email: `,
    label_firstname: `Nombre: `,
    label_lastname: `Apellido: `,
    label_phone: `Teléfono: `,
    placeholder_phone: `9 11 2345-6789`,
  },
  header: {
    availables: 'disponibles',
    help_url: `${urlHelp}`,
    plan_emails: 'Emails',
    plan_prepaid: 'Plan Prepago',
    plan_suscribers: 'Suscriptores',
  },
  invoices_list: {
    amount_column: `Importe`,
    balance_column: `A Saldar`,
    control_panel_account_preferences_url: `${urlControlPanelMain}?section=AccountPreferences`,
    control_panel_billing_information_section: `Información de Facturación`,
    control_panel_billing_information_url: `${urlControlPanel}/AccountPreferences/BillingInformationSettings`,
    control_panel_section: `Panel de Control`,
    creation_date_column: `Fecha Creación`,
    currency_column: `Moneda`,
    date_column: `Fecha`,
    document_FC: `Factura`,
    document_NC: `Nota de Crédito`,
    document_number_column: `Número Comprobante`,
    document_type_column: `Tipo Comprobante`,
    download_msg: `Descargar`,
    downloads_column: `Descargas`,
    due_date_column: `Fecha Vencimiento`,
    error_msg: `¡Ouch! Ocurrió un error al intentar cargar tus facturas.`,
    no_data_msg: `Aún no hay facturas emitidas para mostrar.`,
    no_download_msg: `Aún no hay factura para descargar`,
    paid_to_date_column: `Pagado`,
    sub_title: `Aquí está detalle de las facturas que hemos emitido. Recuerda que puedes descargar cada una.`,
    title: `Facturas Emitidas`,
  },
  loading: `Cargando...`,
  login: {
    button_login: `Ingresa`,
    copyright_MD: `© ${year} Doppler LLC. Todos los derechos reservados. [Política de Privacidad y Legales](${urlPrivacyFromLogin}).`,
    enter_doppler: `Ingresa a tu cuenta`,
    enter_doppler_sub: `¡Hoy es un buen día para potenciar tu negocio con el poder del Email, Automation & Data Marketing!`,
    forgot_password: `¿No recuerdas tu Contraseña?`,
    head_description: `Atrae, convierte y fideliza clientes con el poder del Email Marketing Automation. ¡Ingresa a Doppler!`,
    head_title: `Email Marketing Automation gratis y con envíos ilimitados | Doppler`,
    image_path: `${loginBannerImagePath}`,
    label_user: `Nombre de Usuario: `,
    placeholder_email: `¡Psst! Es tu Email`,
    signup: `Regístrate gratis`,
    url_site: `${urlSiteFromLogin}`,
    you_want_create_account: `¿Aún no tienes una cuenta?`,
  },
  master_subscriber: {
    header_title: `Reporte de Actividad General del Suscriptor`,
    page_description: `Mediante este reporte usted podrá conocer la actividad general de un suscriptor determinado`,
    page_title: `Doppler | Historial por Suscriptor`,
    search_form: {
      aria_label: `Formulario de filtros para buscar Historial de Suscriptores`,
      aria_search_field: `Ingrese un Email, Nombre o Apellido para buscar Historial de Suscriptor`,
      search_field_placeholder: `Busca un suscriptor por su Email, Nombre o Apellido...`,
      search_form_legend: `Busqueda avanzada de Historial de Suscriptor`,
    },
    table_result: {
      aria_label_email: `Email`,
      aria_label_lastname: `Apellido`,
      aria_label_name: `Nombre`,
      aria_label_score: `Puntuación`,
      aria_label_state: `Estado`,
      aria_label_table: `Resultado de Historial de Suscriptores`,
    },
  },
  master_subscriber_current_search: {
    grid_email: `Email`,
    grid_firstname: `Nombre`,
    grid_lastname: `Apellido`,
    grid_ranking: `Ranking`,
    grid_status: `Estado`,
  },
  master_subscriber_sent_campaigns: {
    grid_campaign: `Campaña`,
    grid_clicks: `Clicks Únicos`,
    grid_delivery: `Comportamiento`,
    grid_subject: `Asunto`,
  },
  pagination: {
    go_back_pages: 'Retroceder 5 páginas',
    go_foward_pages: 'Avanzar 5 páginas',
  },
  plan_calculator: {
    banner_for_monthly_deliveries: `¿Necesitas algo que no has podido encontrar? Te recomendamos nuestros Planes a Medida. <Link>CONTÁCTANOS</Link> y te asesoraremos.`,
    banner_for_prepaid: `¿Necesitas una mayor cantidad de Emails? Conoce nuestros <Link>PLANES DE ALTO VOLUMEN</Link>.`,
    banner_for_subscribers: `¿Tienes más de 100.000 Suscriptores? Te recomendamos nuestros <Link>PLANES DE ALTO VOLUMEN</Link>.`,
    banner_for_unknown: ' ',
    button_back: 'Volver a Planes',
    button_purchase: 'Contratar',
    button_purchase_tooltip: 'Modifica las características de tu plan actual para poder continuar',
    discount_clarification: 'La renovación es automática y puedes cancelarla cuando quieras. Estos valores no incluyen impuestos.',
    discount_half_yearly: 'Semestral',
    discount_monthly: 'Mensual',
    discount_quarterly: 'Trimestral',
    discount_title: 'Suscripción',
    discount_yearly: 'Anual',
    per_month: 'por mes',
    plan_plus_title: 'Plan PLUS',
    plan_standard_title: 'Plan STANDARD',
    plan_type_monthly_deliveries: 'por Envíos',
    plan_type_monthly_deliveries_tooltip: '¿Envías grandes cantidades de Emails por mes? Garantiza la llegada de tus Campañas con mayor rapidez de envío y menor costo por Email.',
    plan_type_prepaid: 'por Créditos',
    plan_type_prepaid_tooltip: '¿Envías Campañas en forma esporádica? Compra solo los Créditos que necesites para cada ocasión. ¡No tienen vencimiento y son acumulables!',
    plan_type_subscribers: 'por Contactos',
    plan_type_subscribers_tooltip: '¿Realizas envíos frecuentes? Escoge un Plan basado en la cantidad de Suscriptores que posees, sin límite de envíos. Si pagas 3, 6 o 12 meses por adelantado, ¡ahorras hasta un 25%!.',
    subtitle: 'Elige el tipo de plan y utiliza el slider para calcular el costo final de tu Plan.',
    suggestion_for_monthly_deliveries: '¿Realizas más de 10.000.000 de envíos? <Link>Contáctanos y te asesoraremos.</Link>',
    suggestion_for_prepaid: ' ',
    suggestion_for_subscribers: '¿Tienes más de 100.000 contactos? Te recomendamos nuestros <Bold>PLANES POR ENVÍOS</Bold>, <Link>contáctanos y te asesoraremos.</Link>',
    suggestion_for_unknown: ' ',
    with_half_yearly_discount: 'El pago semestral será de',
    with_quarterly_discount: 'El pago trimestral será de',
    with_yearly_discount: 'El pago anual será de',
  },
  plans: {
    monthly_deliveries_amount_description: 'Emails',
    prepaid_amount_description: 'Créditos',
    subscribers_amount_description: 'Contactos',
    unknown_amount_description: ' ',
  },
  reports: {
    allow_enable_trial_MD: `Activa el periodo de prueba y accede a Reportes detallados sobre el comportamiento de los
    usuarios en tu Sitio Web o E-commerce. Descubre cuáles son las páginas más visitadas, cuántos
    visitantes poseen un Email que Doppler ha identificado y cuántos no. ¿Necesitas ayuda? [HELP](${urlHelpAdvancedReports}).`,
    allow_enable_trial_button: `Activa período de prueba`,
    allow_enable_trial_title: `Prueba Automation de Comportamiento en Sitio por tiempo limitado`,
    datahub_not_domains_title: `Agrega el dominio de tu Web y analiza el comportamiento de tus usuarios`,
    no_domains_MD: `
Registra el o los dominios sobre los que quieres realizar el seguimiento y accede a Reportes
detallados. Descubre cuáles son las páginas más visitadas de tu Sitio Web o E-commerce, cuántos
visitantes poseen un Email que Doppler ha identificado y cuántos no. ¿Necesitas ayuda? [HELP](${urlHelpAdvancedReports}).`,
    no_domains_button: `Agrega tu dominio`,
    no_domains_button_destination: `${urlSiteTracking}`,
    upgrade_account_free_MD: `
Accede a **Reportes detallados** para entender el comportamiento de los
visitantes de tu Sitio Web o E-commerce. Descubre cuáles son las páginas más
visitadas, cuántos visitantes ya están en tus Listas de Suscriptores y cuántos no.
¿Quieres saber más? Presiona [HELP](${urlHelpAdvancedReports}).

**Contrata cualquier Plan Pago para acceder a esta funcionalidad.** [REVISAR LOS PLANES](${urlBuyMonthly}).
      `,
    upgrade_account_free_title: `Analiza el comportamiento de tus visitantes y optimiza tus acciones`,
  },
  reports_box: {
    to: `a`,
    visits_description_with_email: `Número total de usuarios que visitaron tu Sitio Web y cuyo Correo Electrónico ha sido identificado por Doppler. Si un usuario ingresó varias veces, solo se contabilizará una.`,
    visits_description_without_emails: `Número total de usuarios que visitaron tu Sitio Web y cuyo Correo Electrónico no ha sido identificado por Doppler. Si un usuario ingresó varias veces, solo se contabilizará una.`,
    visits_with_email: `Usuarios con Email`,
    visits_without_emails: `Usuarios sin Email`,
    without_included: `(sin incluir)`,
  },
  reports_daily_visits: {
    title: `Páginas vistas únicas`,
    tooltip_page_views: `Páginas vistas: `,
    tooltip_with_email: `Usuarios con Email: `,
    tooltip_without_email: `Usuarios sin Email: `,
  },
  reports_filters: {
    all_pages: `Todas las paginas`,
    description_MD: `
Descubre cuáles son las páginas más visitadas de tu Sitio Web o E-commerce, cuántos visitantes poseen un Email que Doppler ha identificado y cuántos no. ¡Sigue el recorrido de
los usuarios, detecta puntos de fuga y oportunidades de mejora! Si necesitas ayuda, presiona [HELP](${urlHelpAdvancedReports}).
      `,
    domain: `Dominio`,
    domain_not_verified_MD: `Tu dominio no está verificado. Es necesario para comenzar a obtener datos sobre tus visitas. [VERIFICAR DOMINIO](${urlSiteTracking}).`,
    pages: `Página`,
    rank_time: `Período de tiempo analizado`,
    title: `Analiza el comportamiento de los usuarios y optimiza tu estrategia`,
    today: `Hoy`,
    verified_domain: `Última visita registrada:`,
    week_with_plural: `{weeksCount, plural, =0 {sin semanas} one {# semana}other {# semanas} }`,
  },
  reports_hours_visits: {
    few_visits: `0 a {max}`,
    lot_visits: `+{min}`,
    medium_visits: `{min} a {max}`,
    title: `Días de semana y horas`,
    users: `Páginas vistas:`,
    users_with_email: `Usuarios con email:`,
    users_without_email: `Usuarios sin email:`,
  },
  reports_pageranking: {
    more_results: `Mostrar mas resultados`,
    top_pages: `Páginas más visitadas`,
    total_visits: `Visitas`,
    visits_with_email: `Visitas de usuarios con Email`,
    visits_without_email: `Visitas de usuarios sin Email`,
  },
  reports_partials_campaigns: {
    campaign_name: `Nombre de la  Campaña: `,
    campaign_state: `Estado de la Campaña `,
    campaign_subject: `Asunto: `,
    campaign_summary: `Resumen de la Campaña`,
    delivery_rate: `Tasa de entrega`,
    emails_delivered: `Emails Entregados:`,
    hard_and_soft: `Rebotes Hard y Soft`,
    header_description_shipped: `Tu Campaña ha sido enviada. Estas son las métricas finales de tu envío.`,
    header_description_shipping: `Tu Campaña está en progreso. Estas son las métricas parciales de tu envío.`,
    header_title_shipped: `Reporte de Campaña`,
    header_title_shipping: `Reporte Parcial`,
    last_click_date: `Último Click:`,
    last_open_date: `Última Apertura:`,
    not_open: `No Abiertos`,
    opened: `Abiertos`,
    page_description: `Reporte parcial`,
    page_title: `Doppler | Reporte parcial`,
    shipped: `Enviada`,
    shipping: `Enviando`,
    total_clicks: `Clicks Totales:`,
    total_forwarded: `Cantidad de Reenvíos:`,
    total_openings: `Total de Aperturas:`,
    total_recipients: `Destinatarios totales`,
    total_sent_so_far: `Emails enviados hasta el momento`,
    total_subscribers: `Total de Suscriptores:`,
    total_unsubscribers: `Cantidad de Remociones:`,
    unique_clicks: `Clicks Únicos:`,
    unique_opens: `Aperturas Únicas:`,
  },
  reports_title: `Doppler | Reportes`,
  shopify: {
    admin_apps: `Panel de control de Shopify`,
    admin_apps_url: `https://{shopName}/admin/apps`,
    connect_url: `${urlShopify}/install`,
    error_cannot_access_api: `Ouch! No pudimos conectar con la API de Shopify, por favor vuelve a intentarlo luego.`,
    header_disconnected_warning: `Al presionar "Conectar" serás redirigido a Shopify, donde podrás realizar todos los pasos necesarios para integrar.`,
    header_store: `Nombre de la cuenta:`,
    header_subtitle_MD: `
Envía automáticamente los Contactos de tu tienda y toda su información a una Lista de Doppler. Además, podrás importar los productos de tu tienda en
Plantillas de Email y crear Automations de Carrito Abandonado y Producto Visitado. ¿Tienes dudas? Presiona [HELP](${urlHelp}/como-integrar-doppler-y-shopify/).`,
    header_synchronization_date: `Fecha de última sincronización:`,
    header_title: `Conecta Doppler con tu tienda Shopify`,
    list_subtitle: `Puedes sincronizar los datos manualmente cuando gustes.`,
    list_title: `Lista sincronizada`,
    no_list_available: `Esperando Lista...`,
    table_list: `Nombre de la Lista`,
    table_shopify_customers_count: `Suscriptores`,
    title: `Doppler | Shopify`,
  },
  signup: {
    activate_account_instructions: `* Al hacer click en el botón que aparece en el Email, activarás tu cuenta y estarás listo para disfrutar todos los beneficios de Doppler.`,
    button_signup: `Crea tu cuenta gratis`,
    check_inbox: `Revisa tu casilla. ¡Tienes un Email!`,
    check_inbox_icon_description: `Fíjate en tu correo electrónico`,
    copyright_MD: `© ${year} Doppler LLC. Todos los derechos reservados. [Política de Privacidad y Legales](${urlPrivacyFromSignup}).`,
    do_you_already_have_an_account: `¿Tienes una cuenta?`,
    email_not_received: `¿No has recibido el Email?`,
    head_description: `Atrae, convierte y fideliza clientes con el poder del Email Marketing Automation. ¡Ingresa a Doppler!`,
    head_title: `Email Marketing Automation gratis y con envíos ilimitados | Doppler`,
    image_path: `${signupBannerImagePath}`,
    label_email: `Email: `,
    label_firstname: `Nombre: `,
    label_lastname: `Apellido: `,
    label_password: `Contraseña: `,
    label_phone: `Teléfono: `,
    legal_MD: `
Doppler te informa que los datos de carácter personal que nos proporciones al rellenar el presente formulario serán tratados por Doppler LLC como responsable de esta web.

**Finalidad:** Darte de alta en nuestra plataforma y brindarte los servicios que nos requieras..

**Legitimación:** Consentimiento del interesado..

**Destinatarios:** Tus datos serán guardados por Doppler, Zoho como CRM, Google como proveedor del servicio de reCAPTCHA,
Digital Ocean, Cogeco Peer1 y Rackspace como empresas de hosting.

**Información adicional:** En la [Política de Privacidad](${urlPrivacyFromSignup_HTMLEncoded}) de Doppler encontrarás información adicional sobre
la recopilación y el uso de su información personal por parte de Doppler, incluida información sobre acceso, conservación, rectificación,
eliminación, seguridad, transferencias transfronterizas y otros temas.
  `,
    log_in: `Ingresa`,
    no_more_resend_MD: `¿Aún no has recibido el Email? Ya te lo hemos reenviado, si no llega en los próximos minutos, por favor [contáctate con Soporte](${mailtoSupport}).`,
    placeholder_email: `Tu Email será tu Nombre de Usuario`,
    placeholder_password: `Escribe tu clave secreta`,
    placeholder_phone: `9 11 2345-6789`,
    privacy_policy_consent_MD: `Acepto la [Política de Privacidad](${urlPrivacyFromSignup_HTMLEncoded}) de Doppler.`,
    promotions_consent: `Quiero recibir promociones de Doppler y sus aliados.`,
    resend_email: `Reenvíalo`,
    sign_up: `Email, Automation & Data Marketing`,
    sign_up_sub: `Atrae, Convierte y Fideliza. Envíos ilimitados y gratis hasta 500 Suscriptores.`,
    thanks_for_registering: `Gracias por registrarte`,
    url_site: `${urlSiteFromSignup}`,
  },
  subscriber: {
    status: {
      active: 'Activo',
      inactive: 'Activo no Asociado a Listas',
      pending: 'Pendiente',
      standBy: 'En Espera de Ampliación de Plan',
      unsubscribed_by_client: 'Removido por el Cliente',
      unsubscribed_by_hard: 'Removido por Rebote Hard',
      unsubscribed_by_never_open: 'Removido por No Aperturas',
      unsubscribed_by_soft: 'Removido por Rebote Soft',
      unsubscribed_by_subscriber: 'Removido por el Suscriptor',
    },
  },
  subscriber_gdpr: {
    consent: 'Consentimiento:',
    description: 'Aquí encontrarás el historial de todos los consentimientos dados por tu Suscriptor.',
    download_permission_history: 'Descargar historial completo',
    empty_data: 'Este Suscriptor no ha aceptado ni rechazado ningun permiso.',
    empty_html_text: 'Sin texto legal definido',
    latest_results: 'Últimos 10 resultados',
    modification_date: 'Fecha de modificación:',
    modification_source: 'Origen:',
    modification_source_ip: 'IP origen de modificación:',
    permission_description: 'Texto personalizado',
    permission_name: 'Nombre del campo',
    permission_value: 'Valor',
    title: 'Historial de permisos RGPD del Suscriptor',
    value_false: 'Rechazado',
    value_none: 'Sin respuesta',
    value_true: 'Aceptado',
  },
  subscriber_history: {
    alt_image: 'Preview de la Campaña',
    delivery_status: {
      hardBounced: 'Rebotado Hard',
      notOpened: 'No Abierto',
      opened: 'Abierto',
      softBounced: 'Rebotado Soft',
    },
    description: 'Aquí podrás conocer el historial de comportamiento en Campañas de tus Suscriptores.',
    empty_data: 'Hasta el momento no hay Campañas enviadas',
    subscriber_breadcrumb: 'Suscriptores',
    subscriber_breadcrumb_url: `${urlMasterSubscriber}`,
    table_result: {
      aria_label_table: `Resultado de Historial de Campañas`,
    },
    title: 'Comportamiento histórico del Suscriptor',
    unsubscribed_date: 'Fecha de Remoción:',
  },
  trafficSources: {
    direct: `Directo`,
    email: `Email`,
    organic: `Búsqueda Orgánica`,
    paid: `Publicidad en Buscadores`,
    referral: `Referencia`,
    social: `Redes Sociales`,
    title: `Fuentes de trafico`,
    users_with_email: `Usuarios con email`,
    users_without_email: `Usuarios sin email`,
  },
  upgradePlanForm: {
    message_placeholder: `Tu mensaje`,
    plan_select: `Selecciona el Plan`,
    title: `Solicita una actualización de tu Plan`,
  },
  validation_messages: {
    error_account_contact_zoho_chat: `<button>Chatea con el equipo de Atención al Cliente</button> para solucionarlo.`,
    error_account_is_blocked_disabled_by_cm: `Esta cuenta fue bloqueada por el administrador. Contáctate para más información: `,
    error_account_is_blocked_invalid_password: `¡Ouch! Esta cuenta ha sido bloqueada debido a intentos de acceso fallidos.`,
    error_account_is_blocked_invalid_password_contact_support_MD: `Por favor [contacta al equipo de Atención al Cliente](${mailtoAdmin + subjectBlockedAccountInvalidPassword}) para solucionarlo.`,
    error_account_is_blocked_invalid_password_zoho_chat_msg: `¡Hola! ¿Me ayudas con mi cuenta bloqueada por intentos fallidos?`,
    error_account_is_blocked_not_pay: `¡Ouch! Esta cuenta ha sido suspendida por falta de pago.`,
    error_account_is_blocked_not_pay_contact_support_MD: `Por favor [contacta al equipo de Atención al Cliente](${mailtoAdmin + subjectBlockedAccountNoPay}) para solucionarlo.`,
    error_account_is_blocked_not_pay_zoho_chat_msg: `¡Hola! ¿Me ayudas con mi cuenta suspendida por falta de pago?`,
    error_account_is_canceled_not_pay: `¡Ouch! Esta cuenta ha sido cancelada por falta de pago.`,
    error_account_is_canceled_not_pay_contact_support_MD: `Por favor [contacta al equipo de Atención al Cliente](${mailtoAdmin + subjectCanceledAccountNoPay}) para solucionarlo.`,
    error_account_is_canceled_not_pay_zoho_chat_msg: `¡Hola! ¿Me ayudas con mi cuenta cancelada por falta de pago?`,
    error_account_is_canceled_other_reason: `¡Ouch! Esta cuenta ha sido cancelada.`,
    error_account_is_canceled_other_reason_contact_support_MD: `Por favor [contacta al equipo de Atención al Cliente](${mailtoAdmin + subjectCanceledAccountOtherReason}) para solucionarlo.`,
    error_account_is_canceled_other_reason_zoho_chat_msg: `¡Hola! ¿Me ayudas con mi cuenta cancelada?`,
    error_checkbox_policy: `¡Ouch! No has aceptado la Política de Privacidad de Doppler.`,
    error_email_already_exists: `¡Ouch! Ya posees una cuenta en Doppler.`,
    error_has_accents: `¡Ouch! El Email no debe contener tildes ni acentos.`,
    error_invalid_captcha: `¡Ouch! No pudimos validar que seas humano, por favor refresca la pantalla e intenta nuevamente.`,
    error_invalid_domain: `¡Ouch! Algo salió mal. Por favor revisa que tu Email sea correcto o intenta con otro.`,
    error_invalid_domain_to_register_account: `¡Ouch! Email inválido para crear una cuenta.`,
    error_invalid_email_address: `¡Ouch! El formato del Email es incorrecto`,
    error_invalid_login: `¡Ouch! Hay un error en tu Usuario o Contraseña. Vuelve a intentarlo.`,
    error_invalid_name: `¡Ouch! Escribe usando solo letras y no números.`,
    error_min_length: `¡Ouch! Minimo de caracteres invalido.`,
    error_min_length_2: `¡Ouch! Escribe al menos dos caracteres.`,
    error_password_character_length: `8 caracteres como mínimo`,
    error_password_digit: `Un número`,
    error_password_letter: `Una letra`,
    error_password_safe: `¡Tu Contraseña es segura!`,
    error_phone_invalid: `¡Ouch! Escribe un teléfono válido.`,
    error_phone_invalid_country: `¡Ouch! El código de país no es válido.`,
    error_phone_too_long: `¡Ouch! El número de teléfono es demasiado largo.`,
    error_phone_too_short: `¡Ouch! El número de teléfono es demasiado corto.`,
    error_register_denied: `¡Alto ahí! Has alcanzado el límite de cuentas permitido.`,
    error_required_field: `¡Ouch! El campo está vacío.`,
    error_unexpected_MD: `¡Ouch! Detectamos un problema de conexión. Por favor inténtalo nuevamente en unos minutos.`,
    error_unexpected_register_MD: `¡Ouch! Algo salió mal. Por favor, vuelve a intentarlo más tarde o [contacta a nuestro equipo de Soporte](${mailtoSupport}).`,
  },
};

export default messages_es;
