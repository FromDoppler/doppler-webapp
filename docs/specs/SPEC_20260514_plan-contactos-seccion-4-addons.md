# SPEC_20260514_plan-contactos-seccion-4-addons

Estado: Draft

Assets principales:

- `docs/assets/picture_1.png`: pantalla general con secciones numeradas. Esta
  SPEC cubre solo la seccion 4 (bloque de Add-ons).

Estandares relacionados:

- `AGENTS.md`
- `docs/specs/SPEC_20260507_plan-contactos-seccion-1.md`
- `docs/specs/SPEC_20260508_plan-contactos-seccion-2.md`
- `docs/specs/SPEC_20260511_plan-contactos-seccion-3-sticky.md`
- `docs/specs/SPEC_20260513_plan-creditos-seccion-10.md`
- Style-guide de Doppler cargado por manifest.

---

## 1) Objetivo

Implementar la seccion 4 de `picture_1.png` dentro de `NewPlanSelection` para
mostrar un bloque de Add-ons destacados (OnSite Marketing, Conversaciones,
Pack de Landing Pages, Eco IA y Push Notification cuando sus features esten
habilitados), con cards informativas sin accion de compra.

---

## 2) Alcance

Incluido:

- Nuevo bloque visual de Add-ons debajo de `CreditsPlan`.
- Cards para 3 Add-ons base: OnSite, Conversaciones y Landing Pages.
- Card adicional de Eco IA solo cuando el usuario tenga habilitado
  `features.ecoIAEnabled`.
- Card adicional de Push Notification solo cuando
  `REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN` sea `'true'`.
- Flechas laterales para navegacion horizontal del carrusel.
- Precio "desde" por Add-on, calculado con data real.
- Cards informativas sin navegacion ni CTA.
- i18n ES/EN de textos nuevos (si faltan).
- Tests de render y comportamiento principal del bloque.

Fuera de alcance:

- Cambios en reglas de precios/promociones de Add-ons.
- Rediseno de las cards de Add-ons fuera de `NewPlanSelection`.
- Implementacion de la seccion 5 (FAQ).
- Cambios en APIs backend.

---

## 3) Componente Nuevo

Crear:

- `src/components/BuyProcess/NewPlanSelection/AddOnsSection/index.js`

Responsabilidad:

- Renderizar titulo/subtitulo de la seccion 4.
- Resolver datos minimos para los Add-ons a mostrar.
- Renderizar cards con icono, texto y precio.
- Gestionar navegacion horizontal (flechas) en desktop/tablet/mobile.

Integracion:

- `NewPlanSelection/index.js` debe renderizar `AddOnsSection` debajo de
  `CreditsPlan`.

---

## 4) Requisitos Funcionales

### 4.1 Estructura general (seccion 4)

- Titulo: "Explora nuestros Add-ons para potenciar tu Plan".
- Subtitulo de apoyo en una linea corta.
- Carrusel horizontal de cards con controles prev/next.
- En desktop se deben ver 3 cards por vista, como en `picture_1.png`.

### 4.2 Add-ons incluidos

La seccion muestra siempre estos 3 Add-ons base:

- OnSite Marketing
- Conversaciones
- Pack de Landing Pages

Adicionalmente, debe mostrar Eco IA solo si el usuario tiene habilitado el
feature `ecoIAEnabled` en `appSessionRef.current.userData.features`.

Cuando `features.ecoIAEnabled` sea `false`, `undefined` o no exista, la card de
Eco IA debe ocultarse por completo.

Tambien debe mostrar Push Notification solo si la variable de entorno
`REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN` es exactamente `'true'`.

Cuando `REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN` no sea `'true'`, la
card de Push Notification debe ocultarse por completo.

Cada card debe incluir:

- Icono del Add-on (clase `dpicon` del style-guide).
- Titulo.
- Descripcion breve.
- Leyenda de precio "desde".
- No debe tener CTA ni accion al hacer click sobre la card.

### 4.3 Fuente de datos

No hardcodear precio ni cantidades base. Usar fuentes reales existentes:

- OnSite: `dopplerAccountPlansApiClient.getOnSitePlans()` o hook existente del
  dominio (`useOnSitePlans` / `useAddOnPlans` con `AddOnType.OnSite`).
- Conversaciones: `dopplerAccountPlansApiClient.getCoversationsPLans()` o hook
  existente del dominio (`useConversationPlans` / `useAddOnPlans` con
  `AddOnType.Conversations`).
- Landing Pages: `dopplerAccountPlansApiClient.getLandingPacks()` via
  `useFetchLandingPacks`.
- Eco IA: `useAddOnPlans` con `AddOnType.EcoAI` o la fuente existente que usa
  el flujo `/buy-ecoia-plan`. Esta consulta solo debe ejecutarse cuando
  `features.ecoIAEnabled` sea `true`.
