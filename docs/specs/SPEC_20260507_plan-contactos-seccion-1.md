# SPEC_20260507_plan-contactos-seccion-1

Estado: Draft

Assets principales:

- `docs/assets/picture_1.png`: pantalla completa entregada desde Figma, con
  secciones numeradas. Esta SPEC cubre solo la seccion 1.
- `docs/assets/picture_2.png`: referencia visual/comportamental para el selector
  de contactos usado actualmente en `PlanSelection`.

Estandares relacionados:

- `AGENTS.md`
- Style-guide de Doppler cargado mediante `REACT_APP_STYLE_GUIDE_MANIFEST_FILE`
- Referencia local del style-guide, cuando exista:
  `D:/Repositorios/doppler-style-guide`

---

## 1) Objetivo

Definir la implementacion de la seccion 1 de `picture_1.png`, correspondiente al
bloque superior de seleccion de Plan Contactos.

La seccion permite que el usuario elija un plan de Marketing por Contactos,
seleccione la cantidad de contactos, defina la frecuencia de suscripcion, vea el
precio del plan seleccionado y continue el flujo de compra.

---

## 2) Resumen Visual

La seccion 1 de `picture_1.png` contiene:

- Accion "Volver" en la parte superior izquierda.
- Titulo principal: "Elige el Plan ideal para hacer crecer tu negocio".
- Subtitulo breve de contexto.
- Card principal blanca para "Plan Contactos".
- Badge verde siempre visible para marcar el periodo de suscripcion elegido.
- Control "Cuantos Contactos tienes?".
- Control de "Suscripcion".
- Campo opcional de codigo/descuento.
- Resumen de precio a la derecha.
- CTA principal verde "Elegir Plan".
- Disclaimer de renovacion/precio.

`picture_2.png` muestra el comportamiento de referencia para seleccionar
contactos en base a los planes actuales: titulo, cantidad seleccionada, rango de
planes, marcas y valor maximo.

La imagen de Figma es guia visual. La implementacion final debe respetar el
style-guide de Doppler y los patrones existentes en `doppler-webapp`.

---

## 3) Alcance

Incluido:

- Seccion 1 de `picture_1.png`.
- Ruta nueva `/new-plan-selection` para acceder a esta pagina.
- Controles visibles de la seccion 1 de `picture_1.png` solamente.
- Selector de contactos basado en los planes reales disponibles.
- Selector de suscripcion con el mismo comportamiento que `PaymentFrequency`.
- Resumen de precio del plan seleccionado.
- CTA para continuar con el plan seleccionado.
- Estados responsive, loading, error, disabled y promociones.
- Traducciones en espanol e ingles.
- Tests del comportamiento visible para el usuario.

Fuera de alcance:

- Implementar las secciones 2, 3, 4 o 5 de `picture_1.png`.
- Mostrar controles o contenido de las secciones 2, 3, 4 o 5 dentro de
  `/new-plan-selection`.
- Redisenar todo el checkout.
- Cambiar APIs de billing o planes.
- Modificar el style-guide externo.
- Crear reglas nuevas de precios, descuentos o elegibilidad.

---

## 4) Actor y Punto de Entrada

Actor principal: usuario logueado de Doppler que selecciona o actualiza su Plan
Marketing por Contactos.

Punto de entrada recomendado:

- Ruta nueva `/new-plan-selection`.
- En `src/App.js`, la implementacion de routing debe seguir el mismo patron de
  `plan-selection`:
  - `/new-plan-selection` debe renderizar directamente la pagina nueva dentro de
    `PrivateRoute` y `BuyProcessLayout`.
  - No se debe crear ni usar una ruta
    `/new-plan-selection/premium/:planType` para esta primera implementacion.
- La pagina nueva debe estar dentro del flujo de seleccion de planes para
  `PLAN_TYPE.byContact`.

La implementacion debe conservar los query params existentes salvo que otra SPEC
lo cambie.

---

## 5) Requisitos Funcionales

### 5.1 Header

- Mostrar accion "Volver".
- Reutilizar el comportamiento actual de `GoBackButton` cuando aplique.
- Mostrar el titulo principal de la seccion.
- El icono junto al titulo principal "Elige el Plan ideal para hacer crecer tu negocio"
  debe implementarse con `<span className="dpicon iconapp-email-alert" />`.
- No usar emoji como implementacion final.
- Mostrar subtitulo en ambos idiomas.

### 5.2 Card Plan Contactos

- El titulo visible debe ser "Plan Contactos" en espanol y "Contacts Plan" en
  ingles.
- La descripcion debe explicar que permite enviar emails ilimitados en base a la
  cantidad de Contactos.
