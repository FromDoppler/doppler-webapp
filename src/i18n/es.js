// Basic constants
const year = new Date().getFullYear();
const urlDopplerLegacy = process.env.REACT_APP_DOPPLER_LEGACY_URL;
const urlSite = `https://www.fromdoppler.com`;
const urlHelp = `https://help.fromdoppler.com/es/`;

// Common URLs
const urlPrivacy = `${urlSite}/legales/privacidad`;
const urlPrivacyWithQueryString = `${urlPrivacy}?utm_source=app&utm_medium=landing&utm_campaign=signup`;
const urlContact = `${urlSite}/contacto`;
const urlControlPanel = `${urlDopplerLegacy}/ControlPanel`;
const urlBuyMonthly = `${urlControlPanel}/AccountPreferences/UpgradeAccount?Plan=monthly`;
const urlSiteTracking = `${urlControlPanel}/CampaignsPreferences/SiteTrackingSettings`;
const urlSiteFromSignup = `${urlSite}/?utm_source=app&utm_medium=landing&utm_campaign=signup`;
const urlSiteFromLogin = `${urlSite}/?utm_source=app&utm_medium=landing&utm_campaign=login`;
const urlSiteFromForgot = `${urlSite}/?utm_source=app&utm_medium=landing&utm_campaign=restablecimiento-contrasenia`;

