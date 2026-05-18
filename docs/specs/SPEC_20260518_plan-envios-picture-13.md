# SPEC_20260518_plan-envios-picture-13

Estado: Draft

Assets principales:

- `docs/assets/picture_13.png`: referencia visual objetivo para contratacion de
  planes por Envios.
- `docs/assets/picture_14.png`: referencia visual para el escenario de opcion
  de alto volumen (Mas de 10.000.000) con CTA comercial.
- `docs/assets/picture_15.png`: referencia visual del mensaje a mostrar cuando
  el usuario selecciona un plan de Envios menor al que tiene actualmente.

Estandares relacionados:

- `AGENTS.md`
- `docs/specs/SPEC_20260507_plan-contactos-seccion-1.md`
- `docs/specs/SPEC_20260508_plan-contactos-seccion-2.md`
- `docs/specs/SPEC_20260511_plan-contactos-seccion-3-sticky.md`
- `docs/specs/SPEC_20260513_plan-creditos-seccion-10.md`
- `docs/specs/SPEC_20260515_plan-contactos-seccion-4-addons.md`
- `docs/specs/SPEC_20260515_plan-contactos-seccion-5-faq.md`
- Style-guide de Doppler cargado por manifest.

---

## 1) Objetivo

Definir e implementar la experiencia de `picture_13.png` para contratacion de
planes por Envios (`PLAN_TYPE.byEmail`) dentro de `NewPlanSelection`, mostrando
esta variante solo cuando el usuario tiene plan vigente por Envios.

---

## 2) Alcance

Incluido:

- Regla de visibilidad exclusiva para usuarios con plan vigente por Envios.
- Nuevo bloque/componente de seleccion para planes `byEmail`.
- Sincronizacion inicial con precio, frecuencia, CTA y sticky summary.
- Integracion de promocode segun reglas vigentes del flujo de compra.
- Regla de mensaje informativo para downgrade (referencia `picture_15`).
- Regla de opcion de alto volumen con CTA comercial (referencia `picture_14`).
- i18n ES/EN para textos nuevos de la variante `picture_13`.
- Tests funcionales y de no regresion.

Fuera de alcance:

- Cambios en APIs de pricing/billing.
- Cambios en checkout summary fuera de los params necesarios.
- Rediseno de secciones ya implementadas para Contactos/Creditos.

---

## 3) Integracion y componentes

### 3.1 Integracion principal

- `src/components/BuyProcess/NewPlanSelection/index.js`

Debe resolver la variante de pantalla segun plan de sesion:

- Si `sessionPlan.plan.planType === PLAN_TYPE.byEmail`: render de variante
  `picture_13`.
- Caso contrario: comportamiento actual sin cambios funcionales.

### 3.2 Componente recomendado

Crear:

- `src/components/BuyProcess/NewPlanSelection/EmailsPlan/index.js`

Responsabilidad:

- Render de card principal para planes por Envios.
- Manejo de seleccion de plan/frecuencia/promocode.
- Manejo de escenarios especiales de selector (4.8 y 4.9).
- Emision de datos para sticky y CTA de checkout.

---

## 4) Requisitos funcionales

### 4.1 Regla de visibilidad (condicion obligatoria)

La experiencia `picture_13` solo debe mostrarse cuando:

- `appSessionRef.current.userData.user.plan.planType === PLAN_TYPE.byEmail`
- y el usuario no es free.

Para cualquier otro tipo de plan (`byContact`, `byCredit`, `free`) se mantiene
el flujo existente.

### 4.2 Carga de planes por Envios

- Obtener planes desde `planService.getPlansByType(PLAN_TYPE.byEmail)`.
- No hardcodear limites de envios ni precios.
- El selector de planes por Envios debe incluir la opcion menos de 100.000.
- El selector de planes por Envios debe incluir la opcion Mas de 10.000.000.
- Resolver plan inicial por prioridad:
  1. `selected-plan` valido en query param.
  2. plan vigente de sesion (si existe en catalogo).
  3. primer plan disponible.

