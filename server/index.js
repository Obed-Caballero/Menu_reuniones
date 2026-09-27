import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.use(cors());
app.use(express.json());

// Menú completo extraído del Bar Menu oficial
const initialMenu = [
  // TEQUILA
  {
    id: '1',
    name: 'Paloma',
    category: 'Tequila',
    description: 'Paloma Clásica - Jose Cuervo Tradicional + Limón + Squirt',
    badge: 'Popular'
  },
  {
    id: '2',
    name: 'Como la Flor',
    category: 'Tequila',
    description: 'Bebida de Jamaica - Jose Cuervo Tradicional + Licor de Naranja + Limón + Jamaica',
    badge: 'Especial'
  },
  {
    id: '3',
    name: 'Margarita',
    category: 'Tequila',
    description: 'Margarita Clásica - Jose Cuervo Tradicional + Licor de Naranja + Limón Amarillo'
  },
  {
    id: '4',
    name: 'Bandida',
    category: 'Tequila',
    description: 'Paloma Cítrica - 1800 Pepino Jalapeño + Licor de Toronja + Jugo de Toronja + Limón + Squirt',
    badge: 'Picosito'
  },
  {
    id: '5',
    name: 'Tropitangy',
    category: 'Tequila',
    description: 'Bebida de Naranja con Tamarindo - Gran Malo Tamarindo + Licor de Naranja + Jugo de Naranja + Jumex de Piña + Limón'
  },
  {
    id: '6',
    name: 'Picafiestas',
    category: 'Tequila',
    description: 'Bebida de PicaFresa - Jose Cuervo Fresa Picosa + Monster de Fresa + Limón'
  },

  // MEZCAL
  {
    id: '7',
    name: 'Como la Flor Mezcal',
    category: 'Mezcal',
    description: 'Bebida de Jamaica - Mezcal Montelobos + Licor de Naranja + Limón + Jamaica',
    badge: 'Artesanal'
  },

  // WHISKEY
  {
    id: '8',
    name: 'Piñática',
    category: 'Whiskey',
    description: "Bebida de Piña con Toque de Mango - Buchanan's de Piña + Monster de Mango + Limón + Peñafiel de Piña",
    badge: 'Top Fiesta'
  },

  // VODKA
  {
    id: '9',
    name: 'Cosmopolitan',
    category: 'Vodka',
    description: 'Martini de Arándano - Oso Negro + Licor de Naranja + Limón + Jugo de Arándano'
  },
  {
    id: '10',
    name: 'Tamaloco',
    category: 'Vodka',
    description: 'Bebida de Mango con Tamarindo - Smirnoff Tamarindo + Licor de Mango + Monster de Mango + Limón + Peñafiel de Piña',
    badge: 'Recomendado'
  },
  {
    id: '11',
    name: 'Chamoy & Chill',
    category: 'Vodka',
    description: 'Bebida de Sandía con Chamoy - Stoli Chamoy + Jarabe de Sandía + Limón Amarillo + Granadina'
  },

  // GINEBRA
  {
    id: '12',
    name: 'Emperatriz',
    category: 'Ginebra',
    description: 'Paloma de Tres Licores - Empress 1908 Indigo + Licor de Toronja + Mezcal Montelobos + Limón + Squirt',
    badge: 'Premium'
  },
  {
    id: '13',
    name: 'Gin-Lichi',
    category: 'Ginebra',
    description: 'Martini de Lichi - Empress 1908 Indigo + Limón + Jugo de Lichi + Crema de Lichi'
  },

  // RON
  {
    id: '14',
    name: 'Piña Colada',
    category: 'Ron',
    description: 'Piña Colada Clásica - Don Q + Crema de Coco + Limón + Jugo de Piña'
  },
  {
    id: '15',
    name: 'Mojito Clásico',
    category: 'Ron',
    description: 'Mojito de Mango o Sandía - Don Q + Jarabe de Mango/Sandía + Limón + Menta',
    badge: 'Refrescante'
  },
  {
    id: '16',
    name: 'Blue Hawaian',
    category: 'Ron',
    description: 'Variante de Piña Colada - Don Q + Crema de Coco + Limón + Jugo de Piña + Blue Curacao'
  }
];

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = { menu: initialMenu, orders: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Si la lista de menú está vacía o dañada, restaurar el menú original completo automáticamente
    if (!parsed.menu || !Array.isArray(parsed.menu) || parsed.menu.length === 0) {
      parsed.menu = initialMenu;
      fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2));
    }
    
    return parsed;
  } catch (err) {
    console.error('Error leyendo data.json, reseteando:', err);
    const fallback = { menu: initialMenu, orders: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error guardando en data.json:', err);
  }
}

// Routes API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Obtener menú
app.get('/api/menu', (req, res) => {
  const data = loadData();
  res.json(data.menu);
});

// Restaurar menú original a los 16 cócteles iniciales
app.post('/api/menu/reset', (req, res) => {
  const data = loadData();
  data.menu = initialMenu;
  saveData(data);
  res.json({ success: true, menu: initialMenu });
});

// Agregar nueva bebida al menú (Protegido por Contraseña)
app.post('/api/menu', (req, res) => {
  const { name, category, description, adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de administrador incorrecta. Solo German puede agregar bebidas.' });
  }

  if (!name) {
    return res.status(400).json({ error: 'El nombre de la bebida es obligatorio.' });
  }

  const data = loadData();
  const newItem = {
    id: Date.now().toString(),
    name,
    category: category || 'Variados',
    description: description || ''
  };

  data.menu.push(newItem);
  saveData(data);
  res.status(201).json(newItem);
});

// Obtener pedidos
app.get('/api/orders', (req, res) => {
  const data = loadData();
  res.json(data.orders);
});

// Crear nuevo pedido
app.post('/api/orders', (req, res) => {
  const { friendName, drinkName, notes } = req.body;

  if (!friendName || !drinkName) {
    return res.status(400).json({ error: 'Debes proporcionar tu nombre y la bebida.' });
  }

  const data = loadData();
  const newOrder = {
    id: Date.now().toString(),
    friendName: friendName.trim(),
    drinkName: drinkName.trim(),
    notes: notes ? notes.trim() : '',
    createdAt: new Date().toISOString()
  };

  data.orders.unshift(newOrder);
  saveData(data);
  res.status(201).json(newOrder);
});

// Eliminar un pedido individual (Protegido por Contraseña)
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const adminPassword = req.headers['x-admin-password'] || req.body.adminPassword || req.query.adminPassword;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de bartender incorrecta. Solo German puede marcar pedidos como servidos.' });
  }

  const data = loadData();
  data.orders = data.orders.filter(o => o.id !== id);
  saveData(data);
  res.json({ success: true, message: 'Pedido eliminado.' });
});

// Reiniciar todos los pedidos de la reunión (Protegido por Contraseña)
app.delete('/api/orders', (req, res) => {
  const adminPassword = req.headers['x-admin-password'] || req.body.adminPassword || req.query.adminPassword;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de bartender incorrecta. Solo German puede reiniciar la lista.' });
  }

  const data = loadData();
  data.orders = [];
  saveData(data);
  res.json({ success: true, message: 'Todos los pedidos han sido borrados.' });
});

// Servir frontend compilado de React (dist) en el mismo puerto 5000
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor unificado Node.js + React corriendo en http://0.0.0.0:${PORT}`);
});
