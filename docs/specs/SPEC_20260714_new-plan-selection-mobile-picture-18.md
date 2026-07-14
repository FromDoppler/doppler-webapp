# SPEC_20260714_new-plan-selection-mobile-picture-18

Estado: Draft

Assets principales:

- `docs/assets/picture_18.png`: referencia visual objetivo para la version
  mobile de `NewPlanSelection`.

Estandares relacionados:

- `AGENTS.md`
- `docs/specs/SPEC_20260507_plan-contactos-seccion-1.md`
- `docs/specs/SPEC_20260508_plan-contactos-seccion-2.md`
- `docs/specs/SPEC_20260511_plan-contactos-seccion-3-sticky.md`
- `docs/specs/SPEC_20260513_plan-creditos-seccion-10.md`
- `docs/specs/SPEC_20260514_plan-contactos-seccion-4-addons.md`
- `docs/specs/SPEC_20260515_plan-contactos-seccion-5-faq.md`
- `docs/specs/SPEC_20260518_plan-envios-picture-13.md`
- `docs/specs/SPEC_20260625_checkout-promocode-module-scope-picture-17.md`
- Style-guide de Doppler cargado por manifest.

---

## 1) Objetivo

Definir la adaptacion visual mobile de la pagina `NewPlanSelection` segun la
referencia `picture_18.png`.

Esta SPEC cubre solo cambios de UI/responsive para mobile. No introduce cambios
de reglas de negocio, pricing, promocodes, navegacion, servicios ni contratos
de checkout ya definidos por las SPEC existentes.

---

## 2) Alcance

### 2.1 En alcance

- Ajustes visuales y de layout para `NewPlanSelection` en mobile.
- Reordenamiento responsive de bloques ya existentes:
  - header,
  - card principal del plan,
  - modulo de credits cuando corresponda,
  - sticky summary,
  - `IncludedFeatures`,
  - `AddOnsSection`,
  - `FAQSection`.
- Ajustes de espaciado, jerarquia tipografica y anchos para controles mobile.
- Ajustes para evitar solapamientos con el sticky CTA inferior.
- Tests de comportamiento visual/responsive acotados al layout mobile.

### 2.2 Fuera de alcance

- Cambios funcionales en seleccion de plan, frecuencia o promocode.
- Cambios de copy, salvo que la implementacion detecte truncado o necesidad
  puntual de una variante ya aprobada por producto.
- Cambios de desktop.
- Cambios de tablet si no comparten el breakpoint mobile existente.
- Nuevos componentes de negocio.
- Cambios en APIs, reducers, servicios o reglas de pricing/billing.

---

## 3) Fuente de verdad

Prioridad para esta tarea:

1. Esta SPEC.
2. `AGENTS.md`.
3. Las SPEC previas de `NewPlanSelection`.
4. `docs/assets/picture_18.png`.
5. Patrones actuales de `src/components/BuyProcess/NewPlanSelection/`.

Nota de trazabilidad:

- `picture_18.png` se interpreta como variante mobile de la pagina completa.
- Donde la imagen no explicite comportamiento funcional, debe preservarse el
  comportamiento actual ya implementado.

---

## 4) Regla de aplicacion

La variante definida por esta SPEC debe aplicarse solo en el breakpoint mobile
ya usado actualmente por `NewPlanSelection`.

Para esta iteracion, se toma como breakpoint objetivo:

- `@media (max-width: 767px)`

Reglas:

- desktop y tablet deben conservar el comportamiento visual actual;
- no deben introducirse cambios de markup o estilos que degraden los
  breakpoints mayores;
- si algun ajuste mobile requiere soporte tambien en `<= 991px`, debe hacerse
  solo cuando sea estrictamente necesario para mantener continuidad visual y sin
  alterar la composicion desktop.

---

## 5) Contexto visual esperado

`picture_18.png` muestra una version mobile de `NewPlanSelection` con:

- header mas compacto;
- contenido apilado en una sola columna;
- card principal con controles y resumen de precio en flujo vertical;
- CTA principal full width dentro de la card;
- sticky summary inferior persistente;
- secciones inferiores (`IncludedFeatures`, add-ons y FAQ) con tratamiento
  mobile de una columna;
- mayor separacion visual entre modulos para facilitar lectura en pantallas
  angostas.

La pantalla debe sentirse como una adaptacion intencional de producto mobile y
no solo como un colapso mecanico de la version desktop.