- Mostrar badge verde siempre visible para indicar el periodo seleccionado; si
  existe descuento o promocion aplicable, incluir ese dato en el badge.
- Usar tratamiento visual compatible con style-guide:
  - fondo blanco
  - radio estandar `3px`
  - borde sutil neutral
  - sin decoracion ajena al sistema Doppler

### 5.3 Control "Cuantos Contactos tienes?"

- El control debe prepopularse con los planes actuales disponibles.
- La fuente de datos debe ser la misma que usa el flujo actual:
  `planService.getPlansByType(PLAN_TYPE.byContact)`.
- No hardcodear cantidades, limites ni IDs de planes.
- Tomar como referencia el comportamiento de `PlanSelection`, especialmente la
  forma en que arma el selector/banner representado en `picture_2.png`.
- La lista de opciones debe representar los planes disponibles actualmente. Cada
  opcion debe mapear a un plan real.
- Al iniciar, debe seleccionarse:
  - el plan indicado por query params si el flujo ya lo soporta, o
  - el plan actual/preseleccionado por el reducer existente, o
  - el plan de menor cantidad de contactos disponible.
- Cuando el usuario cambia la cantidad/opcion, el estado seleccionado debe
  actualizar el plan seleccionado del flujo.
- El control final debe ser un dropdown como en `picture_1.png`; sus opciones
  deben salir de los planes reales y mostrar cantidades formateadas.
- El dropdown debe incluir una opcion fija adicional al final:
  - ES: `Más de 100.000`
  - EN: `More than 100,000`
- No mostrar tabs de tipo de plan en esta pagina.
- Si el usuario necesita una cantidad superior al maximo disponible, mostrar el
  mensaje/link de contacto ya usado por el flujo actual, sin inventar una regla
  nueva.
- Al seleccionar `Más de 100.000`/`More than 100,000`:
  - se debe tomar como referencia el plan de contactos de mayor capacidad para
    actualizar la seccion de precio
  - el precio principal debe pasar a `A medida*` (ES) / `Tailored*` (EN)
  - el CTA principal debe cambiar a `Contactar a Asesor` (ES) / `Contact an Advisor` (EN) y dirigir al flujo de contacto comercial
  - debe mostrarse debajo de los controles un mensaje informativo celeste
    (estilo existente `dp-wrap-message dp-wrap-info`) con recomendacion para
    Planes por Envios y enlace de contacto

### 5.4 Control "Suscripcion"

- El control de suscripcion debe tener el mismo comportamiento que el componente
  `PaymentFrequency` de `src/components/BuyProcess/PaymentFrequency`, pero debe
  implementarse como una copia local dentro de
  `src/components/BuyProcess/NewPlanSelection/PaymentFrequency` para no cambiar
  el control compartido existente.
- Debe usar la misma lista de frecuencias/descuentos del plan seleccionado.
- Debe respetar las mismas reglas de seleccion inicial que `PaymentFrequency`,
  incluido `monthPlan` cuando aplique.
- Debe llamar el mismo contrato de cambio:
  `onSelectPaymentFrequency({ selectedPaymentFrequency, selectedPaymentFrequencyIndex })`.
- Debe preservar disabled states:
  - plan actual no comprable
  - usuario no elegible para cambiar frecuencia
  - promocode o descuento que bloquee seleccion
- Labels esperados:
  - Mensual
  - Trimestral
  - Semestral
  - Anual
- Los porcentajes de descuento deben mostrarse desde los datos reales de cada
  frecuencia.
- El badge verde de la card debe mostrarse siempre e indicar el periodo
  seleccionado; si el periodo tiene descuento, debe mostrar tambien el
  porcentaje.
- Visualmente debe mantener el look del control actual de `PaymentFrequency`
  (incluyendo seleccionado/descuentos), alineado con `picture_1.png`.

### 5.5 Codigo o Descuento

- El campo visual debajo de suscripcion debe mostrarse siempre visible y debe
  reutilizar el comportamiento existente de promocode del flujo de compra desde
  una copia local dentro de
  `src/components/BuyProcess/NewPlanSelection/Promocode`, para evitar cambios en
  el control compartido existente.
- No crear una segunda logica de promocodes.
- Si `REACT_APP_PROMOCODE_CONTACTS` tiene valor y el usuario es Free Account,
  al ingresar a `/new-plan-selection` sin promocode en query params se debe
  cargar automaticamente ese valor en URL (`promo-code`) y prepopular el control.
- Si ya existe promocode en URL (`promo-code`, `Promo-code` o `PromoCode`), no
  se debe sobreescribir por `REACT_APP_PROMOCODE_CONTACTS`.
