# SPEC_20260513_plan-creditos-seccion-10

Estado: Implementado (pendiente QA)

Assets principales:

- `docs/assets/picture_1.png`: pantalla general con secciones numeradas.
- `docs/assets/picture_10.png`: referencia visual objetivo para la seccion de
  compra de Creditos.

Estandares relacionados:

- `AGENTS.md`
- `docs/specs/SPEC_20260507_plan-contactos-seccion-1.md`
- `docs/specs/SPEC_20260508_plan-contactos-seccion-2.md`
- `docs/specs/SPEC_20260511_plan-contactos-seccion-3-sticky.md`
- Style-guide de Doppler cargado por manifest.

---

## 1) Objetivo

Implementar la seccion de `picture_10.png` como un nuevo componente
`CreditsPlan`, integrado en `NewPlanSelection`, para permitir la compra de
planes por Creditos con promocode y resumen de precio.

---

## 2) Alcance

Incluido:

- Nuevo componente `CreditsPlan` dentro de `NewPlanSelection`.
- Dropdown de seleccion de planes por Creditos.
- Reutilizacion del comprobador/logica de promocode usada por `ContactsPlan`.
- Seccion de precio para compra por Creditos (pago unico).
- Manejo de promocode con descuento monetario y/o Creditos extra.
- CTA "Comprar Creditos" con destino de checkout equivalente al de
  `ContactsPlan`.
- i18n ES/EN para textos nuevos.
- Tests del flujo principal.

Fuera de alcance:

- Cambios en APIs de billing, planes o validacion de promocodes.
- Refactors amplios de `ContactsPlan` y `StickyPlanSummary`.
- Cambios en secciones no relacionadas de `NewPlanSelection`.

---

## 3) Componente Nuevo

Crear:

- `src/components/BuyProcess/NewPlanSelection/CreditsPlan/index.js`

Responsabilidad:

- Renderizar la card de compra de Creditos (estructura de `picture_10.png`).
- Sincronizar plan seleccionado, promocode aplicado y precio final.
- Emitir/usar datos necesarios para checkout.

Integracion:

- `NewPlanSelection/index.js` debe renderizar `CreditsPlan` dentro de la misma
  pantalla de seleccion de planes.
- El orden implementado es: `ContactsPlan` -> `IncludedFeatures` ->
  `CreditsPlan`.

---

## 4) Requisitos Funcionales

### 4.1 Data source de planes por Creditos

- El dropdown de Creditos debe cargarse con planes reales usando:
  `planService.getPlansByType(PLAN_TYPE.byCredit)`.
- No hardcodear cantidades de Creditos ni precios.
- Las opciones del dropdown deben representar `plan.credits`.
- El plan inicial debe seguir la misma regla base de seleccion que la pantalla:
  query param de plan si existe, si no plan actual equivalente, si no primer
  plan valido.

### 4.2 UI base (referencia `picture_10.png`)

El bloque debe incluir:

- Titulo: "Compra Creditos y usalos cuando quieras".
- Texto descriptivo corto (2 lineas).
- Label: "Cuantos Creditos necesitas?".
- Dropdown de Creditos.
- Bloque de promocode (input + boton aplicar + mensajes).
- Bloque derecho de precio:
  - label "Precio"
  - valor principal `US$X,XX/Pago Unico*`
  - CTA `Comprar Creditos`
  - disclaimer/impuestos + precio unitario por Credito.

### 4.3 Promocode (mismo comprobador que ContactsPlan)

- Debe reutilizarse la misma implementacion local de promocode que ya usa
  `ContactsPlan` en `NewPlanSelection`:
  - `src/components/BuyProcess/NewPlanSelection/Promocode/index.js`
  - su reducer `Promocode/reducers/promocodeReducer.js`
- No crear una segunda logica paralela de validacion.
- Deben mantenerse reglas actuales de `promo-code`, `Promo-code`, `PromoCode`,
  removido manual, errores, expiracion y estado aplicado.

### 4.4 Precio con promocode (descuento + Creditos extra)

