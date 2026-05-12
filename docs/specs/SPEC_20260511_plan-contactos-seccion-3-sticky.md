# SPEC_20260511_plan-contactos-seccion-3-sticky

Estado: Draft

Assets principales:

- `docs/assets/picture_1.png`: pantalla base con secciones numeradas.
- `docs/assets/picture_7.png`: referencia visual del sticky en estado normal
  (Plan Contactos).
- `docs/assets/picture_8.jpeg`: referencia visual del sticky en estado
  "Mas de 100.000" (Plan Envios personalizado).
- `docs/assets/picture_9.png`: referencia visual del sticky con descuento
  aplicado (frecuencia de pago o promocode).

Estandares relacionados:

- `AGENTS.md`
- `docs/specs/SPEC_20260507_plan-contactos-seccion-1.md`
- `docs/specs/SPEC_20260508_plan-contactos-seccion-2.md`
- Style-guide de Doppler cargado por manifest.
- Referencia local de style-guide: `D:/Repositorios/doppler-style-guide`

---

## 1) Objetivo

Implementar la seccion 3 de la pantalla de `NewPlanSelection`: un resumen sticky
siempre visible que acompañe el scroll y se sincronice en tiempo real con la
seleccion hecha en `ContactsPlan`.

---

## 2) Alcance

Incluido:

- Nuevo componente sticky dentro de `NewPlanSelection`.
- Visual del sticky en estado normal (imagen 7).
- Visual del sticky para "Mas de 100.000" (imagen 8).
- Sincronizacion con plan, precio, descuentos y tope de contactos.
- CTA del sticky con la misma logica del CTA principal de `ContactsPlan`.
- i18n ES/EN de textos nuevos.
- Tests de render, sincronizacion y accion del boton.

Fuera de alcance:

- Cambios funcionales de seccion 1 y seccion 2 (solo integracion de datos).
- Nuevas reglas de pricing o descuentos en backend.
- Refactor de componentes no relacionados.

---

## 3) Componente Nuevo

Crear:

- `src/components/BuyProcess/NewPlanSelection/StickyPlanSummary/index.js`

Responsabilidad:

- Renderizar el resumen sticky (nombre de plan, precio/estado, leyenda y CTA).
- Reflejar los cambios de estado emitidos por `ContactsPlan`.
- Mantener visibilidad durante scroll.

Integracion:

- `NewPlanSelection/index.js` debe renderizar `StickyPlanSummary` debajo del
  header de pagina y antes del resto del contenido principal.
- `ContactsPlan` debe exponer/propagar al contenedor los datos necesarios para
  hidratar el sticky (sin duplicar calculos de negocio).

---

## 4) Requisitos Funcionales

### 4.1 Comportamiento sticky

- El resumen debe permanecer visible durante todo el scroll de la pagina.
- Debe moverse junto al viewport (comportamiento sticky) y no desaparecer al
  bajar/subir.
- En desktop debe ocupar una sola franja horizontal.
- En mobile debe conservar legibilidad y jerarquia (puede adaptar layout, pero
  mantiene informacion y CTA visibles).

### 4.2 Estado normal (referencia `picture_7.png`)

Debe mostrar:

- Titulo: `Plan Contactos` + precio mensual final + `/mes`.
- Subtitulo: tope de contactos del plan seleccionado + beneficios base
  (`Envios ilimitados`).
- CTA: `Comprar Ahora`.

Ejemplo visual esperado:

- `Plan Contactos U$D 10/mes`
- `Hasta 500 Contactos + Envios ilimitados`

### 4.3 Sincronizacion con `ContactsPlan`

Al cambiar en `ContactsPlan` cualquiera de estos datos, el sticky debe
actualizarse automaticamente:

- plan seleccionado (tope de contactos),
- precio final visible,
- descuentos aplicados por frecuencia,
- descuentos aplicados por promocode (si corresponde al precio final mostrado).