- El prepopulado por URL/env debe ejecutarse solo al cargar la pagina. Si el
  usuario elimina manualmente el promocode, no debe volver a preaplicarse en la
  misma sesion de la pantalla.
- El boton de quitar promocode debe mantenerse dentro del control de ingreso del
  codigo, respetando el patron existente del style-guide.
- Debe preservar `promo-code` y `PromoCode`.
- Debe respetar errores, estado aplicado y restricciones actuales.

### 5.6 Seccion de Precios

- La seccion de precios debe mostrar el importe del plan seleccionado en el
  control de contactos.
- Si el usuario cambia el dropdown/selector de contactos, el precio debe
  actualizarse al precio del nuevo plan seleccionado.
- Si el usuario cambia la suscripcion, el precio principal debe mostrarse como
  precio mensual con el descuento de la frecuencia aplicada, como en
  `picture_3.png`.
- Para frecuencias trimestral, semestral o anual, debajo del precio principal se
  debe mostrar el precio mensual original tachado y un texto de ahorro indicando
  porcentaje, periodo elegido y total del pago del periodo.
- Si existe un promocode valido y aplicable al plan/frecuencia seleccionados, la
  seccion de precio debe reflejar ese descuento promocional en el valor mensual
  mostrado.
- Con promocode valido, debajo del precio principal se debe mostrar:
  - el precio mensual previo al descuento promocional (tachado)
  - un texto de ahorro con porcentaje y duracion del beneficio (cantidad de
    meses), usando la data real de `promotionApplied.duration` y/o
    `discountPromocode.duration`.
- No hardcodear el precio mostrado en Figma.
- El importe debe venir de los datos actuales del plan y/o del detalle de billing
  existente:
  `dopplerAccountPlansApiClient.getPlanBillingDetailsData`.
- Si hay descuento, mostrar precio anterior tachado y precio final.
- Si no hay descuento, ocultar precio anterior.
- Usar `react-intl` para formato de moneda y numeros.
- Mostrar disclaimer de renovacion e impuestos reutilizando textos existentes
  cuando sea posible.

### 5.7 CTA "Elegir Plan"

- El CTA debe continuar el flujo con el plan y frecuencia seleccionados,
  navegando a `/checkout/premium/subscribers`.
- Debe enviar `selected-plan` con el ID del plan seleccionado en el dropdown.
- Debe enviar `discountId` con el ID de la frecuencia seleccionada.
- Debe enviar `monthPlan` con la cantidad de meses de la frecuencia
  seleccionada (por ejemplo `monthPlan=6` para semestral).
- Debe preservar query params relevantes:
  - `monthPlan`
- `promo-code`, `Promo-code` o `PromoCode` solo deben enviarse al checkout
  cuando existe un promocode efectivamente aplicado en el control. Si no hay
  promocode aplicado, no se debe enviar ningun parametro de promocode.
- Si el plan seleccionado coincide con el plan actual y no se puede comprar,
  preservar comportamiento disabled/tooltip existente.

---

## 6) Requisitos de Diseno y Style-guide

Usar clases y patrones existentes antes de agregar CSS nuevo.

Adicionalmente:

- Mantener margenes/paddings de la card principal alineados con `picture_1.png`.
- Agregar separador vertical entre el bloque izquierdo (controles del plan) y
  el bloque derecho (precio), con ajuste responsive en mobile.
- Evitar truncado visual en el texto del dropdown: la opcion seleccionada debe
  visualizarse completa o con truncado legible, sin cortar tipografia.
- Mantener en una misma fila el input de promocode, el boton de borrar dentro
  del input y el boton `Aplicar`, alineados como en `picture_1.png`.

Patrones preferidos:

- `dp-container`, `dp-rowflex` y columnas del grid.
- `dp-first-order-title` para titulo principal cuando coincida con el flujo
  actual.
- `dp-second-order-title` para titulos internos.
- `dp-button button-medium primary-green` para el CTA principal.
- `dp-button button-medium ctaTertiary` o `GoBackButton` para volver.
- `awa-form`, `labelcontrol` y patrones accesibles para inputs.
- Copia local de `PaymentFrequency` para comportamiento de suscripcion en
  `NewPlanSelection`.
- Copia local de `Promocode` para codigo/descuento siempre visible en
  `NewPlanSelection`.
- `ShoppingCart` o sus utilidades cuando se necesite consistencia de precio.
- `dp-wrap-message dp-wrap-info` para el mensaje informativo celeste de la
  opcion `Más de 100.000`.

Si se requiere styling propio, ubicarlo cerca del componente en `*.styles.js`
con `styled-components` y colores Doppler.