- El precio base del plan por Creditos debe venir del plan seleccionado.
- Si el promocode aplica descuento monetario, debe reflejarse en precio final y
  mostrar referencia de ahorro (siguiendo patrones existentes).
- Si el promocode aplica Creditos extra, debe mostrarse explicitamente en la UI
  del bloque (ej. "Incluye N Creditos extra").
- Si el promocode trae ambos beneficios, se deben mostrar ambos.

Validacion tecnica confirmada:

- `extraCredits` existe y se usa en el dominio actual.
- Se detecta en reducers como criterio de promocode valido:
  `payload.discountPercentage > 0 || payload.extraCredits > 0`.
- Se usa en flujos de compra y resumen de checkout para planes por Creditos.

Fuentes de referencia en codigo:

- `src/components/BuyProcess/NewPlanSelection/Promocode/reducers/promocodeReducer.js`
- `src/components/BuyProcess/ShoppingCart/utils.js`
- `src/components/Plans/Checkout/PurchaseSummary/PurchaseSummary.js`

### 4.5 CTA Comprar Creditos

- El boton debe navegar al mismo tipo de destino que "Elegir Plan" en
  `ContactsPlan`: checkout premium con query params consistentes.
- Para Creditos, el destino debe usar `PLAN_TYPE.byCredit`:
  - `/checkout/premium/${PLAN_TYPE.byCredit}?selected-plan=<id>`
- Debe preservar query params relevantes del flujo (incluido promocode solo si
  esta efectivamente aplicado).
- No debe incluir `discountId` ni `monthPlan` cuando no correspondan al flujo
  de Creditos.

---

## 5) Contrato de datos propuesto

`CreditsPlan` debe trabajar con un contrato similar al de `ContactsPlan`:

- `plansByCredits`
- `selectedCreditPlanIndex`
- `selectedCreditPlan`
- `promocodeApplied` (objeto promocion aplicado)
- `amountDetailsData` (cuando aplique calculo de billing details)
- `checkoutUrl`

Si se decide mostrar datos en sticky o resumen comun, exponer callback
`onStickySummaryChange` con el mismo patron que ya usa `ContactsPlan`.

---

## 6) Estilos y UX

- Reusar layout y patrones visuales de `NewPlanSelection` para consistencia.
- Mantener tipografia del style-guide y alineacion visual con las secciones
  superiores.
- La seccion de `CreditsPlan` usa fondo amarillo en ancho completo, con
  contenido interno alineado a grilla.
- Mantener alineacion horizontal de input promocode + boton aplicar.
- No introducir estilos globales; scopear en
  `src/components/BuyProcess/NewPlanSelection/index.styles.js` o styles locales
  del nuevo componente.

---

## 7) Internacionalizacion

Agregar keys nuevas en:

- `src/i18n/es.js`
- `src/i18n/en.js`

Minimo:

- titulo/subtitulo de `CreditsPlan`
- label del dropdown de Creditos
- label de precio para pago unico
- CTA `Comprar Creditos`
- disclaimer de impuestos y texto de precio unitario
- mensaje de Creditos extra por promocode en contexto de `CreditsPlan`

---

## 8) Tests

Agregar/actualizar tests en `NewPlanSelection` para cubrir:

- render de `CreditsPlan` en pagina.
- carga de opciones del dropdown desde planes `byCredit`.
- aplicacion de promocode usando la misma logica que `ContactsPlan`.
- caso promocode con descuento monetario.
- caso promocode con `extraCredits` > 0.
- caso promocode con descuento + `extraCredits`.
- CTA `Comprar Creditos` con URL de checkout esperada.

---

## 9) Definition of Done

- `CreditsPlan` visible y funcional en `NewPlanSelection`.
- Dropdown alimentado por `getPlansByType(PLAN_TYPE.byCredit)`.
- Promocode reutilizado desde la misma implementacion usada en `ContactsPlan`.
- Precio refleja descuento y/o Creditos extra de promocode.
- CTA navega a checkout premium de Creditos con params correctos.
- i18n ES/EN actualizado.
- Tests en verde.
