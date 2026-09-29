import React, { useState } from 'react';
import { X, Plus, Lock, Package } from 'lucide-react';

const CATEGORIES = ['Licores', 'Mezcladores', 'Jugos & Frutas', 'Complementos'];
const STATUSES = ['Disponible', 'Poco', 'Agotado'];

export default function AddSupplyModal({ onClose, onAddSupply }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState(STATUSES[0]);
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Escribe el nombre del insumo o botella.');
      return;
    }

    if (!adminPassword) {
      setError('Ingresa la contraseña de administrador.');
      return;
    }

    const result = await onAddSupply({
      name: name.trim(),
      category,
      quantity: quantity.trim() || '1 Unidad',
      status,
      adminPassword
    });

    if (result && result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="gold-frame-double rounded-3xl w-full max-w-md overflow-hidden shadow-2xl bg-darkcard">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gold-900/60 to-darkcard border-b border-gold-500/40 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gold-400" />
            <h3 className="font-cinzel text-lg font-bold text-gold-gradient uppercase">
              Agregar Insumo / Botella (Admin)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gold-400 hover:text-gold-100 bg-black/80 p-2 rounded-xl border border-gold-500/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Nombre del insumo */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1.5 uppercase tracking-wider">
              Nombre de la Botella / Insumo *
            </label>
            <input
              type="text"
              placeholder="Ej: Tequila Don Julio 70, Squirt, Hielo, Limones..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400 font-sans"
              autoFocus
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1.5 uppercase tracking-wider">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 focus:outline-none focus:border-gold-400 font-sans"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1.5 uppercase tracking-wider">
              Cantidad / Presentación
            </label>
            <input
              type="text"
              placeholder="Ej: 3 Botellas, 12 Latas, 2 kg, 4 Litros..."
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400 font-sans"
            />
          </div>

          {/* Estado Inicial */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1.5 uppercase tracking-wider">
              Estado Inicial
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 focus:outline-none focus:border-gold-400 font-sans"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Contraseña de Administrador */}
          <div className="pt-2 border-t border-gold-500/20">
            <label className="block text-xs font-cinzel font-bold text-gold-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gold-400" />
              Contraseña de Administrador *
            </label>
            <input
              type="password"
              placeholder="Ingresa tu clave de administrador"
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
              className="bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 font-cinzel font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 tracking-wider"
            >
              <Plus className="w-4 h-4" /> GUARDAR INSUMO
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