### 4.3 Frecuencia y precio

- Mostrar control de frecuencia con reglas actuales de billing cycle.
- Recalcular precio visible ante cambio de plan/frecuencia.
- Mantener consistencia entre bloque principal y sticky summary.
- Si el plan seleccionado coincide con el plan vigente, el CTA debe mantenerse
  deshabilitado como en flujos equivalentes.

### 4.4 Promocode

- Reusar componente y logica existente de promocode de `NewPlanSelection`.
- No duplicar reducers ni validadores.
- Reflejar descuento y/o beneficios asociados en precio y mensajes.
- Respetar reglas actuales de bloqueo cuando frecuencia no admite promocode.

### 4.5 CTA y navegacion a checkout

- CTA principal debe navegar a:
  `/checkout/premium/${PLAN_TYPE.byEmail}?selected-plan=<id>&buyType=1`
- Preservar query params relevantes del flujo (por ejemplo `origin_inbound` y
  promocode aplicado cuando corresponda).

### 4.6 Sticky summary

- Debe reflejar desde el primer render util:
  - plan seleccionado,
  - frecuencia activa,
  - precio visible,
  - estado habilitado/deshabilitado del CTA.

Regla especifica para CTA comercial (referencia de comportamiento actual en
`ContactsPlan`):

- en escenarios de downgrade (4.8) y alto volumen (4.9), el sticky debe pasar
  a CTA comercial (mismo destino asesor/comercial que la card principal);
- en esos escenarios, el sticky debe mantener el resumen estandar del plan
  seleccionado (titulo/subtitulo/precio) y no pasar a modo custom;
- el texto del boton del sticky debe ser el de CTA comercial
  (`sticky_custom_cta`).

### 4.7 Compatibilidad y no regresion

- No romper comportamiento ya implementado para variantes de Contactos y
  Creditos.
- Mantener orden visual y secciones globales existentes fuera de la variante
  `picture_13`.

### 4.8 Escenario downgrade (picture_15)

Cuando el usuario con plan vigente por Envios selecciona un plan menor al que
 tiene actualmente, debe mostrarse el mensaje visual de `picture_15`.

Definicion de downgrade para `byEmail`:

- comparar la capacidad de envios entre plan actual y plan seleccionado;
- si la capacidad del plan seleccionado es menor que la capacidad del plan
  vigente, se considera downgrade.

Comportamiento esperado:

- el mensaje de `picture_15` aparece al seleccionar un plan menor;
- la opcion menos de 100.000 debe comportarse como downgrade y mostrar el mismo
  mensaje de `picture_15`;
- el CTA principal debe pasar a modo comercial (Contactar a Asesor), igual que
  en el escenario de Mas de 10.000.000;
- el sticky summary debe pasar a CTA comercial y mantener resumen estandar del
  plan seleccionado (alineado al criterio de `ContactsPlan` para downgrade);
- el mensaje se oculta automaticamente al volver a un plan igual o mayor.

### 4.9 Escenario alto volumen (picture_14)

Cuando el usuario selecciona la opcion Mas de 10.000.000 en el dropdown:

- debe mostrarse el bloque informativo visual de `picture_14` (mensaje azul);
- debe mostrarse un link/accion de contacto comercial dentro del bloque;
- el CTA principal de la card debe pasar a modo comercial (texto Contactar a
  Asesor);
- el destino del CTA comercial debe ser consistente con el flujo actual de
  asesor/comercial (por ejemplo `/upgrade-suggestion-form`);
- en este escenario no debe navegar al checkout de compra directa;
- sticky summary debe reflejar el mismo estado de CTA comercial y mantener
  resumen estandar del plan seleccionado.

Prioridad entre escenarios especiales:

- la opcion Mas de 10.000.000 (4.9) tiene prioridad sobre mensajes de downgrade
  (4.8) para evitar doble cartel;
- mientras este activa la opcion Mas de 10.000.000, debe verse solo el mensaje
  correspondiente a `picture_14`;
