# AGENTS.md - Doppler Webapp (React)

Este archivo define el estandar obligatorio de trabajo para cualquier agente,
humano o IA, que implemente funcionalidad en este repositorio.

Sus objetivos son:

- Mantener consistencia tecnica y visual con Doppler Webapp.
- Preservar trazabilidad desde Figma, assets y especificaciones hasta el codigo.
- Reducir decisiones arbitrarias.
- Facilitar revisiones, iteraciones y mantenimiento.

Este archivo es normativo. Si algo no esta permitido aca o en una SPEC
explicita, no debe implementarse.

---

## 1) Fuente de Verdad y Prioridad

Antes de escribir codigo, toda implementacion debe identificar su fuente de
verdad.

Prioridad, de mayor a menor:

1. La SPEC indicada en `docs/specs/`.
2. ADRs aceptadas en `docs/adrs/`.
3. Este `AGENTS.md`.
4. El prompt actual.

Los assets visuales en `docs/assets/` son material de referencia, no requisitos
independientes. Deben interpretarse a traves de la SPEC y del style-guide de
Doppler.

El style-guide de Doppler es el estandar de UI de la empresa. En este proyecto
se carga mediante el manifest configurado en `public/index.html` con
`REACT_APP_STYLE_GUIDE_MANIFEST_FILE`. Puede existir un checkout local en
`D:/Repositorios/doppler-style-guide`; usalo como referencia cuando este
disponible.

---

## 2) Modos de Trabajo

### A) Trabajo Basado en SPEC

Si una tarea menciona un archivo SPEC, el agente debe:

1. Leer la SPEC completa antes de implementar.
2. Usar la SPEC como fuente primaria de requisitos.
3. Revisar ADRs aplicables.
4. Usar este archivo como estandar tecnico y de proceso.
5. Documentar ambiguedades antes de inventar comportamiento.

Resultado esperado: implementacion reproducible, revisable y trazable.

### B) Trabajo Solo con Prompt

Si no se indica una SPEC, el agente puede implementar a partir del prompt y este
archivo, pero debe indicar en el PR o en las notas finales que no hubo SPEC
versionada y que la trazabilidad de decisiones es limitada.

Este modo es aceptable para prototipos, fixes pequenos o exploracion tecnica. No
se recomienda para workflows centrales de compra, billing, planes o cuentas.

---

## 3) Flujo Obligatorio

Todo agente debe seguir este orden.

### Paso 1 - Identificar Contexto

- Hay una SPEC? Usarla.
- Hay ADRs aceptadas que apliquen?
- Que assets en `docs/assets/` estan referenciados?
- Que usuario/actor esta afectado?
- Que ruta, componente, servicio o API esta afectado?
- Impacta billing, planes, pagos, auth, tracking o datos de cuenta?

### Paso 2 - Definir el Contrato

Antes de implementar, definir:

- Entradas: props, query params, campos de formulario, servicios, datos de API.
- Salidas: estado renderizado, navegacion, callbacks emitidos, llamadas a API.
- Estados de loading, empty, error, disabled y success.
- Permisos requeridos o condiciones de sesion.
- Efectos secundarios: redirects, cambios de URL, compras, llamadas de billing,
  tracking.

### Paso 3 - Validar UX, A11y y Reglas de Negocio

- Validar inputs en el borde.
- Mantener acceso por teclado, estados de foco, labels y nombres para screen
  readers.
- Respetar el modelo de localizacion existente con `react-intl`.
- Preservar el comportamiento actual de planes, pagos, descuentos y promocodes.
- No agregar reglas de negocio ocultas que no esten en la SPEC.

### Paso 4 - Implementar

- Preferir componentes, helpers, hooks, reducers y servicios existentes.
- Priorizar codigo claro por encima de codigo ingenioso.
- No mezclar responsabilidades no relacionadas.
- No generalizar prematuramente.
- No agregar dependencias salvo que la SPEC lo requiera explicitamente.

### Paso 5 - Testear

- Agregar o actualizar tests desde el punto de vista del usuario con Testing
  Library.