- Push Notification: `useAddOnPlans` con `AddOnType.PushNotifications` o la
  fuente existente que usa el flujo actual de Notificaciones Push. Esta consulta
  solo debe ejecutarse cuando
  `REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN === 'true'`.

Regla de precio visible:

- Mostrar el menor precio valido de cada Add-on (fee/price mayor a 0).
- Formatear moneda con `react-intl`.
- Si no hay dato disponible para un Add-on, mostrar estado fallback de card
  sin romper layout.

### 4.4 Cards informativas

- Por el momento, la seccion es solo informativa.
- No debe navegar al hacer click sobre una card.
- No debe mostrar CTA de compra dentro de las cards.
- No debe implementar links ocultos, `onClick`, `button`, `a` ni cambios de
  ruta asociados a las cards.

### 4.5 Navegacion del carrusel

- Flecha izquierda/derecha visibles en desktop.
- Click en flecha avanza/retrocede una card por vez.
- Deshabilitar flechas cuando no haya mas items hacia ese lado.
- En mobile: permitir desplazamiento tactil horizontal y conservar flechas si
  aplica al diseno final.

---

## 5) Diseno y Style-guide

- Respetar look & feel de `picture_1.png`:
  - fondo blanco para bloque seccion 4,
  - cards con borde suave y sombra ligera,
  - espaciado consistente con secciones superiores.
- Respetar el mismo formato visual de la seccion 4 de `picture_1.png`:
  - titulo centrado arriba del carrusel,
  - subtitulo centrado debajo del titulo,
  - cards alineadas horizontalmente,
  - flechas laterales a izquierda/derecha del carrusel,
  - jerarquia interna de card con icono, titulo, descripcion y precio.
- El ancho del contenido debe quedar alineado con la grilla de
  `NewPlanSelection` (misma columna visual de contenido central).
- Priorizar estilos, clases y patrones existentes del `doppler-style-guide`
  antes de agregar CSS nuevo.
- Reusar clases del style-guide para tipografia, grilla, cards, iconos y
  espaciados cuando existan equivalentes.
- No definir clases nuevas ni reglas CSS propias para tamanos de letra. Los
  tamanos tipograficos deben resolverse con clases existentes del
  `doppler-style-guide` o patrones ya usados por `NewPlanSelection`.
- Reusar clases del style-guide para botones y tipografia:
  - No aplica CTA en esta primera version.
- No agregar estilos globales; scopear estilos en
  `src/components/BuyProcess/NewPlanSelection/index.styles.js` o estilos
  locales del nuevo componente.
- Cualquier CSS propio debe limitarse a ajustes necesarios para reproducir el
  formato de `picture_1.png` cuando el style-guide no alcance.

---

## 6) Internacionalizacion

Agregar/reusar keys en:

- `src/i18n/es.js`
- `src/i18n/en.js`

Textos minimos:

- titulo/subtitulo de seccion 4.
- leyenda de precio base (ej. "Planes desde", "Packs desde", "por mes").

Para titulos/descripciones de los Add-ons, priorizar reutilizacion de keys
existentes en `my_plan.addons.*` cuando aplique.

---

## 7) Estados requeridos

- Loading del bloque mientras cargan datos de Add-ons.
- Error parcial: si falla un origen, no romper toda la seccion; mantener cards
  disponibles con fallback en la que falle.
- Empty total: si no hay datos para ninguno, ocultar carrusel y mostrar mensaje
  informativo simple (sin bloquear la pagina).

---

## 8) Tests requeridos

Agregar/actualizar tests de `NewPlanSelection` para validar:

- render de titulo/subtitulo de seccion 4.
- render de 3 cards base (OnSite, Conversaciones, Landing Pages).
- render de Eco IA cuando `features.ecoIAEnabled` es `true`.
- ocultamiento de Eco IA cuando `features.ecoIAEnabled` es `false`, `undefined`
  o no existe.
- render de Push Notification cuando
  `REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN` es `'true'`.
- ocultamiento de Push Notification cuando
  `REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN` no es `'true'`.
- calculo de precio base desde data mockeada (sin hardcode).
- flechas prev/next y cambio de item visible.
- las cards no renderizan links, botones ni ejecutan navegacion al hacer click.
- comportamiento fallback cuando un origen falla.

---

## 9) Definition of Done

- Seccion 4 visible en `NewPlanSelection` debajo de `CreditsPlan`.
- Carrusel funcional con cards base, Eco IA/Push Notification condicionales y
  flechas de navegacion.
- Precios y datos obtenidos de fuentes reales del dominio.
- Cards informativas sin CTA ni navegacion.
- i18n ES/EN actualizado.
- Tests en verde.
