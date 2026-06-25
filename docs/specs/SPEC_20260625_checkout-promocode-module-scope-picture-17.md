# SPEC_20260625_checkout-promocode-module-scope-picture-17

Estado: Draft

Assets principales:

- `docs/assets/picture_17.png`: referencia visual y funcional del problema a resolver.

Estandares relacionados:

- `AGENTS.md`
- Style-guide de Doppler cargado por manifest.

---

## 1) Objetivo

Definir e implementar la regla de alcance del promocode automatico y del
promocode ingresado por URL en `NewPlanSelection`, de modo que el valor por
defecto solo se aplique al modulo de compra que corresponde y no se derrame al
otro modulo visible en la misma pantalla.

La solucion debe cubrir el escenario mostrado en `picture_17.png`, donde el
usuario puede ver simultaneamente planes de `Contacts` y `Credits`, pero el
promocode automatico o por URL debe afectar unicamente el flujo permitido por
el promocode.

---

## 2) Alcance

### 2.1 En alcance

- `src/components/BuyProcess/NewPlanSelection/index.js`
- `src/components/BuyProcess/NewPlanSelection/ContactsPlan/index.js`
- `src/components/BuyProcess/NewPlanSelection/CreditsPlan/index.js`
- `src/components/BuyProcess/NewPlanSelection/Promocode/index.js`
- `src/components/BuyProcess/NewPlanSelection/index.test.js`
- keys nuevas o ajustes en:
  - `src/i18n/es.js`
  - `src/i18n/en.js`

### 2.2 Fuera de alcance

- Cambios de precio, descuentos o catalogo de planes.
- Cambios de checkout fuera de `NewPlanSelection`.
- Cambios en reglas de billing o validacion de promocodes en backend.
- Refactors generales no vinculados al bug visual/funcional de `picture_17`.

---

## 3) Contexto y problema

Actualmente `NewPlanSelection` puede precompletar el promocode de contactos
desde la variable de entorno `REACT_APP_PROMOCODE_CONTACTS` y/o desde query
params.

El problema que muestra `picture_17` es que, cuando el usuario ve tambien el
modulo de compra de `Credits`, el promocode de contactos no debe aplicarse ni
quedar visible en ese modulo.

La regla es simetrica:

- si el promocode corresponde a `Contacts`, no debe autocompletarse en
  `Credits`;
- si el promocode corresponde a `Credits`, no debe autocompletarse en
  `Contacts`.

---

## 4) Fuente de verdad

Prioridad para esta tarea:

1. Esta SPEC.
2. `AGENTS.md`.
3. Patrones actuales de `src/components/BuyProcess/NewPlanSelection/`.
4. `docs/assets/picture_17.png`.

Nota de trazabilidad:

- Esta SPEC nace a partir del asset `picture_17.png` y del comportamiento
  actual del flujo de compra.
- No existe una SPEC previa versionada para este ajuste puntual.

---

## 5) Requisitos funcionales

### 5.1 Regla general de alcance

El promocode automatico o por URL solo puede aplicarse al modulo de compra al
que corresponde.

En esta iteracion, la implementacion debe garantizar que:

- el promocode de `Contacts` no se autocompleta en el modulo de `Credits`;
- el promocode de `Credits` no se autocompleta en el modulo de `Contacts`;
- el promocode visible en un modulo no debe disparar el mensaje informativo del
  otro modulo;
- el modulo que no corresponde debe quedar sin promocode precargado.

### 5.2 Prioridad entre promocode manual y promocode automatico

Si el usuario ya tiene un promocode en la URL, ese valor tiene prioridad sobre
cualquier promocode automatico que pueda derivarse de la configuracion o del
contexto de sesion.

Reglas:

- no sobreescribir un promocode manual ya presente en query params;
- si el promocode manual es valido para el modulo actual, usar ese valor;
- si el promocode manual no corresponde al modulo actual, no propagarlo al otro
  modulo.

### 5.3 Regla para Contacts

Cuando la vista activa sea `ContactsPlan`:

- se puede precompletar `REACT_APP_PROMOCODE_CONTACTS` solo si corresponde al
  escenario permitido por la regla vigente del modulo;
- si la pantalla contiene tambien el modulo de `Credits`, ese promocode no
  debe aparecer alli;
- si existe un promocode por URL, debe respetarse la prioridad de URL sobre
  default automatico.

### 5.4 Regla para Credits

Cuando la vista activa sea `CreditsPlan`:

- no debe autocompletarse el promocode de contactos;
- si la pantalla contiene tambien el modulo de `Contacts`, ese promocode no
  debe derramarse hacia ese modulo;
- el modulo de credits debe preservar su propia logica de promocode y no usar
  el default pensado para contactos.

### 5.5 Simetria del caso contrario

El comportamiento debe contemplar el caso contrario al de la imagen:

- si existe un default o promocode por URL valido solo para `Credits`, no debe
  aparecer en `Contacts`;
- si la pantalla muestra ambos modulos, cada uno debe resolver su propio
  promocode sin contaminar al otro.

---

## 6) Integracion y componentes

### 6.1 Componente principal

- `src/components/BuyProcess/NewPlanSelection/index.js`

Responsabilidad:

- orquestar la seleccion de planes y el render de `ContactsPlan` y
  `CreditsPlan`;
- no aplicar una logica global de promocode que afecte a ambos modulos por
  igual;
- delegar en cada modulo su propia decision de promocode por defecto.

### 6.2 ContactsPlan

- `src/components/BuyProcess/NewPlanSelection/ContactsPlan/index.js`

Responsabilidad:

- resolver el promocode por defecto solo para el flujo de contactos;
- mantener el comportamiento actual de amount details, checkout URL y sticky
  summary;
- evitar que un promocode que no corresponda al modulo de contactos quede
  precargado.

### 6.3 CreditsPlan

- `src/components/BuyProcess/NewPlanSelection/CreditsPlan/index.js`

Responsabilidad:

- mantener su logica propia de promocode;
- no usar el default de contactos;
- preservar el resumen de compra y la navegacion al checkout de credits.

### 6.4 Promocode

- `src/components/BuyProcess/NewPlanSelection/Promocode/index.js`

Responsabilidad:

- aceptar un promocode por defecto recibido desde el modulo padre;
- usar ese default solo cuando corresponda al contexto actual;
- conservar la prioridad de promocode manual sobre el default.

---

## 7) Diseno y comportamiento visual

- Mantener el layout actual de `NewPlanSelection`.
- No introducir un nuevo patron visual para este caso.
- El bloque de aviso azul del promocode solo debe verse en el modulo correcto.
- El otro modulo debe quedar sin autocompletado y sin mostrar un mensaje
  indebido.

No se requieren cambios de estilo nuevos salvo los necesarios para mantener
coherencia con el estado vacio o sin promocode del modulo no afectado.

---

## 8) Internacionalizacion

Todo texto visible debe vivir en:

- `src/i18n/es.js`
- `src/i18n/en.js`

Reglas:

- no hardcodear copy visible en JSX;
- reutilizar keys existentes si el texto coincide exactamente;
- agregar keys nuevas solo si el mensaje necesita un copy distinto para este
  caso.

---

## 9) Accesibilidad

- Mantener labels, botones y controles actuales sin degradacion.
- No introducir interacciones ocultas para resolver la prioridad del
  promocode.
- El estado visible del input debe coincidir con el valor realmente aplicado.

---

## 10) Testing

Agregar o actualizar tests para validar, como minimo:

- que `ContactsPlan` siga pudiendo autocompletar su promocode valido;
- que `CreditsPlan` no reciba el promocode de contactos;
- que cuando ambos modulos estan visibles, el promocode no se derrame al
  modulo incorrecto;
- que un promocode por URL tenga prioridad sobre el default automatico;
- que el mensaje visual asociado al promocode solo aparezca en el modulo
  correspondiente;
- no regresion en el comportamiento actual de checkout y seleccion de planes.

Los tests deben escribirse desde la perspectiva del usuario, usando Testing
Library y los dobles existentes del repositorio.

---

## 11) Criterios de aceptacion

La tarea se considera completa cuando:

- el promocode automatico o por URL se aplica solo al modulo correcto;
- el modulo incorrecto no muestra promocode precargado ni mensaje asociado;
- el comportamiento es simetrico para Contacts y Credits;
- la pantalla de `picture_17.png` queda resuelta sin regresiones visibles;
- los tests relevantes pasan;
- i18n queda consistente con el comportamiento implementado.

---

## 12) Pendientes de detalle

Si producto quisiera una prioridad mas fina entre:

- promocode automatico de entorno;
- promocode por URL;
- promocode proveniente de sesion;

esa prioridad deberia quedar explicitada en una iteracion posterior o en una
ADR si cambia el contrato general del flujo.