export default {
  common: {
    cancel: `Cancelar`,
    copyright_MD: `
© ${year} Doppler LLC. Todos los derechos reservados.
[Política de Privacidad y Legales](${urlPrivacy}).
`,
    help: `Ayuda`,
    hide: `Ocultar`,
    message: `Mensaje`,
    recaptcha_legal_HTML: `
      Sitio protegido por reCAPTCHA. <a href="https://policies.google.com/privacy?hl=es">Política de Privacidad</a>
      y <a href="https://policies.google.com/terms?hl=es">Condiciones del Servicio</a> de Google.
      `,
    send: `Enviar`,
    show: `Mostrar`,
  },
  feature_panel: {
    email_automation: `Email Automation`,
    email_automation_description: `Llega con el mensaje adecuado en el momento justo.`,
    email_automation_remarks: `Envía Emails 100% personalizados de acuerdo al comportamiento y los intereses de tus Suscriptores. ¡Gana tiempo y ahorra dinero!`,
    email_editor: `Editor de Emails`,
    email_editor_description: `Crea Emails en minutos y accede a nuestra Galería de Plantillas`,
    email_editor_remarks: `Nuestras Plantillas para Email son totalmente Responsive y fácilmente editables desde nuestro Editor HTML.`,
    forms: `Formularios de suscripción`,
    forms_description: `Suma contactos a tus Listas con Formularios personalizados`,
    forms_remarks: `Clásicos y pop-ups con suscripción Simple o Doble Opt-In. ¡Tú eliges cómo quieres que luzcan, qué datos solicitar y dónde ubicarlos!`,
  },
  footer: {
    iso: `Certificación de Calidad ISO 9001:2008`,
  },
  forgot_password: {
    back_login: `¿Recordaste tu Contraseña? ¡Haz clic aquí y vuelve atrás!`,
    back_login_after_forgot: `Volver al login`,
    button_request: `Solicitar`,
    confirmation_message_HTML: `
      <p>
        ¡Revisa tu casilla!
      </p>
      <p>
        Encontrarás un Email con los pasos a Seguir.
      </p>
      `,
    description: `¡No te preocupes! Nos sucede a todos.`,
    description2: `Ingresa tu Email y te ayudaremos.`,
    url_site: `${urlSiteFromForgot}`,
  },
  header: {
    help_url: `${urlHelp}`,
  },
  loading: `Cargando...`,
  login: {
    button_login: `Solicitar`,
    enter_doppler: `Ingresa a tu cuenta`,
    enter_doppler_sub: `¡Hoy es un buen día para potenciar tu negocio con el poder del Email, Automation & Data Marketing!`,
    error_payment: `La cuenta está bloqueda, por favor contáctate con Soporte.`,
    forgot_password: `¿No recuerdas tu Contraseña?`,
    head_description: `Atrae, convierte y fideliza clientes con el poder del Email Marketing Automation. ¡Ingresa a Doppler!`,
    head_title: `Email Marketing Automation gratis y con envíos ilimitados | Doppler`,
    label_user: `Nombre de Usuario: `,
    placeholder_email: `¡Psst! Es tu Email`,
    signup: `Regístrate gratis`,
    url_site: `${urlSiteFromLogin}`,
    you_want_create_account: `¿Aún no tienes una cuenta?`,
  },
  reports: {
    allow_enable_trial_HTML: `
      <p>
        Activa el periodo de prueba y accede a Reportes detallados sobre el comportamiento de los
        usuarios en tu Sitio Web o E-commerce. Descubre cuáles son las páginas más visitadas, cuántos
        visitantes poseen un Email que Doppler ha identificado y cuántos no.
      </p>
      `,
    allow_enable_trial_button: `Activa período de prueba`,
    allow_enable_trial_title: `Prueba Automation de Comportamiento en Sitio por tiempo limitado`,
    datahub_not_active_HTML: `
      <p>
        Accede a Reportes sobre el comportamiento de los usuarios en tu Sitio Web o E-commerce durante un
        periodo de tiempo. Descubre cuáles son las páginas más visitadas, cuántas de esas visitas poseen
        un Email que Doppler ha identificado y cuántas no. ¡Sigue el recorrido de los usuarios, detecta
        puntos de fuga y oportunidades de mejora!
      </p>
      <p>
        Aún no has habilitado la funcionalidad de Comportamiento en Sitio. Puedes hacerlo desde la opción
        de <a href="${urlSiteTracking}">Seguimiento en Sitio</a> en el Panel de Control.
      </p>
      `,
    datahub_not_active_title: `Trackea el comportamiento de los usuarios y optimiza tus acciones`,
    datahub_not_domains_title: `Agrega el dominio de tu Web y analiza el comportamiento de tus usuarios`,
    no_domains_HTML: `
      <p>
        Registra el o los dominios sobre los que quieres realizar el seguimiento y accede a Reportes
        detallados. Descubre cuáles son las páginas más visitadas de tu Sitio Web o E-commerce, cuántos
        visitantes poseen un Email que Doppler ha identificado y cuántos no. ¿Necesitas ayuda?
        <a target="_blank" href="${urlHelp}/reportes-avanzados">HELP</a>.
      </p>
      `,
    no_domains_button: `Agrega tu dominio`,
    no_domains_button_destination: `${urlSiteTracking}`,
    upgrade_account_free_HTML: `
      <p>
        Contrata un Plan Pago y accede a Reportes detallados sobre el comportamiento de los usuarios en
        tu Sitio Web o E-commerce. Descubre cuáles son las páginas más visitadas, cuántos visitantes
        poseen un Email que Doppler ha identificado y cuántos no. ¿Necesitas ayuda? Presiona
        <a target="_blank" href="${urlHelp}/reportes-avanzados">HELP</a>.
      </p>
      <p>
        Contratando cualquier Plan Pago podrás utilizar esta funcionalidad de forma bonificada por tiempo
        limitado. <a href="${urlBuyMonthly}">COMPRA AHORA</a>.
      </p>
      `,
    upgrade_account_free_title: `Analiza el comportamiento de los usuarios y optimiza tus acciones`,
  },
  reports_box: {
    to: `a`,
    visits_description_with_email: `Número total de usuarios que visitaron tu Sitio Web y cuyo Correo Electrónico ha sido identificado por Doppler. Si un usuario ingresó varias veces, solo se contabilizará una.`,
    visits_description_without_emails: `Número total de usuarios que visitaron tu Sitio Web y cuyo Correo Electrónico no ha sido identificado por Doppler. Si un usuario ingresó varias veces, solo se contabilizará una.`,
    visits_with_email: `Usuarios con Email`,
    visits_without_emails: `Usuarios sin Email`,
  },
  reports_filters: {
    all_pages: `Todas las paginas`,
    description_HTML: `
      <p>
        Descubre cuáles son las páginas más visitadas de tu Sitio Web o E-commerce, cuántos
        visitantes poseen un Email que Doppler ha identificado y cuántos no. ¡Sigue el recorrido de
        los usuarios, detecta puntos de fuga y oportunidades de mejora! Si necesitas ayuda, presiona
        <a target="_blank" href="${urlHelp}/reportes-avanzados">HELP</a>.
      </p>
      `,
    domain: `Dominio`,
    domain_not_verified: `Sin visitas registradas`,
    pages: `Página`,
    rank_time: `Período de tiempo analizado`,
    title: `Analiza el comportamiento de los usuarios y optimiza tu estrategia`,
    verified_domain: `Última visita registrada:`,
    week_with_plural: `{weeksCount, plural, =0 {sin semanas} one {# semana}other {# semanas} }`,
  },
  reports_pageranking: {
    top_pages: `Páginas más visitadas`,
    top_pages_sub_head: `Las Sesiones comprenden el número total de visitas registradas durante el periodo. Si un usuario ingresó varias veces, se contabilizarán todas.`,
    total_visits: `Sesiones`,
  },
  reports_title: `Doppler | Reportes`,
  signup: {
    activate_account_instructions: `* Al hacer click en el botón que aparece en el Email, activarás tu cuenta y estarás listo para disfrutar todos los beneficios de Doppler.`,
    button_signup: `Crea tu cuenta gratis`,
    check_inbox: `Revisa tu casilla. ¡Tienes un Email!`,
    check_inbox_icon_description: `Fíjate en tu correo electrónico`,
    do_you_already_have_an_account: `¿Tienes una cuenta?`,
    email_not_received: `¿No has recibido el Email?`,
    head_description: `Atrae, convierte y fideliza clientes con el poder del Email Marketing Automation. ¡Ingresa a Doppler!`,
    head_title: `Email Marketing Automation gratis y con envíos ilimitados | Doppler`,
    label_email: `Email: `,
    label_firstname: `Nombre: `,
    label_lastname: `Apellido: `,
    label_password: `Contraseña: `,
    label_phone: `Teléfono: `,
    legal_HTML: `
      <p>
        Doppler te informa que los datos de carácter personal que nos proporciones al rellenar el presente
        formulario serán tratados por Doppler LLC como responsable de esta web.
      </p>
      <p>
        <strong>Finalidad:</strong> Darte de alta en nuestra plataforma y brindarte los servicios que nos
        requieras.
      </p>
      <p>
        <strong>Legitimación:</strong> Consentimiento del interesado.
      </p>
      <p>
        <strong>Destinatarios:</strong> Tus datos serán guardados por Doppler, Zoho como CRM,
        Digital Ocean, Cogeco Peer1 y Rackspace como empresas de hosting.
      </p>
      <p>
        <strong>Información adicional:</strong> En la
        <a target="_blank" href="${urlPrivacyWithQueryString}">Política de Privacidad</a> de Doppler
        encontrarás información adicional sobre la recopilación y el uso de su información personal por
        parte de Doppler, incluida información sobre acceso, conservación, rectificación, eliminación,
        seguridad, transferencias transfronterizas y otros temas.
      </p>
      `,
    log_in: `Ingresa`,
    no_more_resend: `¿Aún no has recibido el Email? Ya te lo hemos reenviado, si no llega en los próximos minutos, por favor contáctate con Soporte`,
    placeholder_email: `Tu Email será tu Nombre de Usuario`,
    placeholder_password: `Escribe tu clave secreta`,
    placeholder_phone: `9 11 2345-6789`,
    privacy_policy_consent_HTML: `
      Acepto la <a target="_blank" href="${urlPrivacyWithQueryString}">Política de Privacidad</a>
      de Doppler.
      `,
    promotions_consent: `Quiero recibir promociones de Doppler y sus aliados.`,
    resend_email: `Reenvíalo`,
    sign_up: `Email, Automation & Data Marketing`,
    sign_up_sub: `Atrae, Convierte y Fideliza. Envíos ilimitados y gratis hasta 500 Suscriptores.`,
    thanks_for_registering: `Gracias por registrarte`,
    url_site: `${urlSiteFromSignup}`,
  },
  upgradePlanForm: {
    message_placeholder: `Tu mensaje`,
    plan_select: `Selecciona el Plan`,
    title: `Solicita una actualización de tu Plan`,
  },
  validation_messages: {
    error_account_is_blocked_invalid_pass_HTML: `
      Por seguridad hemos bloqueado tu cuenta momentáneamente.
      <a href="${urlContact}" target="_blank">Contáctanos<a>.
      `,
    error_account_is_canceled_HTML: `
      Tu cuenta se encuentra cancelada. Para más información
      <a target="_blank" href="${urlContact}">contáctanos</a>.
      `,
    error_checkbox_policy: `¡Ouch! No has aceptado la Política de Privacidad de Doppler.`,
    error_email_already_exists: `¡Ouch! Ya posees una cuenta en Doppler.`,
    error_invalid_domain_to_register_account: `¡Ouch! Email inválido para crear una cuenta.`,
    error_invalid_email_address: `¡Ouch! El formato del Email es incorrecto`,
    error_invalid_login: `¡Ouch! Hay un error en tu Usuario o Contraseña. Vuelve a intentarlo.`,
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
    error_unexpected: `Error inesperado. Por favor, intenta nuevamente o contacta a Soporte.`,
  },
};
