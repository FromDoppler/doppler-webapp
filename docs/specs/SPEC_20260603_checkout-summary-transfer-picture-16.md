# SPEC_20260603_checkout-summary-transfer-picture-16

## 1) Contexto

Esta SPEC define la implementacion de la variante visual referenciada por
`docs/assets/picture_16.png` dentro del flujo de `CheckoutSummary`, para el
escenario en el que el metodo de pago del checkout es `TRANSF`.

La imagen corresponde al estado posterior a una compra/upgrade que todavia
requiere acreditacion manual del pago por transferencia bancaria.

---

## 2) Fuente de verdad

Prioridad para esta tarea:

1. Esta SPEC.
2. `AGENTS.md`.
3. Patrones actuales de `src/components/Plans/Checkout/CheckoutSummary/`.
4. Asset de referencia: `docs/assets/picture_16.png`.

Nota de trazabilidad:

- Esta SPEC nace a partir del prompt y del asset `picture_16.png`.
- No existe una SPEC previa versionada para este cambio puntual.

---

## 3) Objetivo

Cuando el usuario llegue a `CheckoutSummary` con metodo de pago
`TRANSF`, debe mostrarse una variante alineada con `picture_16.png`,
reemplazando el bloque actual de instrucciones genericas por una presentacion
mas guiada del proceso de pago.

La implementacion debe:

- mantener el mensaje de estado del checkout;
- mantener el resumen de compra existente;
- mostrar pasos claros para completar el pago por transferencia;
- mostrar los datos bancarios necesarios en pantalla segun pais de facturacion;
- preservar los flujos actuales no alcanzados por `picture_16`.

---

## 4) Alcance

### 4.1 En alcance

- Ruta `CheckoutSummary`:
  `src/components/Plans/Checkout/CheckoutSummary/CheckoutSummary.js`
- Bloque de instrucciones de transferencia:
  `src/components/Plans/Checkout/CheckoutSummary/TransferInformation/index.js`
- Textos visibles del resumen de checkout para transferencia en:
  - `src/i18n/es.js`
  - `src/i18n/en.js`
- Tests del flujo de resumen de checkout por transferencia.

### 4.2 Fuera de alcance

- Cambios en el formulario de seleccion/carga del metodo de pago.
- Cambios en `PaymentMethod`, `BillingInformation` o `ContactInformation`.
- Cambios en checkout success para tarjeta, Mercado Pago o debito automatico.
- Cambios de comportamiento del checkout server-side o de APIs de billing.
- Implementacion de logica de copiado al portapapeles.
- Creacion de un flujo distinto por pais fuera del mismo layout base.

---

## 5) Escenario objetivo

### 5.1 Condiciones de activacion

La variante de `picture_16` debe aplicarse solo cuando se cumplan todas estas
condiciones:

- el usuario esta en `CheckoutSummary`;
- el query param `paymentMethod` equivale a `TRANSF`;
- `upgradePending` es `true`;
- `billingCountry` es uno de estos valores:
  - `ar`
  - `mx`
  - `co`

### 5.2 Fallback

Si `paymentMethod` es `TRANSF` pero no se cumple alguna de estas condiciones:

- `billingCountry !== 'ar'`; o
- `upgradePending === false`;

debe preservarse el bloque actual de transferencia, sin forzar el layout nuevo
de `picture_16`.

Razon:

- el nuevo layout debe cubrir todos los paises hoy soportados para
  transferencia;
- el fallback actual debe seguir protegiendo cualquier pais futuro/no esperado y
  el caso transferencia sin `upgradePending`.

---

## 6) Comportamiento funcional

### 6.1 Estructura general

En el escenario objetivo, `CheckoutSummary` debe mantener:

- link de volver arriba de la pagina;
- titulo principal `Disfruta Doppler`;
- mensaje de estado con CTA `IR AL INICIO`;
- resumen de compra actual;
- bloque de pasos para completar el pago.

No debe cambiar:

- la navegacion del CTA `IR AL INICIO` (`/dashboard`);
- la logica que decide titulo, descripcion y summary segun `buyType`;
- el origen de `paymentMethod`, `billingCountry` y `upgradePending`.

### 6.2 Mensaje de estado

El bloque superior tipo success/warning debe conservar la logica actual del
flujo de transferencia con `upgradePending`, reutilizando:

- `checkoutProcessSuccess.transfer_title`
- `checkoutProcessSuccess.transfer_warning_message`
- `checkoutProcessSuccess.go_to_home_link`

La implementacion no debe introducir una nueva decision de negocio para ese
mensaje si la logica actual ya resuelve el estado correcto.

### 6.3 Resumen de compra

El resumen de compra visible debajo del mensaje superior debe reutilizar el
componente y la logica existentes.

No debe redisenarse el resumen de:

