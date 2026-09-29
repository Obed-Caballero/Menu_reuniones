import React, { useState } from 'react';
import { X, Lock, Save, Package, ShieldAlert } from 'lucide-react';

export default function StockModal({ menu, onClose, onUpdateStock }) {
  const [stocks, setStocks] = useState(() => {
    const initial = {};
    menu.forEach(drink => {
      initial[drink.id] = drink.stock !== undefined ? drink.stock : 10;
    });
    return initial;
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStockChange = (drinkId, value) => {
    const num = parseInt(value, 10);
    setStocks(prev => ({
      ...prev,
      [drinkId]: isNaN(num) ? 0 : Math.max(0, num)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminPassword) {
      setError('Ingresa la contraseña de administrador.');
      return;
    }

    setIsSubmitting(true);
    const result = await onUpdateStock(stocks, adminPassword);
    setIsSubmitting(false);

    if (result && result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="gold-frame-double rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl bg-darkcard flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gold-900/60 to-darkcard border-b border-gold-500/40 p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gold-400" />
            <h3 className="font-cinzel text-lg font-bold text-gold-gradient uppercase">
              GESTIONAR INVENTARIO (ADMIN)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gold-400 hover:text-gold-100 bg-black/80 p-2 rounded-xl border border-gold-500/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario con Scroll */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans overflow-y-auto flex-1">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-xs text-gold-300/70">
            Ajusta las unidades disponibles de cada bebida. Cuando el stock llegue a 0, la bebida se marcará automáticamente como <strong className="text-rose-400">Agotado</strong>.
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {menu.map((drink) => (
              <div
                key={drink.id}
                className="flex items-center justify-between bg-black/90 border border-gold-500/30 p-3 rounded-xl gap-3"
              >
                <div className="flex flex-col">
                  <span className="font-cinzel text-xs font-bold text-gold-100 uppercase">
                    {drink.name}
                  </span>
                  <span className="text-[10px] text-gold-500/50">
                    {drink.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-gold-400 font-mono">
                    Stock:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stocks[drink.id] !== undefined ? stocks[drink.id] : 0}
                    onChange={(e) => handleStockChange(drink.id, e.target.value)}
                    className="w-20 bg-darkcard border border-gold-500/40 rounded-lg px-2.5 py-1 text-xs text-gold-100 font-mono text-center focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Contraseña de Administrador */}
          <div className="pt-3 border-t border-gold-500/20">
            <label className="block text-xs font-cinzel font-bold text-gold-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gold-400" />
              Contraseña de Administrador *
            </label>
            <input
              type="password"
              placeholder="Ingresa la clave para guardar el inventario"
              value={adminPassword}
              onChange={(e) => {
                setAdminPassword(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-black/90 border border-gold-500/50 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400 font-sans"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold text-gold-400/70 hover:text-gold-200"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 font-cinzel font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 tracking-wider disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> GUARDAR INVENTARIO
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