---

## 6) Requisitos funcionales no modificados

La implementacion mobile debe preservar sin cambios:

- seleccion inicial de planes por query params o plan de sesion;
- reglas actuales de frecuencia;
- reglas actuales de promocode;
- estados de loading, error, empty, disabled y success;
- URLs y params de navegacion a checkout;
- orden funcional de secciones;
- variantes por `Contacts`, `Credits` y `Emails`;
- CTA comercial en escenarios ya definidos por otras SPEC.

En otras palabras, esta SPEC cambia presentacion, no logica.

---

## 7) Requisitos de UI mobile

### 7.1 Contenedor general

- Todo el contenido principal debe renderizarse en una sola columna.
- El ancho util debe aprovechar la pantalla mobile sin generar scroll
  horizontal.
- Los paddings laterales deben reducirse respecto de desktop, manteniendo aire
  suficiente para no pegar el contenido a los bordes.
- Debe reservarse espacio inferior suficiente para que el sticky summary fijo
  no tape contenido interactivo ni el cierre de FAQ/add-ons.

### 7.2 Header

- El bloque superior debe compactarse visualmente.
- La accion `Volver` debe mantenerse arriba del titulo.
- El titulo principal debe conservar su jerarquia semantica y poder partir en
  varias lineas sin solapar el icono.
- El subtitulo debe permanecer visible debajo del titulo, con ancho completo y
  sin depender de un max-width de desktop.

### 7.3 Card principal de plan

- La card principal debe mantener fondo, borde, radio y look del style-guide.
- En mobile, su padding interno debe reducirse para priorizar ancho util.
- El header de la card debe pasar a composicion vertical:
  - titulo/descripcion primero,
  - badge debajo o alineado sin forzar una fila horizontal.
- No debe haber recortes ni superposiciones entre titulo, badge y descripcion.

### 7.4 Controles de seleccion

- El selector principal debe ocupar 100% del ancho disponible.
- El control de frecuencia debe seguir siendo operable sin scroll horizontal.
- Los cuatro segmentos de frecuencia deben permanecer visibles y tocables en
  mobile.
- El modulo de promocode debe apilarse en mobile:
  - input en ancho completo,
  - boton `Aplicar` debajo en ancho completo.
- Los mensajes asociados a promocode o escenarios especiales deben quedar debajo
  del control, sin romper el flujo vertical.

### 7.5 Resumen de precio dentro de la card

- El bloque de precio debe ubicarse debajo de los controles.
- Debe conservar el separador respecto del bloque superior, pero en mobile ese
  separador debe ser horizontal en lugar de vertical.
- El precio principal debe seguir teniendo protagonismo visual.
- El CTA principal de la card debe ocupar todo el ancho disponible.
- El disclaimer debe mantenerse debajo del CTA y no quedar tapado por el sticky
  inferior.

### 7.6 Sticky summary mobile

- El sticky summary debe permanecer fijo al borde inferior de la ventana.
- En mobile debe presentarse en una sola columna visual.
- El boton del sticky debe ser full width.
- El copy del sticky debe poder partir en varias lineas sin desbordes.
- Si existe precio tachado o texto de descuento, debe seguir siendo legible en
  el espacio mobile.
- El sticky no debe superponerse con elementos interactivos al final de la
  pagina; la pagina debe incluir espacio de cierre suficiente.

### 7.7 Modulo de Credits

- Cuando `CreditsPlan` este visible en la pagina, debe respetar la misma logica
  de adaptacion mobile:
  - una sola columna,
  - controles full width,
  - bloque de precio debajo,
  - CTA full width.
- El tratamiento visual destacado del modulo de credits debe preservarse.

### 7.8 Variante Emails

- La variante `EmailsPlan` debe adoptar el mismo criterio mobile de una sola
  columna.
- Los escenarios especiales ya definidos por `picture_13`, `picture_14` y
  `picture_15` deben seguir viendose correctamente en mobile sin generar cortes
  ni scroll horizontal.

### 7.9 Included Features

- La seccion `IncludedFeatures` debe mostrarse en una sola columna en mobile.
- Cada item debe mantener icono, titulo, separador y descripcion con lectura
  vertical clara.
- La accion `Ver mas` o equivalente debe seguir siendo accesible por touch.
- Si se abre el modal/listado expandido, su layout mobile debe seguir siendo
  usable dentro del viewport.

### 7.10 Add-ons

