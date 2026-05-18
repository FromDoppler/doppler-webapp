# SPEC_20260515_plan-contactos-seleccion-inicial-plan-vigente

Estado: Draft

Assets principales:

- `docs/assets/picture_1.png`: pantalla general de `NewPlanSelection`.
- `docs/assets/picture_12.png`: matriz de 3 escenarios para mensajes de
  cambio de plan/promocode.

Estandares relacionados:

- `AGENTS.md`
- `docs/specs/SPEC_20260507_plan-contactos-seccion-1.md`
- `docs/specs/SPEC_20260508_plan-contactos-seccion-2.md`
- `docs/specs/SPEC_20260511_plan-contactos-seccion-3-sticky.md`
- Style-guide de Doppler cargado por manifest.

---

## 1) Objetivo

Garantizar que, cuando el usuario **no es free** y tiene un **Plan de Contactos**
activo, `NewPlanSelection` inicialice la vista con ese plan seleccionado en el
dropdown de contactos y con la informacion sincronizada en:

- bloque de precio de `ContactsPlan`,
- resumen sticky (`StickyPlanSummary`).

---

## 2) Alcance

Incluido:

- Regla de preseleccion inicial para `ContactsPlan` en usuarios no free.
- Sincronizacion inicial de precio, descuentos aplicables y estado de CTA.
- Sincronizacion inicial del sticky con el plan preseleccionado.
- Reglas de inicializacion para promocode/frecuencia en usuarios con promocion
  asignada.
- Casos borde cuando el plan vigente no exista en el listado.
- Tests de no regresion para el flujo de inicializacion.

Fuera de alcance:

- Cambios de UI/diseno en secciones 1-5.
- Cambios en reglas de pricing backend.
- Cambios en el flujo de checkout.

---

## 3) Contexto funcional actual

`NewPlanSelection` ya resuelve un indice inicial por:

1. `selected-plan` en query param (si existe y es valido),
2. fallback a plan de sesion si coincide con `PLAN_TYPE.byContact`,
3. fallback final a indice `0`.

Esta SPEC formaliza y prueba ese comportamiento para el escenario de usuario no
free con plan de contactos vigente, asegurando que la vista inicial quede
consistente en todos los bloques dependientes.

Fuente de verdad del plan del usuario:

- `appSessionRef.current.userData.user.plan`

Campos relevantes consumidos por esta regla:

- `idPlan`
- `planType`
- `isFreeAccount`
- `planSubscription` (solo para reglas complementarias ya existentes)
- `promotion` (origen de promocion/promocode asignado al usuario)

---

## 4) Requisitos Funcionales

### 4.1 Regla de seleccion inicial (Plan Contactos)

Al cargar `NewPlanSelection`, si se cumplen todas estas condiciones:

- `appSessionRef.current.userData.user.plan.isFreeAccount === false`,
- `appSessionRef.current.userData.user.plan.planType === PLAN_TYPE.byContact`,
- `appSessionRef.current.userData.user.plan.idPlan` existe y esta presente en
  `plansByContact`,

entonces el dropdown de contactos debe iniciar seleccionado en ese plan.

Prioridad de origen para seleccion inicial:

1. `selected-plan` en query param (si matchea un plan de contactos valido),
2. plan vigente de sesion (regla anterior),
3. primer plan disponible (indice `0`).

### 4.2 Sincronizacion de bloque de precio

Con el plan inicial ya resuelto:

- el bloque de precio de `ContactsPlan` debe renderizar el monto
  correspondiente a ese plan;
- debe respetar reglas existentes de promociones/frecuencia sin recalculo
  paralelo;
- si el plan seleccionado coincide con el plan actual del usuario
  (`isEqualPlan`), el CTA debe mostrarse deshabilitado como hoy.

### 4.3 Sincronizacion de sticky

Desde el primer render util:

- `StickyPlanSummary` debe reflejar el mismo plan inicial seleccionado;
- debe mostrar el precio visible consistente con `ContactsPlan`;
- debe respetar el mismo estado de CTA (habilitado/deshabilitado) que el bloque
  principal.

### 4.4 Caso borde: plan vigente no disponible en catalogo