- detalle/tipo de plan;
- cantidad;
- facturacion;
- cantidades de creditos/regalos si aplicaran.

### 6.4 Bloque de pasos para transferencia

El bloque actual de `TransferInformation` debe adaptarse al layout y contenido
de `picture_16` para el caso objetivo.

El layout base debe ser el mismo para Argentina, Mexico y Colombia. Lo que
varia por pais es el contenido del bloque de datos bancarios/instrucciones
especificas.

Regla explicita:

- los pasos para completar el proceso de pago aplican tambien para Mexico y
  Colombia;
- no debe existir una secuencia distinta de pasos por pais en esta iteracion;
- la unica variacion permitida por pais dentro de esa secuencia comun es la
  informacion bancaria o fiscal necesaria para concretar la transferencia.

Debe incluir:

1. Un heading de seccion reutilizando
   `checkoutProcessSuccess.transfer_steps_title`.
2. Un paso inicial con texto introductorio para realizar el deposito o
   transferencia bancaria.
3. Un bloque visual de datos bancarios del pais correspondiente.
4. Un paso para enviar el comprobante a `billing@fromdoppler.com`.
5. Un paso final indicando que, una vez confirmado el pago, el usuario podra
   comenzar a usar su nuevo plan.
6. Una linea final de cierre reutilizando
   `checkoutProcessSuccess.transfer_explore_message`.

### 6.5 Datos bancarios por pais

El bloque de datos bancarios debe resolverse segun `billingCountry`.

Los pasos 1, 2, 4, 5 y 6 mantienen la misma intencion funcional para `ar`,
`mx` y `co`. Solo el contenido del bloque del paso 3 puede variar segun el
pais.

#### Argentina (`ar`)

Para `billingCountry = 'ar'`, el bloque debe mostrar estos valores, alineados
al asset `picture_16`:

- Banco: `BBVA BANCO FRANCES S.A.`
- Titular: `Biside SRL`
- CUIT: `30-7119594-1`
- CC: `090/408227/0`
- CBU: `0170090920000040822703`
- Alias: `BISIDE`

#### Mexico (`mx`)

Para `billingCountry = 'mx'`, debe mostrarse el mismo layout base de
`picture_16`, reemplazando el bloque bancario por los datos especificos de
transferencia definidos para Mexico.

#### Colombia (`co`)

Para `billingCountry = 'co'`, debe mostrarse el mismo layout base de
`picture_16`, reemplazando el bloque bancario por los datos especificos de
transferencia definidos para Colombia.

Reglas comunes:

- los labels visibles (`Banco`, `Titular`, `CUIT`, `CC`, `CBU`, `Alias`) deben
  vivir en i18n cuando apliquen;
- si un pais requiere labels distintos a los de Argentina, esos labels tambien
  deben salir de i18n;
- los valores de las cuentas o instrucciones por pais deben quedar
  centralizados en una configuracion scopeada al bloque de transferencia y no
  desperdigados en JSX;
- no inventar una fuente remota nueva para estos datos.

Contrato esperado:

- la implementacion debe poder resolver datos por `billingCountry` para `ar`,
  `mx` y `co`;
- si faltara algun dato puntual de negocio para `mx` o `co`, debe dejarse
  explicitado antes de implementar, no inferido desde el asset argentino.

### 6.6 Iconografia del bloque bancario

`picture_16` muestra:

- iconos por paso; y
- un isotipo circular junto al bloque bancario.

Reglas para esta iteracion:

- reusar iconografia ya disponible en la app/style-guide para los pasos;
- si no existe un asset exportable/versionado para el isotipo circular del
  bloque bancario, no rasterizar la captura ni inventar un asset nuevo;
- en ausencia de asset versionado, priorizar el layout y el contenido antes que
  replicar ese isotipo.

### 6.7 CBU y Alias

`picture_16` sugiere una accion visual junto a `CBU` y `Alias`.

Para evitar decisiones arbitrarias, esta SPEC define que en esta primera
iteracion:

- no se implementa copiado al portapapeles;
- no se agregan tooltips, toasts ni estados de copiado;
- si se renderiza un icono junto a esos campos, debe ser decorativo solamente.

---

## 7) Diseno y estilos

- Replicar la composicion general de `docs/assets/picture_16.png`.
- Mantener consistencia con el style-guide de Doppler y con el layout actual de
  `CheckoutSummary`.
- Usar el mismo layout base para `ar`, `mx` y `co`.
- Reusar clases existentes como `dp-wrap-message`, `dp-purchase-summary-list`,
  `dp-rowflex`, grilla y tipografias del style-guide.
- Si se requieren estilos nuevos, scopearlos al bloque de transferencia dentro
  de `src/components/Plans/Checkout/CheckoutSummary/TransferInformation/`.
