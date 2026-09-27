# 🍹 Web_menu - Menú de Bebidas para Reuniones

Aplicación web sencilla e intuitiva construida con **Node.js (Express)** y **React (Vite)** para organizar los pedidos de bebidas en reuniones con amigos.

## 🚀 Características

- **Menú de Bebidas Variado**: Cervezas, cocteles, vinos, sin alcohol y shots con buscador y filtros por categoría.
- **Pedidos por Amigo**: Cada amigo escribe su nombre y realiza su pedido.
- **Soporte para Notas Especiales**: Elige rápidamente preferencias ("Sin hielo", "Doble de ron", "Con limón", etc.) o redacta notas personalizadas.
- **Vista de Pedidos en Vivo**: Muestra en tiempo real qué pidió cada persona.
- **Resumen para el Anfitrión**: Suma automáticamente el total de bebidas a preparar (ej. 4 Cervezas, 2 Mojitos).
- **Personalizable**: Permite agregar nuevas bebidas al menú al instante.
- **Persistencia Ligera**: Guarda los datos en un archivo JSON local en el servidor Node.js sin necesidad de configurar bases de datos externas.

## 🛠️ Cómo ejecutar el proyecto

1. Entra a la carpeta del proyecto:
   ```bash
   cd "C:\Users\Obed villegas\.gemini\antigravity\scratch\Web_menu"
   ```

2. Ejecuta el servidor y la aplicación simultáneamente:
   ```bash
   npm run dev
   ```

3. Abre en tu navegador:
   - Frontend React: `http://localhost:3000`
   - Backend Express API: `http://localhost:5000`

## 📁 Estructura del Proyecto

```text
Web_menu/
├── server/
│   └── index.js      # Backend Express y API de menú/pedidos
├── src/
│   ├── components/   # Componentes React (Menú, Modal de Pedido, Lista de Pedidos)
│   ├── App.jsx       # Lógica principal y conexión con la API
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```