- al volver a una opcion estandar, se restablecen reglas normales (incluyendo
  posible mensaje de downgrade si aplica).

---

## 5) Diseno y estilos

- Replicar estructura visual de `docs/assets/picture_13.png`.
- Replicar el bloque/mensaje de alto volumen de `docs/assets/picture_14.png`.
- Replicar tambien el bloque/mensaje de downgrade de
  `docs/assets/picture_15.png` para el escenario definido en 4.8.
- Reusar clases y patrones del style-guide (`dp-container`, `dp-rowflex`,
  botones y mensajes estandar).
- Scopear ajustes de estilos en:
  `src/components/BuyProcess/NewPlanSelection/index.styles.js`
  o estilos locales del nuevo componente.
- Evitar estilos globales.

---

## 6) Internacionalizacion

Agregar/ajustar keys en:

- `src/i18n/es.js`
- `src/i18n/en.js`

Lineamientos:

- No hardcodear textos en JSX.
- Reusar keys existentes cuando representen exactamente el mismo contenido.
- Crear keys nuevas bajo namespace de `buy_process.new_plan_selection` para
  textos especificos de la variante por Envios.
- Incluir keys especificas para el mensaje de downgrade de `picture_15`.
- Incluir keys especificas para bloque y CTA comercial de `picture_14`.

---

## 7) Tests requeridos

Agregar/actualizar tests para validar:

- render de variante `picture_13` cuando usuario tiene plan `byEmail`.
- no render de variante `picture_13` para `byContact`, `byCredit` y `free`.
- seleccion inicial por prioridad (query param, plan sesion, fallback).
- sincronizacion precio/CTA/sticky al cambiar plan y frecuencia.
- aplicacion de promocode y reflejo en UI de precio/mensajes.
- URL de CTA a checkout de `PLAN_TYPE.byEmail` con params esperados.
- visualizacion de mensaje `picture_15` al seleccionar plan menor (downgrade).
- visualizacion de mensaje `picture_15` al seleccionar la opcion menos de
  100.000.
- CTA principal en modo Contactar a Asesor para downgrade.
- sticky summary en modo CTA comercial para downgrade, manteniendo resumen
  estandar del plan.
- ocultamiento del mensaje `picture_15` al volver a plan igual o mayor.
- visualizacion de bloque `picture_14` al seleccionar Mas de 10.000.000.
- CTA principal en modo Contactar a Asesor para Mas de 10.000.000.
- sticky summary sincronizado en modo CTA comercial para Mas de 10.000.000,
  manteniendo resumen estandar del plan.
- prioridad de `picture_14` sobre `picture_15` cuando aplica el escenario de
  alto volumen.
- no regresion de flujo actual en variantes de Contactos y Creditos.

---

## 8) Definition of Done

- Variante de `picture_13` implementada y visible solo para usuarios con plan
  vigente por Envios.
- Plan/frecuencia/precio/promocode/CTA sincronizados.
- Escenario downgrade implementado con mensaje de `picture_15`, CTA comercial
  y sticky alineado al patron de `ContactsPlan`.
- Escenario alto volumen implementado con mensaje de `picture_14`, CTA
  comercial y sticky alineado al patron de `ContactsPlan`.
- i18n ES/EN completo para nuevos textos.
- Tests en verde con cobertura de escenario principal y casos borde.
- Sin regresiones funcionales en `NewPlanSelection`.

---

## 9) Pendientes de detalle funcional (para cierre de spec)

- Confirmar copy final ES/EN exacto de todos los textos de `picture_13`.
- Confirmar copy final ES/EN exacto del mensaje de `picture_15`.
- Confirmar copy final ES/EN exacto del bloque y CTA de `picture_14`.
- Confirmar destino final del CTA Contactar a Asesor para `picture_14` y
  `picture_15`.
- Confirmar si en variante por Envios deben mostrarse tambien bloques de
  `IncludedFeatures`, `AddOnsSection` y `FAQ` sin cambios.