- Evitar cambios globales salvo que el archivo ya sea el owner natural del
  ajuste.

Lineamientos visuales minimos:

- los pasos deben conservar lectura vertical clara;
- los datos bancarios deben destacarse como bloque dentro del paso 1;
- el email `billing@fromdoppler.com` debe verse como accion reconocible;
- la linea final "Mientras tanto..." debe quedar separada visualmente del paso
  anterior;
- debe funcionar correctamente en desktop y mobile.

---

## 8) Accesibilidad

- Mantener orden semantico correcto de headings.
- El email de envio de comprobante debe ser un link real (`mailto:`) o reutilizar
  el patron accesible ya usado por el proyecto para emails clickeables.
- Los pasos deben estar construidos con markup semantico legible para screen
  readers.
- Los iconos decorativos no deben agregar ruido semantico.

---

## 9) Internacionalizacion

Agregar o ajustar keys en:

- `src/i18n/es.js`
- `src/i18n/en.js`

Reglas:

- no hardcodear copy visible en JSX;
- reutilizar keys actuales si representan exactamente el mismo texto;
- crear keys nuevas bajo `checkoutProcessSuccess` para:
  - intro del paso 1;
  - labels de datos bancarios;
  - labels alternativos por pais, si `mx` o `co` no comparten exactamente los
    mismos campos;
  - texto final de confirmacion si el actual no coincide exactamente;
  - cualquier copy adicional necesario para reflejar `picture_16`.

No es necesario traducir los valores bancarios concretos, pero si los labels e
instrucciones.

---

## 10) Archivos esperados

Como minimo, la implementacion deberia tocar:

- `src/components/Plans/Checkout/CheckoutSummary/TransferInformation/index.js`
- `src/components/Plans/Checkout/CheckoutSummary/CheckoutSummary.js`
  solo si hiciera falta ajustar el contrato del componente
- `src/i18n/es.js`
- `src/i18n/en.js`

Tests sugeridos:

- `src/components/Plans/Checkout/CheckoutSummary/TransferInformation/index.test.js`
  si se crea cobertura focalizada;
- `src/components/Plans/Checkout/CheckoutSummary/CheckoutSummery.test.js`
  para integracion minima.

---

## 11) Contrato de datos

Entradas relevantes ya disponibles:

- `paymentMethod`
- `billingCountry`
- `upgradePending`

Salida esperada:

- render de variante `picture_16` para `TRANSF + upgradePending` cuando
  `billingCountry` sea `ar`, `mx` o `co`;
- render de fallback actual para otros casos de transferencia.

No deben agregarse:

- llamadas nuevas a APIs;
- dependencias nuevas;
- persistencia de estado de UI no necesaria.

---

## 12) Testing

Agregar o actualizar tests para validar, como minimo:

- render del bloque `picture_16` cuando `paymentMethod = TRANSF`,
  `billingCountry = 'ar'` y `upgradePending = true`;
- render del bloque `picture_16` cuando `paymentMethod = TRANSF`,
  `billingCountry = 'mx'` y `upgradePending = true`;
- render del bloque `picture_16` cuando `paymentMethod = TRANSF`,
  `billingCountry = 'co'` y `upgradePending = true`;
- presencia de datos bancarios/instrucciones de Argentina en pantalla;
- presencia de datos bancarios/instrucciones de Mexico en pantalla;
- presencia de datos bancarios/instrucciones de Colombia en pantalla;
- presencia del mail `billing@fromdoppler.com`;
- presencia del mensaje final de confirmacion del pago;
- preservacion del resumen de compra;
- fallback al bloque actual si `billingCountry` no es `ar`, `mx` ni `co`;
- fallback al bloque actual si `upgradePending = false`;
- no regresion para Mercado Pago y tarjeta.

---

## 13) Definition of Done

La tarea se considera completa cuando:

- `CheckoutSummary` muestra la variante de `picture_16` en el escenario
  objetivo;
- los datos de transferencia por pais (`ar`, `mx`, `co`) son visibles y
  legibles;
- el resumen de compra existente no se rompe;
- el fallback de transferencia para escenarios fuera de alcance se mantiene;
- i18n ES/EN queda actualizado;
- los tests relevantes quedan en verde;
- no se introducen regresiones en otros metodos de pago.

---

## 14) Pendientes de detalle funcional

Quedan explicitamente pendientes para futura validacion de producto/diseno:

- confirmar si el isotipo circular del bloque bancario tiene asset exportable;
- confirmar si `CBU` y `Alias` deben tener accion real de copiado;
- confirmar si el caso `TRANSF` con `upgradePending = false` tambien debe
  migrar al layout nuevo o debe conservar el fallback actual.

Dato pendiente obligatorio antes de implementar si no estuviera definido en la
tarea:

- valores exactos de cuenta/instrucciones para Mexico y Colombia.
