import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Plus, Minus, RotateCcw, ShieldAlert, Power, PackagePlus, Trash2, Hash } from 'lucide-react';

export default function BartenderTab({
  menu,
  supplies,
  onToggleDrink,
  onUpdateStock,
  onResetInventory,
  onAddSupply,
  onUpdateSupply,
  onDeleteSupply
}) {
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  // Estado formulario agregar insumo extra
  const [newSupplyName, setNewSupplyName] = useState('');
  const [newSupplyCategory, setNewSupplyCategory] = useState('Licores');
  const [newSupplyQuantity, setNewSupplyQuantity] = useState('Disponible');
  const [supplyError, setSupplyError] = useState('');

  useEffect(() => {
    const savedPass = sessionStorage.getItem('admin_password') || sessionStorage.getItem('bartender_pass');
    if (savedPass === 'admin123') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput !== 'admin123') {
      setError('Contraseña de bartender incorrecta. La clave es admin123');
      return;
    }
    sessionStorage.setItem('admin_password', passwordInput);
    sessionStorage.setItem('bartender_pass', passwordInput);
    setIsAuthenticated(true);
    setError('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_password');
    sessionStorage.removeItem('bartender_pass');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const getPass = () => sessionStorage.getItem('admin_password') || 'admin123';

  // Agregar insumo o botella extra que no está en el menú
  const handleAddSupplySubmit = async (e) => {
    e.preventDefault();
    if (!newSupplyName.trim()) {
      setSupplyError('Escribe el nombre de la botella o insumo extra.');
      return;
    }

    const result = await onAddSupply({
      name: newSupplyName.trim(),
      category: newSupplyCategory,
      quantity: newSupplyQuantity.trim() || 'Disponible',
      adminPassword: getPass()
    });

    if (result && result.error) {
      setSupplyError(result.error);
    } else {
      setNewSupplyName('');
      setNewSupplyQuantity('Disponible');
      setSupplyError('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-fadeIn">
        <div className="gold-frame-double rounded-3xl p-6 bg-darkcard space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-cinzel text-xl font-extrabold text-gold-gradient uppercase">
              Acceso Exclusivo Bartender
            </h2>
            <p className="text-xs text-gold-300/70 font-sans">
              Ingresa la contraseña para gestionar el menú, existencias y licores extra de barra.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 font-sans">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1.5 uppercase tracking-wider">
                Contraseña de Administrador *
              </label>
              <input
                type="password"
                placeholder="Ingresa la contraseña"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-black/90 border border-gold-500/40 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400 font-sans"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-600 via-gold-500 to-amber-500 text-slate-950 font-cinzel font-bold text-xs py-3 rounded-xl shadow-lg uppercase tracking-wider hover:opacity-95 transition-all"
            >
              ENTRAR AL PANEL BARTENDER
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Agrupar bebidas del menú por categoría
  const menuCategories = Array.from(new Set(menu.map(d => d.category)));

  return (
    <div className="space-y-10 animate-fadeIn font-sans">
      
      {/* Header Bartender */}
      <div className="gold-frame rounded-3xl p-5 md:p-6 bg-gradient-to-r from-darkcard via-black to-darkcard flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 text-amber-400 p-2.5 rounded-2xl border border-amber-500/40">
            <Unlock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-cinzel text-xl font-extrabold text-gold-gradient uppercase tracking-wider">
              PANEL CONTROL BARTENDER
            </h2>
            <p className="text-xs text-gold-200/70">
              Gestión total del menú, activación/desactivación y botellas/insumos extra.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onResetInventory(getPass())}
            className="flex items-center gap-1.5 bg-black hover:bg-gold-900/40 text-gold-300 border border-gold-500/30 px-3.5 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition-all"
          >
            <RotateCcw className="w-4 h-4 text-gold-400" /> RESTABLECER TODO
          </button>
          <button
            onClick={handleLogout}
            className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 px-3.5 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition-all"
          >
            SALIR DE SESIÓN
          </button>
        </div>
      </div>

      {/* SECCIÓN 1: AGREGAR INSUMOS / BOTELLAS EXTRAS FUERA DEL MENÚ */}
      <div className="gold-frame-double rounded-3xl p-5 md:p-6 bg-darkcard space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gold-500/30 pb-3">
          <PackagePlus className="w-5 h-5 text-gold-400" />
          <div>
            <h3 className="font-cinzel text-base font-extrabold text-gold-gradient uppercase tracking-wider">
              AGREGAR INVENTARIO / BOTELLAS EXTRA EN BARRA
            </h3>
            <p className="text-xs text-gold-200/70">
              Agrega licores, bebidas o insumos especiales que no están en la carta para que los clientes los vean disponibles.
            </p>
          </div>
        </div>

        {/* Formulario rápido insumos extra */}
        <form onSubmit={handleAddSupplySubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-cinzel font-bold text-gold-300 mb-1 uppercase">
              Nombre de la Botella / Insumo *
            </label>
            <input
              type="text"
              placeholder="Ej: Don Julio 70, Monster Energy..."
              value={newSupplyName}
              onChange={(e) => setNewSupplyName(e.target.value)}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-cinzel font-bold text-gold-300 mb-1 uppercase">
              Categoría
            </label>
            <select
              value={newSupplyCategory}
              onChange={(e) => setNewSupplyCategory(e.target.value)}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
            >
              <option value="Licores">Licores / Botellas</option>
              <option value="Mezcladores">Mezcladores / Refrescos</option>
              <option value="Cervezas">Cervezas</option>
              <option value="Complementos">Complementos / Hielo</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-cinzel font-bold text-gold-300 mb-1 uppercase">
              Cantidad / Estado
            </label>
            <input
              type="text"
              placeholder="Ej: 2 Botellas, 12 Latas, Disponible..."
              value={newSupplyQuantity}
              onChange={(e) => setNewSupplyQuantity(e.target.value)}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 font-cinzel font-bold text-xs py-2.5 px-4 rounded-xl shadow flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> AGREGAR A LA BARRA
          </button>
        </form>

        {supplyError && (
          <p className="text-xs text-rose-400 font-sans">{supplyError}</p>
        )}

        {/* Lista de Insumos Extras Existentes */}
        {supplies && supplies.length > 0 && (
          <div className="pt-3 border-t border-gold-500/20">
            <h4 className="text-xs font-cinzel font-bold text-gold-400 uppercase tracking-wider mb-2">
              Inventario Extra Actual en Barra:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {supplies.map((sup) => (
                <div
                  key={sup.id}
                  className="bg-black/80 border border-gold-500/20 p-2.5 rounded-xl flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-gold-100 block">{sup.name}</span>
                    <span className="text-[10px] text-gold-400/70 font-mono block">
                      {sup.category} &bull; {sup.quantity}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateSupply(sup.id, { active: !sup.active, adminPassword: getPass() })}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        sup.active !== false
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {sup.active !== false ? 'VER' : 'OCULTO'}
                    </button>
                    <button
                      onClick={() => onDeleteSupply(sup.id, getPass())}
                      className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/50"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: GESTIÓN DE BEBIDAS DEL MENÚ (ACTIVAR / DESACTIVAR & STOCK NUMÉRICO) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gold-500/30 pb-2">
          <h3 className="font-cinzel text-lg font-extrabold text-gold-gradient uppercase tracking-wider">
            BEBIDAS DE LA CARTA (ACTIVACIÓN Y NÚMERO DE STOCK)
          </h3>
          <span className="text-xs text-gold-300/70 font-sans">
            El número solo aparecerá a los clientes si decides asignárselo.
          </span>
        </div>

        {menuCategories.map((cat) => {
          const categoryDrinks = menu.filter(d => d.category === cat);
          return (
            <div key={cat} className="space-y-3">
              <h4 className="font-cinzel text-sm font-bold text-gold-400 uppercase tracking-widest">
                {cat} ({categoryDrinks.length})
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryDrinks.map((drink) => {
                  const isActive = drink.active !== false;
                  const hasStockLimit = !!drink.hasStockLimit;
                  const stock = drink.stock !== null && drink.stock !== undefined ? drink.stock : 10;

                  return (
                    <div
                      key={drink.id}
                      className={`gold-frame rounded-2xl p-4 bg-darkcard flex flex-col justify-between gap-3 transition-all ${
                        !isActive ? 'opacity-60 border-rose-500/30 bg-rose-950/10' : ''
                      }`}
                    >
                      {/* Top: Nombre + Switch */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h5 className="font-cinzel text-base font-bold text-gold-100 uppercase tracking-wider">
                            {drink.name}
                          </h5>
                          <p className="text-xs text-gold-200/70 line-clamp-1">{drink.description}</p>
                        </div>

                        {/* Switch Activo / Inactivo */}
                        <button
                          onClick={() => onToggleDrink(drink.id, getPass())}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-cinzel text-[11px] font-bold tracking-wider transition-all shrink-0 ${
                            isActive
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/80'
                              : 'bg-rose-950/60 text-rose-300 border border-rose-500/40 hover:bg-rose-900/80'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          {isActive ? 'ACTIVADA' : 'DESACTIVADA'}
                        </button>
                      </div>

                      {/* Controles de Límite Numérico de Stock */}
                      <div className="bg-black/90 border border-gold-500/20 p-3 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-cinzel font-bold text-gold-300 uppercase">
                            Estado para el cliente:
                          </span>

                          <button
                            onClick={() => {
                              onUpdateStock(drink.id, {
                                hasStockLimit: !hasStockLimit,
                                stock: !hasStockLimit ? (stock || 10) : null,
                                adminPassword: getPass()
                              });
                            }}
                            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                              hasStockLimit
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-black text-gold-400/70 border-gold-500/20 hover:text-gold-200'
                            }`}
                          >
                            <Hash className="w-3.5 h-3.5" />
                            {hasStockLimit ? 'CON NÚMERO DE STOCK' : '+ MOSTRAR NÚMERO STOCK'}
                          </button>
                        </div>

                        {hasStockLimit ? (
                          <div className="flex items-center justify-between pt-1 border-t border-gold-500/10">
                            <span className="text-xs text-amber-200 font-mono">
                              Stock visible: <strong>{stock}</strong>
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onUpdateStock(drink.id, { hasStockLimit: true, stock: Math.max(0, stock - 1), adminPassword: getPass() })}
                                className="w-7 h-7 rounded-lg bg-gold-900/40 border border-gold-500/30 text-gold-300 hover:bg-gold-500 hover:text-slate-950 font-bold flex items-center justify-center"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => onUpdateStock(drink.id, { hasStockLimit: true, stock: stock + 1, adminPassword: getPass() })}
                                className="w-7 h-7 rounded-lg bg-gold-900/40 border border-gold-500/30 text-gold-300 hover:bg-gold-500 hover:text-slate-950 font-bold flex items-center justify-center"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => onUpdateStock(drink.id, { hasStockLimit: false, stock: null, adminPassword: getPass() })}
                                className="text-[10px] text-gold-400/60 hover:text-gold-200 underline pl-1"
                              >
                                Quitar número
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[11px] text-emerald-400/80 italic font-sans pt-0.5">
                            🟢 Mostrando simplemente como "Disponible" sin número.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
