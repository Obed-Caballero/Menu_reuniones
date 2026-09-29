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

// Menú de bebidas preparadas
const initialMenu = [
  // TEQUILA
  {
    id: '1',
    name: 'Paloma',
    category: 'Tequila',
    description: 'Paloma Clásica - Jose Cuervo Tradicional + Limón + Squirt',
    badge: 'Popular',
    stock: 10
  },
  {
    id: '2',
    name: 'Como la Flor',
    category: 'Tequila',
    description: 'Bebida de Jamaica - Jose Cuervo Tradicional + Licor de Naranja + Limón + Jamaica',
    badge: 'Especial',
    stock: 10
  },
  {
    id: '3',
    name: 'Margarita',
    category: 'Tequila',
    description: 'Margarita Clásica - Jose Cuervo Tradicional + Licor de Naranja + Limón Amarillo',
    stock: 10
  },
  {
    id: '4',
    name: 'Bandida',
    category: 'Tequila',
    description: 'Paloma Cítrica - 1800 Pepino Jalapeño + Licor de Toronja + Jugo de Toronja + Limón + Squirt',
    badge: 'Picosito',
    stock: 10
  },
  {
    id: '5',
    name: 'Tropitangy',
    category: 'Tequila',
    description: 'Bebida de Naranja con Tamarindo - Gran Malo Tamarindo + Licor de Naranja + Jugo de Naranja + Jumex de Piña + Limón',
    stock: 10
  },
  {
    id: '6',
    name: 'Picafiestas',
    category: 'Tequila',
    description: 'Bebida de PicaFresa - Jose Cuervo Fresa Picosa + Monster de Fresa + Limón',
    stock: 10
  },

  // MEZCAL
  {
    id: '7',
    name: 'Como la Flor Mezcal',
    category: 'Mezcal',
    description: 'Bebida de Jamaica - Mezcal Montelobos + Licor de Naranja + Limón + Jamaica',
    badge: 'Artesanal',
    stock: 10
  },

  // WHISKEY
  {
    id: '8',
    name: 'Piñática',
    category: 'Whiskey',
    description: "Bebida de Piña con Toque de Mango - Buchanan's de Piña + Monster de Mango + Limón + Peñafiel de Piña",
    badge: 'Top Fiesta',
    stock: 10
  },

  // VODKA
  {
    id: '9',
    name: 'Cosmopolitan',
    category: 'Vodka',
    description: 'Martini de Arándano - Oso Negro + Licor de Naranja + Limón + Jugo de Arándano',
    stock: 10
  },
  {
    id: '10',
    name: 'Tamaloco',
    category: 'Vodka',
    description: 'Bebida de Mango con Tamarindo - Smirnoff Tamarindo + Licor de Mango + Monster de Mango + Limón + Peñafiel de Piña',
    badge: 'Recomendado',
    stock: 10
  },
  {
    id: '11',
    name: 'Chamoy & Chill',
    category: 'Vodka',
    description: 'Bebida de Sandía con Chamoy - Stoli Chamoy + Jarabe de Sandía + Limón Amarillo + Granadina',
    stock: 10
  },

  // GINEBRA
  {
    id: '12',
    name: 'Emperatriz',
    category: 'Ginebra',
    description: 'Paloma de Tres Licores - Empress 1908 Indigo + Licor de Toronja + Mezcal Montelobos + Limón + Squirt',
    badge: 'Premium',
    stock: 10
  },
  {
    id: '13',
    name: 'Gin-Lichi',
    category: 'Ginebra',
    description: 'Martini de Lichi - Empress 1908 Indigo + Limón + Jugo de Lichi + Crema de Lichi',
    stock: 10
  },

  // RON
  {
    id: '14',
    name: 'Piña Colada',
    category: 'Ron',
    description: 'Piña Colada Clásica - Don Q + Crema de Coco + Limón + Jugo de Piña',
    stock: 10
  },
  {
    id: '15',
    name: 'Mojito Clásico',
    category: 'Ron',
    description: 'Mojito de Mango o Sandía - Don Q + Jarabe de Mango/Sandía + Limón + Menta',
    badge: 'Refrescante',
    stock: 10
  },
  {
    id: '16',
    name: 'Blue Hawaian',
    category: 'Ron',
    description: 'Variante de Piña Colada - Don Q + Crema de Coco + Limón + Jugo de Piña + Blue Curacao',
    stock: 10
  }
];

