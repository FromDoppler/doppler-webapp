# SPEC_20260508_plan-contactos-seccion-2

Estado: Draft

Assets principales:

- `docs/assets/picture_1.png`: pantalla general con secciones numeradas. Esta
  SPEC cubre solo la seccion 2.
- `docs/assets/picture_6.png`: referencia del modal que se abre al hacer click
  en "Ver mas funcionalidades".

Estandares relacionados:

- `AGENTS.md`
- `docs/specs/SPEC_20260507_plan-contactos-seccion-1.md`
- Style-guide de Doppler cargado por manifest
- Referencia local de style-guide:
  `D:/Repositorios/doppler-style-guide`

---

## 1) Objetivo

Implementar la seccion 2 de `picture_1.png` dentro de
`/new-plan-selection`, agregando un bloque de funcionalidades con iconos y un
modal de detalle al hacer click en "Ver mas funcionalidades".

---

## 2) Alcance

Incluido:

- Nuevo componente `IncludedFeatures` dentro de `NewPlanSelection` para la
  seccion 2.
- Render de titulo, subtitulo y grilla de funcionalidades con iconos.
- Link/boton "Ver mas funcionalidades".
- Modal nuevo (dentro del area `NewPlanSelection`) inspirado en `picture_6.png`.
- Reutilizacion de estilos/clases existentes del style-guide en modal y tabla.
- Traducciones ES/EN para textos nuevos de seccion 2.
- Tests de render y apertura/cierre del modal.

Fuera de alcance:

- Cambios en seccion 1 (ya cubierta por SPEC previa), secciones 3/4/5.
- Cambios en APIs de planes/billing.
- Refactor de componentes no relacionados.

---

## 3) Componente Nuevo

Crear:

- `src/components/BuyProcess/NewPlanSelection/IncludedFeatures/index.js`

Responsabilidad:

- Mostrar el bloque visual de funcionalidades de la seccion 2.
- Manejar estado local de apertura/cierre del modal.
- Renderizar el contenido detallado del modal.

Integracion:

- `NewPlanSelection/index.js` debe renderizar `IncludedFeatures` debajo de
  `ContactsPlan`.

---

## 4) Requisitos Funcionales

### 4.1 Bloque de funcionalidades (seccion 2)

- Titulo y subtitulo alineados a `picture_1.png`.
- Grilla de 6 items (2 filas x 3 columnas en desktop, responsive en mobile).
- Cada item debe mostrar:
  - icono
  - titulo corto
  - descripcion corta
- El CTA "Ver mas funcionalidades" debe estar al pie del bloque.

### 4.2 Iconos

- Los iconos deben salir de clases declaradas en el repo de style-guide.
- Referencias de declaracion:
  - `doppler-style-guide/src/assets/scss/helpers/_icons-glyph-smooth.scss`
  - `doppler-style-guide/src/assets/scss/templates/_doppler-plus.scss`
- Para esta primera version, el bloque usa iconos de clase `dpicon iconapp-*`
  (sin SVG custom nuevo), envueltos en contenedores con color.

### 4.3 Modal "Ver mas funcionalidades"

- Al hacer click en "Ver mas funcionalidades" se abre modal.
- El modal usa estructura base del sistema:
  - contenedor `.modal`
  - `.modal-content--large`
  - boton/cierre `.close`
- Titulo del modal: "Funcionalidades y Soluciones" (ES) / "Features and Solutions" (EN).
- Cuerpo del modal:
  - acordeon con secciones funcionales
  - primera seccion expandida por defecto
  - tabla de detalle con items (nombre + descripcion) siguiendo estilo
    `dp-table-plans` / `dp-c-table dp-nested-table`.
- Debe poder cerrarse desde el icono `X`.

---

## 5) Reutilizacion de Style-guide

Priorizar clases existentes:

- Modal: clases de `modules/_modal.scss`.
- Tabla de funcionalidades: clases de `modules/_tables.scss`.
- Acordeon: clases `dp-accordion`, `dp-accordion-thumb`, `dp-accordion-panel`.

Si falta ajuste visual puntual, agregar solo CSS scoped en
`NewPlanSelection/index.styles.js`, sin tocar estilos globales del proyecto.

---

## 6) Internacionalizacion

Agregar keys nuevas en:

- `src/i18n/es.js`
- `src/i18n/en.js`

Nuevos textos minimos:

- titulo/subtitulo del bloque seccion 2
- titulos/descripciones de los 6 items
- label CTA "Ver mas funcionalidades"
- titulo del modal

El detalle interno del modal puede reutilizar keys existentes de
`plan_types.table.*` cuando aplique.

---

## 7) Tests

Actualizar `src/components/BuyProcess/NewPlanSelection/index.test.js` para cubrir:

- Render de seccion 2 (titulo + CTA + al menos un item).
- Apertura del modal al click en "Ver mas funcionalidades".
- Cierre del modal al click en `X`.

---

## 8) Definition of Done

- Seccion 2 visible en `/new-plan-selection`.
- Modal funcional y consistente con `picture_6.png`.
- Uso de iconos declarados en style-guide.
- i18n ES/EN actualizado.
- Tests de seccion 2 en verde.
