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

// Menú completo de bebidas preparadas
const initialMenu = [
  // TEQUILA
  {
    id: '1',
    name: 'Paloma',
    category: 'Tequila',
    description: 'Paloma Clásica - Jose Cuervo Tradicional + Limón + Squirt',
    badge: 'Popular',
    active: true,
    hasStockLimit: false,
    stock: null
  },
  {
    id: '2',
    name: 'Como la Flor',
    category: 'Tequila',
    description: 'Bebida de Jamaica - Jose Cuervo Tradicional + Licor de Naranja + Limón + Jamaica',
    badge: 'Especial',
    active: true,
    hasStockLimit: false,
    stock: null
  },
  {
    id: '3',
    name: 'Margarita',
    category: 'Tequila',
    description: 'Margarita Clásica - Jose Cuervo Tradicional + Licor de Naranja + Limón Amarillo',
    active: true,
    hasStockLimit: false,
    stock: null
  },
  {
    id: '4',
    name: 'Bandida',
    category: 'Tequila',
    description: 'Paloma Cítrica - 1800 Pepino Jalapeño + Licor de Toronja + Jugo de Toronja + Limón + Squirt',
    badge: 'Picosito',
    active: true,
    hasStockLimit: false,
    stock: null
  },
  {
    id: '5',
    name: 'Tropitangy',
    category: 'Tequila',
    description: 'Bebida de Naranja con Tamarindo - Gran Malo Tamarindo + Licor de Naranja + Jugo de Naranja + Jumex de Piña + Limón',
    active: true,
    hasStockLimit: false,
    stock: null
  },
  {
    id: '6',
    name: 'Picafiestas',
    category: 'Tequila',
    description: 'Bebida de PicaFresa - Jose Cuervo Fresa Picosa + Monster de Fresa + Limón',
    active: true,
    hasStockLimit: false,
    stock: null
  },

  // MEZCAL
  {
    id: '7',
    name: 'Como la Flor Mezcal',
    category: 'Mezcal',
    description: 'Bebida de Jamaica - Mezcal Montelobos + Licor de Naranja + Limón + Jamaica',
    badge: 'Artesanal',
    active: true,
    hasStockLimit: false,
    stock: null
  },

  // WHISKEY
  {
    id: '8',
    name: 'Piñática',
    category: 'Whiskey',
    description: "Bebida de Piña con Toque de Mango - Buchanan's de Piña + Monster de Mango + Limón + Peñafiel de Piña",
    badge: 'Top Fiesta',
    active: true,
    hasStockLimit: false,
    stock: null
  },

  // VODKA
  {
    id: '9',
    name: 'Cosmopolitan',
    category: 'Vodka',
    description: 'Martini de Arándano - Oso Negro + Licor de Naranja + Limón + Jugo de Arándano',
    active: true,
    hasStockLimit: false,
    stock: null
  },
  {
    id: '10',
    name: 'Tamaloco',
    category: 'Vodka',
    description: 'Bebida de Mango con Tamarindo - Smirnoff Tamarindo + Licor de Mango + Monster de Mango + Limón + Peñafiel de Piña',
    badge: 'Recomendado',
    active: true,
    hasStockLimit: false,
    stock: null
  },
  {
    id: '11',
    name: 'Chamoy & Chill',
    category: 'Vodka',
    description: 'Bebida de Sandía con Chamoy - Stoli Chamoy + Jarabe de Sandía + Limón Amarillo + Granadina',
    active: true,
    hasStockLimit: false,
    stock: null
  },

  // GINEBRA
  {
    id: '12',
    name: 'Emperatriz',
    category: 'Ginebra',
    description: 'Paloma de Tres Licores - Empress 1908 Indigo + Licor de Toronja + Mezcal Montelobos + Limón + Squirt',
    badge: 'Premium',
    active: true,
    hasStockLimit: false,
    stock: null
  },
  {
    id: '13',
    name: 'Gin-Lichi',
    category: 'Ginebra',
    description: 'Martini de Lichi - Empress 1908 Indigo + Limón + Jugo de Lichi + Crema de Lichi',
    active: true,
    hasStockLimit: false,
    stock: null
  },

  // RON
  {
    id: '14',
    name: 'Piña Colada',
    category: 'Ron',
    description: 'Piña Colada Clásica - Don Q + Crema de Coco + Limón + Jugo de Piña',
    active: true,
    hasStockLimit: false,
    stock: null
  },
  {
    id: '15',
    name: 'Mojito Clásico',
    category: 'Ron',
    description: 'Mojito de Mango o Sandía - Don Q + Jarabe de Mango/Sandía + Limón + Menta',
    badge: 'Refrescante',
    active: true,
    hasStockLimit: false,
    stock: null
  },
  {
    id: '16',
    name: 'Blue Hawaian',
    category: 'Ron',
    description: 'Variante de Piña Colada - Don Q + Crema de Coco + Limón + Jugo de Piña + Blue Curacao',
    active: true,
    hasStockLimit: false,
    stock: null
  }
];

