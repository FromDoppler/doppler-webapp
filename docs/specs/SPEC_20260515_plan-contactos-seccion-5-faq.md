# SPEC_20260515_plan-contactos-seccion-5-faq

Estado: Draft

Assets principales:

- `docs/assets/picture_1.png`: pantalla general con secciones numeradas. Esta
  SPEC cubre solo la seccion 5 (bloque FAQ).

Referencias de producto:

- Seccion equivalente en sitio publico:
  `https://www.fromdoppler.com/es/precios/?utm_medium=none&utm_source=direct#plan-marketing`
  (bloque "Preguntas frecuentes", misma estructura y contenido funcional).

Estandares relacionados:

- `AGENTS.md`
- `docs/specs/SPEC_20260507_plan-contactos-seccion-1.md`
- `docs/specs/SPEC_20260508_plan-contactos-seccion-2.md`
- `docs/specs/SPEC_20260511_plan-contactos-seccion-3-sticky.md`
- `docs/specs/SPEC_20260514_plan-contactos-seccion-4-addons.md`
- Style-guide de Doppler cargado por manifest.

---

## 1) Objetivo

Implementar la seccion 5 de `picture_1.png` dentro de `NewPlanSelection`,
mostrando un bloque de Preguntas Frecuentes consistente con la experiencia ya
publicada en `fromdoppler.com/es/precios` para Plan de Marketing.

---

## 2) Alcance

Incluido:

- Nuevo bloque FAQ debajo de la seccion 4 (Add-ons) en `NewPlanSelection`.
- Render de titulo de FAQ y listado de preguntas/respuestas.
- Reuso de copy funcional y orden de preguntas de la referencia publica.
- Reuso de estilos/componentes del style-guide y componentes existentes del
  proyecto.
- i18n ES/EN alineado (reusar keys existentes cuando sea posible).
- Tests de render y estructura del bloque.

Fuera de alcance:

- Cambios de pricing o reglas de negocio de compra.
- Cambios en comportamiento de checkout.
- Creacion de nueva logica backend/API.
- Variantes FAQ por tipo de plan en esta iteracion.

---

## 3) Integracion y Componentes

### 3.1 Integracion en NewPlanSelection

- `src/components/BuyProcess/NewPlanSelection/index.js` debe renderizar la
  seccion FAQ luego de `AddOnsSection`.

### 3.2 Reuso recomendado (obligatorio salvo impedimento tecnico)

- Reusar `src/components/FAQ/index.js`.
- Reusar `src/components/FAQ/QAItem/index.js`.
- Reusar `src/components/FAQ/constants.js` (o extraer un set equivalente para
  `NewPlanSelection` si hubiera necesidad de desacople futuro).

Si se crea wrapper especifico, sugerido:

- `src/components/BuyProcess/NewPlanSelection/FAQSection/index.js`

Responsabilidad del wrapper:

- Encapsular posicion/layout en el contexto de `NewPlanSelection`.
- Delegar contenido/estructura al componente FAQ existente.

---

## 4) Requisitos Funcionales

### 4.1 Estructura general (seccion 5)

- Titulo de bloque FAQ visible.
- Grilla de items FAQ con formato acordeon/collapse del style-guide.
- El bloque debe mantener el ancho alineado con la grilla central de
  `NewPlanSelection`.

### 4.2 Contenido funcional

Debe replicar la misma intencion funcional del sitio de referencia en
`/es/precios` para Plan de Marketing, incluyendo:

- Metodos de pago.
- Permanencia / baja del servicio.
- Renovacion automatica.
- Recomendacion para bases > 100.000 contactos.
- Vigencia de creditos.
- Aplicacion de codigo promocional.
- Requisito de plan pago para SMS.
- Comportamiento de envios no utilizados.
- Reemplazo de contactos de cuenta gratis.

### 4.3 Regla de i18n

Prioridad de implementacion:

- Reusar namespace existente `faq.*` para evitar duplicados.
- Si se detecta diferencia de redaccion entre web publica y keys actuales:
  - ajustar keys existentes solo si no rompe otros flujos, o
  - crear keys especificas en `buy_process.new_plan_selection.faq_section.*`
    y mapearlas solo en esta seccion.

No hardcodear textos visibles en el componente.

---

## 5) Diseno y Style-guide

- Respetar formato de `picture_1.png` para seccion 5.
- Priorizar clases y patrones existentes del style-guide (`dp-container`,
  `dp-rowflex`, `dp-accordion`, jerarquias de titulo existentes).
- No definir nuevas reglas de tamano tipografico si ya existe clase equivalente
  en style-guide/proyecto.
- Evitar estilos globales; scopear ajustes en
  `src/components/BuyProcess/NewPlanSelection/index.styles.js` solo si es
  estrictamente necesario para alineacion/espaciado.

---

## 6) Accesibilidad

- Mantener estructura semantica de headings coherente con `NewPlanSelection`.
- Las preguntas deben ser navegables por teclado segun patron existente del
  acordeon del style-guide.
- Evitar introducir elementos interactivos custom sin roles/atributos
  accesibles.

---

## 7) Tests requeridos

Agregar/actualizar tests en `NewPlanSelection` para validar:

- render de la seccion FAQ en posicion correcta (debajo de Add-ons).
- render del titulo FAQ.
- render de los 9 items FAQ esperados.
- presencia de preguntas via keys i18n (provider ids-as-values para no atar
  tests al copy final).
- no regresion de secciones previas (Contactos, Creditos, Add-ons).

Si se crea wrapper nuevo, agregar test unitario del wrapper.

---

## 8) Definition of Done

- Seccion 5 visible en `NewPlanSelection` con formato consistente.
- FAQ implementada con reuso de componentes/estilos existentes.
- i18n ES/EN resuelto sin textos hardcodeados.
- Tests relevantes en verde.
- Sin regresiones visuales/funcionales en secciones 1 a 4.

