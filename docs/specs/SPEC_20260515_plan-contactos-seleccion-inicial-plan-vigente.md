# SPEC_20260515_plan-contactos-seleccion-inicial-plan-vigente

Estado: Draft

Assets principales:

- `docs/assets/picture_1.png`: pantalla general de `NewPlanSelection`.

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

---

## 4) Requisitos Funcionales

### 4.1 Regla de seleccion inicial (Plan Contactos)

Al cargar `NewPlanSelection`, si se cumplen todas estas condiciones:

- `sessionPlan.plan.isFreeAccount === false`,
- `sessionPlan.plan.planType === PLAN_TYPE.byContact`,
- `sessionPlan.plan.idPlan` existe y esta presente en `plansByContact`,

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

---

## 5) Impacto tecnico esperado

Componentes involucrados:

- `src/components/BuyProcess/NewPlanSelection/index.js`
- `src/components/BuyProcess/NewPlanSelection/ContactsPlan/index.js`
- `src/components/BuyProcess/NewPlanSelection/StickyPlanSummary/index.js`
- `src/components/BuyProcess/NewPlanSelection/index.test.js`

No se requieren nuevos componentes ni cambios de estilos para esta iteracion.

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

---

## 8) Definition of Done

- Seleccion inicial de plan de contactos consistente para usuarios no free.
- Bloque de precio y sticky sincronizados desde la carga inicial.
- Sin regresiones en comportamiento actual de query param/fallback.
- Tests en verde cubriendo escenario principal y casos borde.

