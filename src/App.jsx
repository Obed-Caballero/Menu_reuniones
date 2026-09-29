import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MenuSection from './components/MenuSection';
import OrdersList from './components/OrdersList';
import OrderModal from './components/OrderModal';
import AddDrinkModal from './components/AddDrinkModal';
import TempDrinkModal from './components/TempDrinkModal';
import StockModal from './components/StockModal';
import { Wine } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('menu');
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [isAddDrinkOpen, setIsAddDrinkOpen] = useState(false);
  const [isTempDrinkOpen, setIsTempDrinkOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar menú y pedidos
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
      await Promise.all([fetchMenu(), fetchOrders()]);
      setLoading(false);
    };
    init();

    // Polling en tiempo real cada 3 segundos
    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Crear Pedido (Descuenta stock si pertenece al menú)
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

  // Actualizar Inventario/Stock en Lote (Protegido por Contraseña Admin)
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

  // Eliminar Pedido Individual (Protegido por Contraseña de Bartender)
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

  // Borrar Todos los Pedidos (Protegido por Contraseña de Bartender)
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
        onOpenStock={() => setIsStockOpen(true)}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Wine className="w-12 h-12 text-gold-400 animate-bounce mb-3" />
            <p className="font-cinzel text-xs font-bold text-gold-300 tracking-widest uppercase">
              Cargando Carta de Meetings German...
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
        ) : (
          <OrdersList
            orders={orders}
            onDeleteOrder={handleDeleteOrder}
            onClearAllOrders={handleClearAllOrders}
            onGoToMenu={() => setActiveTab('menu')}
          />
        )}
      </main>

      {/* Modal para Hacer Pedido de Carta */}
      {selectedDrink && (
        <OrderModal
          drink={selectedDrink}
          onClose={() => setSelectedDrink(null)}
          onSubmitOrder={handleCreateOrder}
        />
      )}

      {/* Modal para Pedir Bebida Temporal / Fuera de Carta */}
      {isTempDrinkOpen && (
        <TempDrinkModal
          onClose={() => setIsTempDrinkOpen(false)}
          onSubmitTempOrder={handleCreateOrder}
        />
      )}

      {/* Modal para Agregar Nueva Bebida Permanente (Con Contraseña) */}
      {isAddDrinkOpen && (
        <AddDrinkModal
          onClose={() => setIsAddDrinkOpen(false)}
          onAddDrink={handleAddDrink}
        />
      )}

      {/* Modal para Gestionar Inventario/Stock (Con Contraseña) */}
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