- Usar service doubles para comportamiento de APIs/servicios.
- Cubrir estados relevantes de interaccion, i18n, loading/error y disabled.
- Para cambios relacionados, preferir `yarn test:related -- <files>` cuando sea
  practico.
- Antes de completar, ejecutar los checks significativos mas acotados. Para
  cambios amplios o riesgosos, ejecutar `yarn verify`.
- Si el cambio toca archivos cubiertos por checks de formato (`*.html`, `*.css`,
  `*.scss`, `*.less`, `*.js`, `*.jsx`, `*.ts`, `*.tsx`, `*.md`, `*.yml`,
  `*.yaml`, `*.json`), ejecutar `yarn prettier-check` antes de completar.

### Paso 6 - Documentar

- Actualizar documentacion cuando cambia el comportamiento.
- Agregar o actualizar ADRs solo para decisiones arquitectonicas.
- Mantener comentarios breves y solo donde el codigo no sea autoexplicativo.

---

## 4) Reglas de Arquitectura Frontend

### 4.1 React y Estado

- Usar componentes funcionales y hooks.
- Mantener el estado especifico de un componente de forma local, salvo que el
  comportamiento compartido requiera otra cosa.
- Usar reducers para flujos multi-step o con multiples estados que ya esten
  modelados de esa manera.
- Usar `useTimeout` en lugar de `setTimeout` directo dentro de componentes.
- Preferir transformaciones declarativas (`map`, `filter`, `reduce`) sobre loops
  imperativos cuando mejora la claridad.

### 4.2 Servicios y Acceso a Datos

- Los componentes deben usar servicios a traves de `InjectAppServices` o hooks
  existentes.
- No llamar `axios` directamente desde componentes de UI.
- Poner comportamiento HTTP en `src/services/` y proveer tests/doubles.
- Mantener decisiones de billing, planes, pagos y sesion cerca de servicios
  existentes como `planService`, `dopplerAccountPlansApiClient` y
  `dopplerBillingUserApiClient`.

### 4.3 Componentes y Organizacion de Archivos

Seguir las convenciones del repositorio en `README.md`:

- Los componentes viven en `src/components/<Feature>/`.
- Los tests de componentes quedan cerca del componente.
- Los estilos quedan cerca del componente cuando son especificos de ese
  componente.
- La UI compartida reutilizable pertenece a `src/components/shared/` solo cuando
  realmente es compartida.
- Los hooks viven en `src/hooks/<hook-name>/`.
- Los servicios viven en `src/services/` e incluyen tests mas doubles cuando sea
  necesario.

Usar named imports. Evitar default exports para modulos nuevos salvo que el
patron local lo requiera.

### 4.4 Styling y Doppler Style-guide

El style-guide de Doppler es el sistema de UI por defecto.

Reglas obligatorias:

- Reutilizar clases `dp-library` y patrones existentes del style-guide cuando
  sea posible.
- Preferir clases de layout existentes como `dp-container`, `dp-rowflex`,
  columnas del grid, utilidades de spacing, `dp-button`,
  `dp-first-order-title`, `dp-second-order-title`, `awa-form`, `labelcontrol` y
  clases de planes/pagos.
- Usar Proxima Nova tal como la provee la app/style-guide.
- Mantener el radio estandar del style-guide de `3px` salvo que una SPEC indique
  otra cosa.
- Usar la paleta Doppler en lugar de colores puntuales:
  - verde `#33ad73`
  - verde oscuro `#008046`
  - gris oscuro `#333333`
  - texto `#212121`
  - gris `#666666`
  - silver `#cccccc`
  - snow `#eaeaea`
  - amarillo/naranja de foco `#e58900`
- Usar `styled-components` escopado en `*.styles.js` cuando las clases del
  style-guide no cubran la necesidad.
- Evitar cambios globales en `src/App.scss` salvo que el estilo sea realmente
  global o ese archivo ya sea dueno de ese ajuste global.
- No modificar el style-guide externo desde este repositorio.

### 4.5 Internacionalizacion

- Todo texto visible para usuarios debe agregarse en `src/i18n/es.js` y
  `src/i18n/en.js`.