Si el `idPlan` de sesion no existe en `plansByContact`:

- no debe romper la pantalla;
- debe aplicar fallback a indice `0`;
- precio y sticky deben usar ese fallback.

### 4.5 Caso borde: query param invalido

Si `selected-plan` viene en query pero no matchea:

- debe ignorarse ese valor;
- aplicar regla de fallback a plan de sesion (si corresponde) o indice `0`.

### 4.6 Regla de frecuencia desde plan del usuario (Contactos)

La frecuencia vigente del usuario debe tomarse desde:

- `appSessionRef.current.userData.user.plan.planSubscription`

Regla requerida:

- si `planSubscription !== 1` (es decir, no mensual), el control de frecuencia
  debe iniciar deshabilitado y visualmente grisado;
- el estado bloqueado debe reflejarse desde el primer render util;
- no se debe recalcular este estado con datos de UI, solo con la sesion.

Nota de mapeo:

- `planSubscription === 1` representa ciclo mensual.
- cualquier otro valor representa ciclo no mensual.

Nota:

- si ademas existe promocion asignada, se mantiene la misma politica de bloqueo
  del control para evitar cambios de ciclo incompatibles.

### 4.7 Regla de campo Promocode segun frecuencia

Cuando la frecuencia seleccionada **no es mensual**:

- el campo de promocode debe mostrarse deshabilitado (grisado);
- el boton `Aplicar` del promocode debe quedar deshabilitado;
- no deben dispararse validaciones/aplicaciones de promocode en ese estado.

Cuando la frecuencia vuelva a mensual, el control puede reactivarse segun reglas
actuales de `allowPromocode`.

### 4.8 Reglas de mensajes (Picture 12 + escenario adicional)

Aplica para usuarios con plan vigente de contactos (`PLAN_TYPE.byContact`) y no
free, con comparacion de capacidad entre plan actual y plan seleccionado.

Escenario 1 - plan mas chico (downgrade):

- se considera **downgrade** cuando el plan seleccionado en el dropdown de
  contactos tiene menor capacidad que el plan vigente del usuario;
- la comparacion de capacidad debe realizarse con la misma fuente ya usada por
  la UI (`subscriberLimit` o `subscribersQty`, segun disponibilidad del plan).
- en este caso se muestra el cartel celeste de asesoramiento (`picture_12`,
  bloque superior).

Escenario 2 - plan mas grande + mismo promocode guardado:

- si el usuario tiene promocode guardado en sesion y el promocode aplicado en
  el control es el mismo, al cambiar a un plan mas grande debe mostrarse el
  warning amarillo:
  `buy_process.plan_selection.lose_promotion_message`.

Escenario 3 - promocode aplicado distinto al guardado e invalido para el plan:

- si el promocode aplicado en el control es distinto del guardado y no aplica
  al plan seleccionado, debe mostrarse el mensaje de "este codigo aplica
  unicamente a..." (cartel celeste de invalidacion de promo, como en
  `picture_12` bloque inferior), proveniente del flujo normal de validacion de
  `Promocode`.

Escenario 4 - seleccion "mas de 100.000" contactos:

- cuando el usuario selecciona la opcion "mas de 100.000", debe mostrarse
  unicamente el mensaje celeste de asesoramiento para plan personalizado;
- en este escenario no debe mostrarse el warning amarillo de perdida de
  beneficios, aunque exista promocode guardado.
- en este escenario tampoco debe mostrarse el mensaje celeste de
  "este codigo aplica unicamente a..."; debe quedar visible solo el celeste de
  plan personalizado.

Reglas de prioridad entre mensajes:

- escenario 2 (warning amarillo) no debe mostrarse si el escenario 3 ya aplica;
- escenario 1 y escenario 2 son excluyentes entre si por direccion del cambio
  de plan (menor vs mayor);
- escenario 4 tiene prioridad sobre escenario 2 para evitar doble mensaje
  cuando el usuario selecciona "mas de 100.000";
- escenario 4 tambien tiene prioridad sobre escenario 3 (mensaje de promo no
  aplicable), para evitar doble cartel celeste;