Adicionalmente, cuando exista un descuento activo, el sticky debe mostrar una
leyenda de detalle en su bloque central:

- Escenario frecuencia de pago: mostrar periodo, porcentaje y total del pago
  (ej.: `Facturación Anual 25%OFF | 1 Pago anual de US$90`).
- Escenario promocode: mostrar porcentaje y duración del beneficio
  (ej.: `Descuento 10% OFF por 3 meses`).
  - Excepcion: si la duracion del promocode es `0`, mostrar solo el
    porcentaje (ej.: `Descuento 10% OFF`) sin referencia a meses.

La fuente de verdad del sticky debe ser el estado ya calculado del flujo de
`ContactsPlan`; no se deben recrear reglas paralelas en el sticky.

### 4.4 CTA del sticky

- El boton del sticky debe ejecutar exactamente la misma accion que el boton
  principal de `ContactsPlan`.
- Debe mantener el mismo destino y query params del flujo de checkout
  (`selected-plan`, `discountId`, `monthPlan`, y promocode solo si aplica).
- Debe respetar estados deshabilitados/alternativos cuando correspondan.

### 4.5 Estado "Mas de 100.000" (referencia `picture_8.jpeg`)

Cuando en `ContactsPlan` se seleccione `Mas de 100.000`:

- El sticky cambia al estado de plan personalizado.
- Titulo: `Plan Envios Personalizado`.
- Subtitulo: `Contactos ilimitados + Envios con precios a medida`.
- CTA: `Consultar con Doppler Team`.
- El CTA debe usar la misma accion ya definida para el caso personalizado en
  `ContactsPlan` (contacto comercial).

---

## 5) Reutilizacion de Style-guide

Priorizar clases y patrones existentes para:

- contenedor tipo barra/resumen,
- tipografias de titulos y texto auxiliar,
- boton primario verde del CTA.

Si se requiere CSS nuevo:

- agregarlo scopeado en `NewPlanSelection/index.styles.js` o en estilos del
  componente sticky;
- evitar estilos globales.

---

## 6) Datos y Contrato entre Componentes

`ContactsPlan` debe exponer al contenedor (o contexto interno de
`NewPlanSelection`) un modelo de estado del sticky con, al menos:

- `isCustomPlan` (boolean),
- `planName`,
- `contactsDescription`,
- `displayPrice` (valor final mostrado),
- `pricePeriod` (mes),
- `ctaLabel`,
- `ctaAction` (handler reutilizado del boton principal).

Este contrato evita acoplar el sticky a reducers internos de frecuencia o
promocode.

---

## 7) Internacionalizacion

Agregar keys nuevas en:

- `src/i18n/es.js`
- `src/i18n/en.js`

Textos minimos:

- titulo base del sticky (plan contactos),
- leyenda de contactos/envios,
- CTA `Comprar Ahora`,
- titulo de estado personalizado,
- leyenda de estado personalizado,
- CTA `Consultar con Doppler Team`.

---

## 8) Tests

Actualizar/agregar tests en `NewPlanSelection` para cubrir:

- render del sticky en estado normal;
- sticky visible junto al contenido de la pagina;
- actualizacion de texto/precio al cambiar plan en `ContactsPlan`;
- actualizacion por cambio de frecuencia/promocode (cuando modifiquen precio);
- validacion de promocode con duracion `0` (sin mostrar meses en el sticky);
- click en CTA del sticky ejecuta la misma accion que CTA de `ContactsPlan`;
- estado visual y funcional al seleccionar `Mas de 100.000`.

---

## 9) Definition of Done

- Sticky implementado y visible durante scroll.
- Datos del sticky sincronizados con `ContactsPlan`.
- CTA del sticky reutiliza logica de compra/contacto existente.
- Estado personalizado (`Mas de 100.000`) alineado con `picture_8.jpeg`.
- i18n ES/EN agregado.
- Tests en verde.