// Insumos y botellas extra que el bartender agrega al inventario libre
const initialSupplies = [
  { id: 's1', name: 'Jose Cuervo Tradicional', category: 'Licores', quantity: '3 Botellas', active: true },
  { id: 's2', name: 'Mezcal Montelobos', category: 'Licores', quantity: '2 Botellas', active: true },
  { id: 's3', name: "Buchanan's de Piña", category: 'Licores', quantity: '2 Botellas', active: true },
  { id: 's4', name: 'Refresco Squirt', category: 'Mezcladores', quantity: '12 Latas', active: true },
  { id: 's5', name: 'Hielo Picado', category: 'Complementos', quantity: '3 Bolsas', active: true }
];

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = { menu: initialMenu, orders: [], supplies: initialSupplies };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    if (!parsed.menu || !Array.isArray(parsed.menu) || parsed.menu.length === 0) {
      parsed.menu = initialMenu;
    }
    if (!parsed.orders) {
      parsed.orders = [];
    }
    if (!parsed.supplies) {
      parsed.supplies = initialSupplies;
    }

    let updated = false;
    parsed.menu.forEach(drink => {
      if (drink.active === undefined) {
        drink.active = true;
        updated = true;
      }
      if (drink.hasStockLimit === undefined) {
        drink.hasStockLimit = false;
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2));
    }

    return parsed;
  } catch (err) {
    console.error('Error leyendo data.json, reseteando:', err);
    const fallback = { menu: initialMenu, orders: [], supplies: initialSupplies };
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

// Obtener insumos extra de la barra
app.get('/api/supplies', (req, res) => {
  const data = loadData();
  res.json(data.supplies || []);
});

// Agregar insumo/botella extra (Bartender)
app.post('/api/supplies', (req, res) => {
  const { name, category, quantity, adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de bartender incorrecta.' });
  }

  if (!name) {
    return res.status(400).json({ error: 'El nombre del insumo o botella es obligatorio.' });
  }

  const data = loadData();
  const newSupply = {
    id: 's_' + Date.now(),
    name: name.trim(),
    category: category || 'Licores',
    quantity: quantity || 'Disponible',
    active: true
  };

  if (!data.supplies) data.supplies = [];
  data.supplies.unshift(newSupply);
  saveData(data);
  res.status(201).json(newSupply);
});

// Actualizar / Toggle Insumo Extra (Bartender)
app.put('/api/supplies/:id', (req, res) => {
  const { id } = req.params;
  const { quantity, active, adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de bartender incorrecta.' });
  }

  const data = loadData();
  const supply = (data.supplies || []).find(s => s.id === id);

  if (!supply) {
    return res.status(404).json({ error: 'Insumo no encontrado.' });
  }

  if (quantity !== undefined) supply.quantity = quantity;
  if (active !== undefined) supply.active = active;

  saveData(data);
  res.json({ success: true, supply });
});

// Eliminar Insumo Extra (Bartender)
app.delete('/api/supplies/:id', (req, res) => {
  const { id } = req.params;
  const adminPassword = req.headers['x-admin-password'] || req.body.adminPassword || req.query.adminPassword;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de bartender incorrecta.' });
  }

  const data = loadData();
  data.supplies = (data.supplies || []).filter(s => s.id !== id);
  saveData(data);
  res.json({ success: true, message: 'Insumo eliminado.' });
});