- al volver a seleccionar un plan que no cumple la condicion del escenario
  activo, el mensaje correspondiente debe ocultarse.

Alcance de esta iteracion:

- solo comportamiento informativo/visual asociado a `picture_12`;
- no altera flujo de checkout ni reglas de precio;
- no cambia por si sola el estado de habilitacion del CTA (salvo que picture 12
  lo requiera explicitamente en una definicion posterior).

### 4.9 Orden de cards y controles para usuario con plan por Creditos

Cuando `appSessionRef.current.userData.user.plan.planType === PLAN_TYPE.byCredit`
y `isFreeAccount === false`:

- en `NewPlanSelection` debe renderizarse primero la card `CreditsPlan`;
- debajo debe renderizarse la card `ContactsPlan`;
- en este escenario, dentro de `ContactsPlan`, los controles de
  `PaymentFrequency` y `Promocode` deben permanecer disponibles para
  interaccion del usuario (no bloqueados/grisados por la regla de frecuencia
  del plan actual).

Nota:

- esta regla aplica solo para usuario vigente por Creditos;
- para el resto de escenarios se mantiene el comportamiento actual.

---

## 5) Impacto tecnico esperado

Componentes involucrados:

- `src/components/BuyProcess/NewPlanSelection/index.js`
- `src/components/BuyProcess/NewPlanSelection/ContactsPlan/index.js`
- `src/components/BuyProcess/NewPlanSelection/StickyPlanSummary/index.js`
- `src/components/BuyProcess/NewPlanSelection/index.test.js`

No se requieren nuevos componentes ni cambios de estilos para esta iteracion.

Nota de implementacion:

- Se recomienda mantener una unica referencia local para evitar lecturas
  dispersas del objeto de sesion (por ejemplo, `const currentUserPlan =
  appSessionRef.current.userData.user.plan;`) y usar ese objeto en toda la
  logica de seleccion inicial.

---

## 6) Internacionalizacion

No requiere nuevas keys i18n.

---

## 7) Tests requeridos

Agregar/ajustar tests en `NewPlanSelection/index.test.js` para validar:

- usuario no free con plan de contactos vigente inicia con ese plan en dropdown;
- precio inicial coincide con el plan vigente seleccionado;
- sticky inicial refleja el mismo precio/plan;
- CTA deshabilitado si el plan inicial es el mismo plan actual del usuario;
- fallback a indice `0` cuando `idPlan` de sesion no existe en el listado;
- prioridad de query param valida sobre plan de sesion.
- con `planSubscription !== 1`, el control de frecuencia inicia deshabilitado y
  grisado;
- con frecuencia no mensual, el campo de promocode y su boton `Aplicar` quedan
  deshabilitados.
- al seleccionar un plan con menos contactos que el plan vigente, se muestra el
  mensaje del escenario 1 de `picture_12`;
- con plan mas grande y promocode aplicado igual al guardado, se muestra el
  warning amarillo del escenario 2;
- con promocode aplicado distinto al guardado e invalido para el plan, se
  muestra el mensaje del escenario 3 y no el warning amarillo;
- al seleccionar "mas de 100.000", se muestra solo el mensaje celeste de plan
  personalizado y se ocultan el warning amarillo y el mensaje celeste de promo
  no aplicable;
- al seleccionar nuevamente un plan que no cumple la condicion del escenario
  activo, el mensaje correspondiente se oculta.
- para usuario vigente por Creditos, `CreditsPlan` aparece antes que
  `ContactsPlan` en el orden visual.
- para usuario vigente por Creditos, la frecuencia de pago en `ContactsPlan`
  permanece habilitada.

---

## 8) Definition of Done

- Seleccion inicial de plan de contactos consistente para usuarios no free.
- Bloque de precio y sticky sincronizados desde la carga inicial.
- Reglas de bloqueo de frecuencia/promocode aplicadas para escenario con
  frecuencia de sesion no mensual.
- Reglas de mensajes por escenarios de `picture_12` implementadas y cubiertas
  por tests.
- Sin regresiones en comportamiento actual de query param/fallback.
- Tests en verde cubriendo escenario principal y casos borde.
