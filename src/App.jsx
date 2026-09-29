import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MenuSection from './components/MenuSection';
import BarInventorySection from './components/BarInventorySection';
import OrdersList from './components/OrdersList';
import OrderModal from './components/OrderModal';
import AddDrinkModal from './components/AddDrinkModal';
import TempDrinkModal from './components/TempDrinkModal';
import StockModal from './components/StockModal';
import AddSupplyModal from './components/AddSupplyModal';
import { Wine } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'inventory' | 'orders'
  const [menu, setMenu] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState(null);
  
  // Modales
  const [isAddDrinkOpen, setIsAddDrinkOpen] = useState(false);
  const [isTempDrinkOpen, setIsTempDrinkOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isAddSupplyOpen, setIsAddSupplyOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar menú, insumos y pedidos
  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setMenu(data);
      }
    } catch (err) {
      console.error('Error cargando menú:', err);
    }
  };

  const fetchSupplies = async () => {
    try {
      const res = await fetch('/api/supplies');
      if (res.ok) {
        const data = await res.json();
        setSupplies(data);
      }
    } catch (err) {
      console.error('Error cargando insumos:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchMenu(), fetchSupplies(), fetchOrders()]);
      setLoading(false);
    };
    init();

    // Polling en tiempo real cada 3 segundos
    const interval = setInterval(() => {
      fetchOrders();
      fetchSupplies();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Crear Pedido
  const handleCreateOrder = async (orderData) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'No se pudo procesar el pedido.');
        return;
      }
      await Promise.all([fetchOrders(), fetchMenu()]);
      setActiveTab('orders');
    } catch (err) {
      console.error('Error enviando pedido:', err);
    }
  };

  // Agregar Bebida al Menú (Protegido por Contraseña)
  const handleAddDrink = async (drinkData) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(drinkData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || 'Error al agregar bebida.' };
      }
      await fetchMenu();
      return { success: true };
    } catch (err) {
      console.error('Error agregando bebida:', err);
      return { error: 'Error de conexión con el servidor.' };
    }
  };

  // Agregar Insumo/Botella a la Barra (Protegido por Admin)
  const handleAddSupply = async (supplyData) => {
    try {
      const res = await fetch('/api/supplies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplyData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || 'Error al agregar insumo.' };
      }
      await fetchSupplies();
      return { success: true };
    } catch (err) {
      console.error('Error agregando insumo:', err);
      return { error: 'Error de conexión con el servidor.' };
    }
  };

  // Actualizar Insumo/Botella (Protegido por Admin)
  const handleUpdateSupply = async (id, quantity, status, adminPassword) => {
    try {
      const res = await fetch(`/api/supplies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity, status, adminPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || 'Error al actualizar insumo.' };
      }
      await fetchSupplies();
      return { success: true };
    } catch (err) {
      console.error('Error actualizando insumo:', err);
      return { error: 'Error de conexión con el servidor.' };
    }
  };

  // Eliminar Insumo (Protegido por Admin)
  const handleDeleteSupply = async (id, adminPassword) => {
    try {
      const res = await fetch(`/api/supplies/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword
        }
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || 'Error al eliminar insumo.' };
      }
      await fetchSupplies();
      return { success: true };
    } catch (err) {
      console.error('Error eliminando insumo:', err);
      return { error: 'Error de conexión con el servidor.' };
    }
  };

  // Actualizar Inventario de Bebidas en Lote
  const handleUpdateStock = async (stocks, adminPassword) => {
    try {
      const res = await fetch('/api/menu/stock/batch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stocks, adminPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || 'Error al actualizar inventario.' };
      }
      await fetchMenu();
      return { success: true };
    } catch (err) {
      console.error('Error actualizando stock:', err);
      return { error: 'Error de conexión con el servidor.' };
    }
  };

  // Eliminar Pedido Individual
  const handleDeleteOrder = async (orderId, adminPassword) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword
        }
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || 'Contraseña de bartender incorrecta.' };
      }
      await fetchOrders();
      return { success: true };
    } catch (err) {
      console.error('Error eliminando pedido:', err);
      return { error: 'Error de conexión con el servidor.' };
    }
  };

  // Borrar Todos los Pedidos
  const handleClearAllOrders = async (adminPassword) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword
        }
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || 'Contraseña de bartender incorrecta.' };
      }
      await fetchOrders();
      return { success: true };
    } catch (err) {
      console.error('Error borrando pedidos:', err);
      return { error: 'Error de conexión con el servidor.' };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-gold-100">
      
      {/* Barra de Navegación Superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ordersCount={orders.length}
        onOpenAddDrink={() => setIsAddDrinkOpen(true)}
        onOpenTempDrink={() => setIsTempDrinkOpen(true)}
        onOpenAddSupply={() => setIsAddSupplyOpen(true)}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Wine className="w-12 h-12 text-gold-400 animate-bounce mb-3" />
            <p className="font-cinzel text-xs font-bold text-gold-300 tracking-widest uppercase">
              Cargando Carta & Inventario de Meetings German...
            </p>
          </div>
        ) : activeTab === 'menu' ? (
          <MenuSection
            menu={menu}
            orders={orders}
            onSelectDrink={(drink) => setSelectedDrink(drink)}
            onOpenAddDrink={() => setIsAddDrinkOpen(true)}
            onOpenTempDrink={() => setIsTempDrinkOpen(true)}
            onOpenStock={() => setIsStockOpen(true)}
          />
        ) : activeTab === 'inventory' ? (
          <BarInventorySection
            supplies={supplies}
            onOpenAddSupply={() => setIsAddSupplyOpen(true)}
            onUpdateSupply={handleUpdateSupply}
            onDeleteSupply={handleDeleteSupply}
          />
        ) : (
          <OrdersList
            orders={orders}
            onDeleteOrder={handleDeleteOrder}
            onClearAllOrders={handleClearAllOrders}
            onGoToMenu={() => setActiveTab('menu')}
          />
        )}
      </main>

      {/* Modales */}
      {selectedDrink && (
        <OrderModal
          drink={selectedDrink}
          onClose={() => setSelectedDrink(null)}
          onSubmitOrder={handleCreateOrder}
        />
      )}

      {isTempDrinkOpen && (
        <TempDrinkModal
          onClose={() => setIsTempDrinkOpen(false)}
          onSubmitTempOrder={handleCreateOrder}
        />
      )}

      {isAddDrinkOpen && (
        <AddDrinkModal
          onClose={() => setIsAddDrinkOpen(false)}
          onAddDrink={handleAddDrink}
        />
      )}

      {isAddSupplyOpen && (
        <AddSupplyModal
          onClose={() => setIsAddSupplyOpen(false)}
          onAddSupply={handleAddSupply}
        />
      )}

      {isStockOpen && (
        <StockModal
          menu={menu}
          onClose={() => setIsStockOpen(false)}
          onUpdateStock={handleUpdateStock}
        />
      )}

      {/* Footer elegante */}
      <footer className="border-t border-gold-500/20 bg-black py-6 text-center text-xs text-gold-400/60 font-cinzel tracking-widest">
        MEETINGS GERMAN &bull; MENÚ DE LA CASA & REUNIONES
      </footer>

    </div>
  );
}