// Activar / Desactivar Bebida (Bartender)
app.put('/api/menu/:id/toggle', (req, res) => {
  const { id } = req.params;
  const { adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de bartender incorrecta.' });
  }

  const data = loadData();
  const drink = data.menu.find(d => d.id === id);

  if (!drink) {
    return res.status(404).json({ error: 'Bebida no encontrada.' });
  }

  drink.active = !drink.active;
  saveData(data);
  res.json({ success: true, drink });
});

// Modificar Límite de Stock de una Bebida (Bartender)
app.put('/api/menu/:id/stock', (req, res) => {
  const { id } = req.params;
  const { hasStockLimit, stock, adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de bartender incorrecta.' });
  }

  const data = loadData();
  const drink = data.menu.find(d => d.id === id);

  if (!drink) {
    return res.status(404).json({ error: 'Bebida no encontrada.' });
  }

  if (hasStockLimit !== undefined) {
    drink.hasStockLimit = !!hasStockLimit;
    if (!drink.hasStockLimit) {
      drink.stock = null;
    } else if (drink.stock === null || drink.stock === undefined) {
      drink.stock = 10;
    }
  }

  if (typeof stock === 'number') {
    drink.stock = Math.max(0, stock);
    drink.hasStockLimit = true;
  }

  saveData(data);
  res.json({ success: true, drink });
});

// Restablecer Inventario (Todas activas, sin límite de número por defecto)
app.post('/api/menu/reset-inventory', (req, res) => {
  const { adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de bartender incorrecta.' });
  }

  const data = loadData();
  data.menu.forEach(drink => {
    drink.active = true;
    drink.hasStockLimit = false;
    drink.stock = null;
  });

  saveData(data);
  res.json({ success: true, menu: data.menu });
});

// Agregar nueva bebida al menú (Bartender)
app.post('/api/menu', (req, res) => {
  const { name, category, description, adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de administrador incorrecta.' });
  }

  if (!name) {
    return res.status(400).json({ error: 'El nombre de la bebida es obligatorio.' });
  }

  const data = loadData();
  const newItem = {
    id: Date.now().toString(),
    name: name.trim(),
    category: category || 'Variados',
    description: description ? description.trim() : '',
    active: true,
    hasStockLimit: false,
    stock: null
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
  const { friendName, drinkName, notes, isTemporary } = req.body;

  if (!friendName || !drinkName) {
    return res.status(400).json({ error: 'Debes proporcionar tu nombre y la bebida.' });
  }

  const data = loadData();

  if (!isTemporary) {
    const drink = data.menu.find(d => d.name.toLowerCase() === drinkName.trim().toLowerCase());
    if (drink) {
      if (!drink.active) {
        return res.status(400).json({ error: `La bebida "${drink.name}" no está disponible en este momento.` });
      }
      if (drink.hasStockLimit && typeof drink.stock === 'number') {
        if (drink.stock <= 0) {
          return res.status(400).json({ error: `La bebida "${drink.name}" se ha AGOTADO.` });
        }
        drink.stock -= 1;
      }
    }
  }

  const newOrder = {
    id: Date.now().toString(),
    friendName: friendName.trim(),
    drinkName: drinkName.trim(),
    notes: notes ? notes.trim() : '',
    isTemporary: !!isTemporary,
    createdAt: new Date().toISOString()
  };

  data.orders.push(newOrder);
  saveData(data);
  res.status(201).json(newOrder);
});

// Eliminar pedido
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const adminPassword = req.headers['x-admin-password'] || req.body.adminPassword || req.query.adminPassword;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de bartender incorrecta.' });
  }

  const data = loadData();
  data.orders = data.orders.filter(o => o.id !== id);
  saveData(data);
  res.json({ success: true, message: 'Pedido eliminado.' });
});

// Reiniciar todos los pedidos
app.delete('/api/orders', (req, res) => {
  const adminPassword = req.headers['x-admin-password'] || req.body.adminPassword || req.query.adminPassword;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de bartender incorrecta.' });
  }

  const data = loadData();
  data.orders = [];
  saveData(data);
  res.json({ success: true, message: 'Todos los pedidos han sido borrados.' });
});

// Servir React dist folder
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