- La seccion de add-ons debe adaptarse a mobile mostrando una sola card por fila
  visible.
- El contenido interno de cada card debe apilarse correctamente.
- Los CTAs de add-ons deben seguir siendo accesibles y visibles sin truncado.
- Si se mantienen controles de navegacion del carousel, deben ser alcanzables y
  no quedar fuera del viewport.

### 7.11 FAQ

- La seccion FAQ debe conservar su comportamiento actual.
- En mobile debe respetar paddings y espaciado consistentes con la captura.
- El contenido final de la FAQ no debe quedar oculto detras del sticky summary.

---

## 8) Componentes impactados

La implementacion deberia concentrarse principalmente en:

- `src/components/BuyProcess/NewPlanSelection/index.styles.js`

Y, solo si fuera necesario por encapsulamiento visual, en estilos cercanos a:

- `src/components/BuyProcess/NewPlanSelection/StickyPlanSummary/`
- `src/components/BuyProcess/NewPlanSelection/ContactsPlan/`
- `src/components/BuyProcess/NewPlanSelection/CreditsPlan/`
- `src/components/BuyProcess/NewPlanSelection/EmailsPlan/`
- `src/components/BuyProcess/NewPlanSelection/IncludedFeatures/`
- `src/components/BuyProcess/NewPlanSelection/AddOnsSection/`

Reglas:

- priorizar ajustes de estilos sobre cambios de estructura funcional;
- evitar refactors generales;
- no duplicar componentes solo para mobile salvo necesidad tecnica concreta.

---

## 9) Styling y style-guide

- Reutilizar el sistema visual existente de Doppler.
- Mantener la paleta actual del flujo.
- Conservar radios de `3px` y estilos base de botones, mensajes, cards y
  inputs.
- Evitar estilos globales en `src/App.scss`.
- Preferir ajustes scoped con `styled-components`.

Criterios visuales obligatorios:

- sin scroll horizontal;
- sin texto montado sobre iconos o badges;
- sin CTAs cortados;
- sin campos que excedan el ancho del viewport;
- sin overlays o mensajes tapados por el sticky inferior.

---

## 10) Accesibilidad

- El orden visual mobile no debe romper el orden semantico del DOM.
- Todos los botones y controles deben seguir siendo accesibles por teclado.
- El sticky inferior debe mantener foco visible y no impedir navegar al
  contenido previo.
- Los targets tactiles de botones y controles deben seguir siendo razonables en
  mobile.

---

## 11) Internacionalizacion

No se esperan nuevos textos por esta SPEC.

Si durante la implementacion surgiera la necesidad de ajustar algun copy por
overflow o truncado, ese cambio debe evaluarse aparte y no asumirse como parte
automatica de esta iteracion.

---

## 12) Testing requerido

Agregar o actualizar tests para validar, como minimo:

- render mobile sin scroll horizontal para la estructura principal;
- CTA principal full width en mobile;
- promocode apilado en mobile;
- bloque de precio debajo de controles en mobile;
- sticky summary visible y con boton full width en mobile;
- `IncludedFeatures` en una sola columna mobile;
- add-ons en una sola card por fila visible en mobile;
- no regresion visual/estructural en `CreditsPlan` y `EmailsPlan` cuando
  apliquen;
- no regresion funcional en comportamiento de planes, promocodes y checkout.

Se pueden complementar con tests de estilo/clase o tests de estructura del DOM,
segun el patron actual del repositorio.

---

## 13) Criterios de aceptacion

La tarea se considera completa cuando:

- `NewPlanSelection` replica de forma consistente la intencion visual de
  `picture_18.png` en mobile;
- la variante solo aplica en mobile;
- no hay cambios de logica de negocio;
- no hay regresiones visibles en desktop;
- no hay scroll horizontal en mobile;
- el sticky inferior no tapa controles ni contenido final;
- `Contacts`, `Credits` y `Emails` mantienen una experiencia usable en mobile.

---

## 14) Ambiguedades registradas

- `picture_18.png` funciona como referencia visual de pantalla completa, pero no
  define por si misma medidas exactas, spacing token por token ni copy nuevo.
- Esta SPEC asume que los textos existentes se conservan y que la meta es
  adaptar el layout actual al viewport mobile.
- Si producto quisiera cambios de contenido, jerarquia de secciones o
  comportamiento adicional del sticky para mobile, eso deberia definirse en una
  iteracion posterior.
