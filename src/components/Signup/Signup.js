import React from 'react';

export default function() {
  return (
    <main className="panel-wrapper">
      <article className="main-panel">
        <header>
          <img src="img/doppler-logo.svg" className="logo-doppler" alt="Doppler" />
          <small className="content-signin">
            ¿Ya tienes una cuenta?{' '}
            <a href="/" className="link-green" target="_blank">
              INGRESA
            </a>
          </small>
        </header>
        <h5>Regístrate</h5>
        <p className="content-subtitle">Crea una cuenta GRATIS hasta 500 Suscriptores.</p>
        <form className="signup-form">
          <fieldset>
            <legend>Datos personales</legend>
            <ul className="field-group">
              <li>
                <ul className="field-group">
                  <li className="field-item field-item--50 error">
                    <label htmlFor="name">Nombre:</label>
                    <input type="name" name="name" id="name" placeholder="Nombre" />
                    <div className="wrapper-errors bounceIn">
                      <p className="error-message">¡Ouch! Este campo está vacío</p>
                    </div>
                  </li>
                  <li className="field-item field-item--50 error">
                    <label htmlFor="lastname">Apellido:</label>
                    <input type="lastname" name="name" id="lastname" placeholder="Apellido" />
                    <div className="wrapper-errors bounceIn">
                      <p className="error-message">¡Ouch! Este campo está vacío</p>
                    </div>
                  </li>
                </ul>
              </li>
              <li className="field-item error">
                <label htmlFor="phone">Teléfono:</label>
                <input type="tel" name="phone" id="phone" placeholder="9 11 2345-6789" />
                <div className="wrapper-errors bounceIn">
                  <p className="error-message">¡Ouch! Este campo está vacío</p>
                </div>
              </li>
            </ul>
          </fieldset>
          <fieldset>
            <ul className="field-group">
              <legend>Usuario y contraseña</legend>
              <li className="field-item error">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Tu Email será tu nombre de usuario"
                />
                <div className="wrapper-errors bounceIn">
                  <p className="error-message">¡Ouch! Este campo está vacío</p>
                </div>
              </li>
              <li className="field-item">
                <label htmlFor="password">Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Escribe tu clave secreta"
                />
                <div className="wrapper-password">
                  <p className="password-message">
                    <span className="waiting-message">8 caracteres como mínimo</span>
                    <span className="waiting-message">Un dígito</span>
                  </p>
                  <p className="password-message">
                    <span className="lack-message">8 caracteres como mínimo</span>
                    <span className="waiting-message">Un dígito</span>
                  </p>
                  <p className="password-message">
                    <span className="complete-message">8 caracteres como mínimo</span>
                    <span className="lack-message">Un dígito</span>
                  </p>
                  <p className="password-message">
                    <span className="secure-message">¡Tu contraseña es segura!</span>
                  </p>
                </div>
              </li>
            </ul>
          </fieldset>
          <fieldset>
            <legend>Política de privacidad y promociones</legend>
            <ul className="field-group">
              <li className="field-item field-item__checkbox error">
                <input type="checkbox" name="acepto_politicas" />
                <span className="checkmark" />
                <label htmlFor="acepto_politicas">
                  {' '}
                  Acepto la{' '}
                  <a className="link-green" href="/">
                    Política de Privacidad
                  </a>{' '}
                  de Doppler.
                </label>
                <div className="wrapper-errors bounceIn">
                  <p className="error-message">¡Ouch! Este campo está vacío</p>
                </div>
              </li>
              <li className="field-item field-item__checkbox">
                <input type="checkbox" name="acepto_promociones" />
                <span className="checkmark" />
                <label htmlFor="acepto_promociones">
                  Acepto recibir las promociones de Doppler y sus aliados.
                </label>
              </li>
            </ul>
            <button type="button" className="dp-button button--round button-medium primary-green">
              Crear cuenta
            </button>
          </fieldset>
        </form>
        <div className="content-legal">
          <p>
            Doppler te informa que los datos de carácter personal que nos proporciones al rellenar
            el presente formulario serán tratados por Making Sense LLC (Doppler) como responsable de
            esta web.
          </p>
          <p>
            <strong>Finalidad:</strong> Darte de alta en nuestra plataforma y brindarte los
            servicios que nos requieras.
          </p>
          <p>
            <strong>Legitimación:</strong> Consentimiento del interesado.
          </p>
          <p>
            <strong>Destinatarios:</strong> Tus datos serán guardados por Doppler, Zoho como CRM,
            Digital Ocean, Cogeco Peer1 y Rackspace como empresas de hosting.
          </p>
          <p>
            <strong>Información adicional:</strong> En la{' '}
            <a href="/" className="link-green" target="_blank">
              Política de Privacidad
            </a>{' '}
            de Doppler encontrarás información adicional sobre la recopilación y el uso de su
            información personal por parte de Doppler, incluida información sobre acceso,
            conservación, rectificación, eliminación, seguridad, transferencias transfronterizas y
            otros temas.
          </p>
        </div>
        <p className="content-promotion">
          Pst! si tienes un código promocional podrás ingresarlo al confirmar tu cuenta.{' '}
          <a href="/" className="link-green" target="_blank">
            HELP
          </a>
        </p>
        <footer>
          <small>© 2019 Doppler LLC. Todos los derechos reservados.</small>
        </footer>
      </article>
      <section className="feature-panel">
        <article className="feature-content">
          <h6>Editor de emails</h6>
          <h3>Crea Emails en minutos y accede a nuestra Galería de Plantillas</h3>
          <p>
            Nuestras Plantillas para Email son totalmente Responsive y fácilmente editables desde
            nuestro Editor HTML.
          </p>
        </article>
      </section>
    </main>
  );
}