// Inventario de Insumos y Botellas de la Barra de German
const initialSupplies = [
  // LICORES Y BOTELLAS
  { id: 's1', name: 'Jose Cuervo Tradicional', category: 'Licores', quantity: '3 Botellas', status: 'Disponible' },
  { id: 's2', name: 'Mezcal Montelobos', category: 'Licores', quantity: '2 Botellas', status: 'Disponible' },
  { id: 's3', name: "Buchanan's de Piña", category: 'Licores', quantity: '2 Botellas', status: 'Disponible' },
  { id: 's4', name: 'Smirnoff Tamarindo', category: 'Licores', quantity: '2 Botellas', status: 'Disponible' },
  { id: 's5', name: 'Don Q Ron Blanco', category: 'Licores', quantity: '2 Botellas', status: 'Disponible' },
  { id: 's6', name: 'Empress 1908 Indigo Gin', category: 'Licores', quantity: '1 Botella', status: 'Poco' },
  { id: 's7', name: 'Jose Cuervo Fresa Picosa', category: 'Licores', quantity: '1 Botella', status: 'Disponible' },
  { id: 's8', name: 'Licor de Naranja / Toronja', category: 'Licores', quantity: '2 Botellas', status: 'Disponible' },

  // MEZCLADORES Y REFRESCOS
  { id: 's9', name: 'Refresco Squirt', category: 'Mezcladores', quantity: '12 Latas', status: 'Disponible' },
  { id: 's10', name: 'Peñafiel de Piña', category: 'Mezcladores', quantity: '8 Botellas', status: 'Disponible' },
  { id: 's11', name: 'Monster Mango / Fresa', category: 'Mezcladores', quantity: '6 Latas', status: 'Poco' },
  { id: 's12', name: 'Agua Mineral / Soda', category: 'Mezcladores', quantity: '10 Botellas', status: 'Disponible' },

  // JUGOS Y FRUTAS
  { id: 's13', name: 'Limón Fresco', category: 'Jugos & Frutas', quantity: '3 kg', status: 'Disponible' },
  { id: 's14', name: 'Jugo de Piña & Naranja', category: 'Jugos & Frutas', quantity: '4 Litros', status: 'Disponible' },
  { id: 's15', name: 'Jugo de Arándano & Lichi', category: 'Jugos & Frutas', quantity: '2 Litros', status: 'Disponible' },
  { id: 's16', name: 'Agua de Jamaica Concentrada', category: 'Jugos & Frutas', quantity: '2 Litros', status: 'Disponible' },

  // COMPLEMENTOS E INSUMOS
  { id: 's17', name: 'Chamoy & Jarabe de Sandía', category: 'Complementos', quantity: '2 Frascos', status: 'Disponible' },
  { id: 's18', name: 'Crema de Coco', category: 'Complementos', quantity: '3 Latas', status: 'Disponible' },
  { id: 's19', name: 'Hielo Picado / Bolsas', category: 'Complementos', quantity: '3 Bolsas', status: 'Disponible' },
  { id: 's20', name: 'Menta / Hierbabuena Fresca', category: 'Complementos', quantity: '1 Manojo', status: 'Disponible' }
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
    if (!parsed.supplies || !Array.isArray(parsed.supplies) || parsed.supplies.length === 0) {
      parsed.supplies = initialSupplies;
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

// Obtener Insumos y Botellas de la Barra
app.get('/api/supplies', (req, res) => {
  const data = loadData();
  res.json(data.supplies || []);
});

// Agregar Insumo/Botella al Inventario de la Barra (Protegido por Admin)
app.post('/api/supplies', (req, res) => {
  const { name, category, quantity, status, adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de administrador incorrecta.' });
  }

  if (!name) {
    return res.status(400).json({ error: 'El nombre del insumo o botella es obligatorio.' });
  }

  const data = loadData();
  const newSupply = {
    id: 's_' + Date.now(),
    name: name.trim(),
    category: category || 'Licores',
    quantity: quantity || '1 Unidad',
    status: status || 'Disponible'
  };

  if (!data.supplies) data.supplies = [];
  data.supplies.unshift(newSupply);
  saveData(data);
  res.status(201).json(newSupply);
});

// Actualizar Insumo/Botella (Protegido por Admin)
app.put('/api/supplies/:id', (req, res) => {
  const { id } = req.params;
  const { quantity, status, adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de administrador incorrecta.' });
  }

  const data = loadData();
  const supply = (data.supplies || []).find(s => s.id === id);
  if (!supply) {
    return res.status(404).json({ error: 'Insumo no encontrado.' });
  }

  if (quantity !== undefined) supply.quantity = quantity;
  if (status !== undefined) supply.status = status;

  saveData(data);
  res.json({ success: true, supply });
});

// Eliminar Insumo (Protegido por Admin)
app.delete('/api/supplies/:id', (req, res) => {
  const { id } = req.params;
  const adminPassword = req.headers['x-admin-password'] || req.body.adminPassword || req.query.adminPassword;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de administrador incorrecta.' });
  }

  const data = loadData();
  data.supplies = (data.supplies || []).filter(s => s.id !== id);
  saveData(data);
  res.json({ success: true, message: 'Insumo eliminado.' });
});

// Restaurar menú original
app.post('/api/menu/reset', (req, res) => {
  const data = loadData();
  data.menu = initialMenu;
  data.supplies = initialSupplies;
  saveData(data);
  res.json({ success: true, menu: initialMenu, supplies: initialSupplies });
});

// Agregar nueva bebida al menú (Protegido por Contraseña)
app.post('/api/menu', (req, res) => {
  const { name, category, description, stock, adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de administrador incorrecta.' });
  }

  if (!name) {
    return res.status(400).json({ error: 'El nombre de la bebida es obligatorio.' });
  }

  const data = loadData();
  const newItem = {
    id: Date.now().toString(),
    name,
    category: category || 'Variados',
    description: description || '',
    stock: typeof stock === 'number' ? stock : 10
  };

  data.menu.push(newItem);
  saveData(data);
  res.status(201).json(newItem);
});

// Modificar Inventario/Stock de una bebida
app.put('/api/menu/:id/stock', (req, res) => {
  const { id } = req.params;
  const { stock, adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de administrador incorrecta.' });
  }

  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: 'Ingresa una cantidad válida.' });
  }

  const data = loadData();
  const drink = data.menu.find(d => d.id === id);
  if (!drink) {
    return res.status(404).json({ error: 'Bebida no encontrada.' });
  }

  drink.stock = stock;
  saveData(data);
  res.json({ success: true, drink });
});

// Actualizar inventario en lote
app.put('/api/menu/stock/batch', (req, res) => {
  const { stocks, adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña de administrador incorrecta.' });
  }

  const data = loadData();
  data.menu.forEach(drink => {
    if (stocks && typeof stocks[drink.id] === 'number') {
      drink.stock = Math.max(0, stocks[drink.id]);
    }
  });

  saveData(data);
  res.json({ success: true, menu: data.menu });
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
      if (drink.stock <= 0) {
        return res.status(400).json({ error: `La bebida "${drink.name}" está AGOTADA en el inventario.` });
      }
      drink.stock -= 1;
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

  data.orders.unshift(newOrder);
  saveData(data);
  res.status(201).json(newOrder);
});

// Eliminar un pedido individual
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

// Reiniciar todos los pedidos de la reunión
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

// Servir frontend compilado de React (dist)
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