- Usar `react-intl` para formatear numeros, monedas, fechas y plurales.
- No hardcodear copy visible en componentes salvo que sea contenido temporal de
  tests o este explicitamente requerido por una SPEC.

### 4.6 Accesibilidad

- Preservar el orden semantico de headings.
- Los botones deben ser elementos `<button>` reales salvo que la navegacion
  requiera `Link`.
- Los inputs deben tener labels, mensajes de validacion y `aria-invalid` cuando
  aplique.
- Controles segmentados custom deben ser accesibles por teclado y exponer estado
  seleccionado.
- Los estados de foco deben permanecer visibles y alineados al comportamiento
  del style-guide.

---

## 5) Reglas para el Area de Planes, Checkout y Billing

Esta area es sensible porque afecta compras y facturacion de cuentas.

Reglas obligatorias:

- Reutilizar componentes existentes del flujo de compra de planes cuando sea
  posible:
  - `src/components/BuyProcess/PlanSelection`
  - `src/components/BuyProcess/ShoppingCart`
  - `src/components/BuyProcess/PaymentFrequency`
  - `src/components/BuyProcess/Slider`
  - `src/components/Plans/PlanCalculator`
- Preservar query params existentes como `promo-code`, `PromoCode` y `monthPlan`
  salvo que la SPEC los cambie.
- No hardcodear precios, descuentos, IDs de planes o totales de billing salvo
  que la SPEC lo indique explicitamente.
- Usar constantes existentes desde `src/doppler-types.ts`.
- Para planes por Contactos, mantener el vocabulario actual: "Contactos" en
  espanol y "Contacts" en ingles.
- Si un plan seleccionado coincide con el plan actual del usuario, preservar el
  comportamiento existente de disabled/tooltip salvo que la SPEC lo sobrescriba.

---

## 6) Tooling

Scripts del proyecto:

- `yarn start` inicia el dev server de CRA.
- `yarn build` crea un build de produccion.
- `yarn test:related -- <files>` ejecuta tests relacionados.
- `yarn test:ci` ejecuta la suite de CI con coverage.
- `yarn prettier-check` revisa formato.
- `yarn stylelint` revisa CSS/styled-components.
- `yarn verify` ejecuta formato, editorconfig, tests y stylelint.

Durante desarrollo, usar la verificacion significativa mas acotada, y ampliar
cuando el riesgo o alcance sea alto.

---

## 7) Nombres de SPEC y ADR

Las especificaciones deben vivir en `docs/specs/`.

Nombre recomendado para SPEC:

`SPEC_<YYYYMMDD>_<short-kebab-name>.md`

Las decisiones de arquitectura deben vivir en `docs/adrs/`.

Nombre recomendado para ADR:

`ADR_<YYYYMMDD>_<short-kebab-name>.md`

Crear una ADR cuando la implementacion cambie arquitectura, introduzca un patron
transversal nuevo, cambie ownership de datos o se aparte intencionalmente del
style-guide.

---

## 8) Pull Requests y Trazabilidad

Todo PR deberia indicar:

- Issue/tarea relacionada.
- Fuente de verdad: `SPEC: <path>` o `PROMPT ONLY`.
- Assets relevantes, si aplica.
- Que cambio.
- Como se testeo.
- Preguntas abiertas o decisiones de seguimiento.

Los commits deben seguir las reglas de conventional commits del repositorio
descritas en `README.md`.

---

## 9) Definition of Done

Una tarea esta completa cuando:

- Cumple la SPEC o el prompt declarado.
- Respeta este archivo y las ADRs aceptadas.
- Mantiene consistencia con el style-guide de Doppler.
- Incluye tests significativos, o documenta explicitamente por que no aplican.
- Pasa la verificacion acordada.
- No introduce deuda tecnica critica ni regresiones visuales.

---

## 10) Regla Final para Agentes de IA

Si una decision no esta en la SPEC, ADRs aceptadas, este archivo o un patron
local existente, no la inventes silenciosamente.

Ante la duda:

- Documentar la ambiguedad.
- Proponer la opcion viable mas pequena.
- Esperar validacion cuando la decision afecte producto, billing, UX o
  arquitectura.
