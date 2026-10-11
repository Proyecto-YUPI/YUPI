# YUPI IA

Landing responsive en español con React, Vite, Tailwind CSS v4, Lucide React y Motion. Mascota robótica original construida con CSS, sin imágenes externas.

## Inicio local

```powershell
npm.cmd install
npm.cmd run dev
```

Abre la dirección que imprime Vite (normalmente http://127.0.0.1:5173).

```powershell
npm.cmd run build
npm.cmd test
npm.cmd run preview
```

En Windows se usa `npm.cmd` para evitar restricciones sobre scripts PowerShell.

## Demostración

Selecciona ferretería, farmacia, restaurante o tienda. Selecciona un producto en el panel; consulta disponibilidad o precio, ingresa una cantidad y prepara un pedido. Confirmarlo descuenta existencias y actualiza los totales de sesión. Las alertas incluyen productos agotados y productos con tres unidades o menos. Puedes consultar un reporte, simular atención humana y reiniciar la demo. Cambiar de rubro reinicia la sesión.

El chat es una simulación programada, sin IA ni conexiones reales. Los precios son ejemplos en bolivianos. No hay pagos, mensajes de WhatsApp, base de datos ni persistencia entre recargas. El formulario valida los datos y descarga una solicitud TXT local; no la envía. Los planes son propuestas de alcance sin tarifas publicadas.

## Archivos

- `src/main.jsx`: componentes y secciones de la landing, demo y formulario.
- `src/styles.css`: identidad visual, búho con volumen CSS, responsive y movimiento reducido.
- `src/demo.js`: catálogos y validación/transacción de pedidos.
- `src/demo.test.js`: pruebas de stock, totales y prevención de sobreventa.
- `vite.config.js`: plugins React y Tailwind.
- `index.html`: metadatos y entrada de la aplicación.

La fuente Plus Jakarta Sans se carga desde Google Fonts con Arial como alternativa. Antes de una publicación comercial, define el canal de contacto, tarifas, políticas y las integraciones reales.