No agregar estilos globales salvo que sean realmente compartidos.

---

## 7) Accesibilidad

- La seccion debe tener un heading principal claro.
- El control de contactos debe tener label visible.
- El control de suscripcion debe ser operable con teclado y exponer el estado
  seleccionado.
- El CTA debe ser un `<button>` real o `Link` solo si navega.
- Los estados de foco deben ser visibles y consistentes con el style-guide.
- Los cambios de precio no deben romper el flujo de lectura. Si se usa live
  region, debe ser polite.

---

## 8) Datos e Integracion

Fuentes de datos obligatorias:

- Planes por Contactos:
  `planService.getPlansByType(PLAN_TYPE.byContact)`.
- Tipos de plan/contexto de navegacion:
  `planService.getDistinctPlans()` cuando el flujo lo requiera.
- Frecuencias/descuentos:
  datos del plan seleccionado, usando el mismo contrato que `PaymentFrequency`.
- Precio/detalle de billing:
  `dopplerAccountPlansApiClient.getPlanBillingDetailsData` cuando se necesite el
  total final.

La implementacion no debe introducir calculos de precio paralelos que puedan
divergir del backend.

---

## 9) Internacionalizacion

Todo texto visible debe existir en:

- `src/i18n/es.js`
- `src/i18n/en.js`

Textos requeridos:

- Titulo principal.
- Subtitulo.
- Titulo "Plan Contactos".
- Descripcion del plan.
- Label "Cuantos Contactos tienes?".
- Labels de suscripcion si no se reutilizan keys existentes.
- Labels de precio.
- CTA "Elegir Plan".
- Mensajes de error o limite maximo que no existan todavia.

Usar `react-intl` para numeros, monedas y plurales.

---

## 10) Estados Requeridos

- Loading mientras se cargan planes.
- Error si fallan planes o billing.
- Empty si no hay planes por Contactos.
- Estado inicial con plan preseleccionado.
- Cambio de plan desde el control de contactos.
- Cambio de frecuencia desde suscripcion.
- Promocode aplicado/no aplicado.
- Descuento con precio anterior visible.
- Sin descuento con precio anterior oculto.
- Plan actual no comprable.
- Maximo de contactos superado.

---

## 11) Tests Requeridos

Agregar o actualizar tests para validar:

- La seccion 1 renderiza header, card, control de contactos, suscripcion, precio
  y CTA.
- El control de contactos se prepopula con planes reales recibidos del double de
  `planService.getPlansByType(PLAN_TYPE.byContact)`.
- Cambiar el control de contactos selecciona el plan correcto.
- El control de suscripcion replica el comportamiento esperado de
  `PaymentFrequency`.
- Cambiar frecuencia actualiza la frecuencia seleccionada.
- La seccion de precios muestra el importe del plan seleccionado.
- Cambiar el plan seleccionado actualiza el importe mostrado.
- Estado con descuento muestra precio anterior tachado.
- Estado sin descuento no muestra precio anterior.
- CTA continua con plan y frecuencia seleccionados.
- Se preserva `monthPlan` en la navegacion al checkout.
- Se admite prepopulado de promocode desde URL con cualquiera de estas keys:
  `promo-code`, `Promo-code` o `PromoCode`.
- Al eliminar un promocode prepopulado, no se vuelve a aplicar automaticamente
  durante esa sesion de pantalla.
- Si no hay promocode aplicado al hacer click en `Elegir Plan`, el checkout no
  recibe parametros de promocode.
- Copy en espanol e ingles existe.

Usar Testing Library y los doubles/patrones existentes del area BuyProcess.

---

## 12) Decisiones Cerradas

- La pagina nueva debe implementarse en un componente nuevo, dejando
  `PlanSelection` intacto.
- La ruta final es `/new-plan-selection` y renderiza directamente la pagina
  nueva.
- El control de contactos es dropdown.
- El campo de codigo/descuento se muestra siempre visible.
- El precio muestra el valor mensual con el descuento de la frecuencia elegida y
  el precio mensual original tachado cuando corresponde.
- El CTA navega al checkout con `selected-plan`, `discountId` y `monthPlan`.
- `PromoCode` solo se envia al checkout cuando hay promocode aplicado.
- El boton "Volver" reutiliza `GoBackButton`.
- Se ocultan los tabs de tipo de plan.
- La opcion adicional del dropdown se muestra como `Más de 100.000` (ES) /
  `More than 100,000` (EN).
- `NewPlanSelection` queda como contenedor de pagina (routing/bootstrap), y la
  logica de la seccion 1 (frecuencia, promocode, billing del plan y checkout
  URL) queda encapsulada en `ContactsPlan`.
