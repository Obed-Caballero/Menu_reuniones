import React, { useState, useMemo } from 'react';
import { Package, Search, Plus, Trash2, Edit2, Lock, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function BarInventorySection({ supplies, onOpenAddSupply, onUpdateSupply, onDeleteSupply }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para modal rápido de edición de estado/cantidad
  const [editTarget, setEditTarget] = useState(null); // { supply, quantity, status }
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Todos', 'Licores', 'Mezcladores', 'Jugos & Frutas', 'Complementos'];

  const filteredSupplies = useMemo(() => {
    return supplies.filter(item => {
      const matchesCat = selectedCategory === 'Todos' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [supplies, selectedCategory, searchTerm]);

  const groupedSupplies = useMemo(() => {
    const groups = {};
    filteredSupplies.forEach(item => {
      const cat = item.category || 'Otros Insumos';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [filteredSupplies]);

  const handleOpenEdit = (supply) => {
    setEditTarget({
      ...supply,
      quantity: supply.quantity,
      status: supply.status
    });
    setAdminPassword('');
    setError('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!adminPassword) {
      setError('Ingresa la contraseña de administrador.');
      return;
    }

    setIsSubmitting(true);
    const result = await onUpdateSupply(editTarget.id, editTarget.quantity, editTarget.status, adminPassword);
    setIsSubmitting(false);

    if (result && result.error) {
      setError(result.error);
    } else {
      setEditTarget(null);
    }
  };

  const handleDelete = async (supplyId, name) => {
    const pass = prompt(`Para eliminar "${name}" del inventario de barra, ingresa la contraseña de administrador:`);
    if (!pass) return;

    const result = await onDeleteSupply(supplyId, pass);
    if (result && result.error) {
      alert(result.error);
    }
  };

  return (
    <section className="space-y-8">
      
      {/* Banner Principal del Inventario de Barra */}
      <div className="gold-frame-double rounded-3xl p-6 md:p-8 text-center relative overflow-hidden bg-gradient-to-b from-darkcard via-black to-darkcard border border-gold-500/40">
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="font-playfair italic text-gold-300 text-lg md:text-xl tracking-widest">
            CONTROL DE BARRA & INSUMOS
          </p>
          <h2 className="font-cinzel text-3xl md:text-5xl font-black tracking-widest text-gold-gradient uppercase drop-shadow-md">
            INVENTARIO REAL
          </h2>
          
          <div className="flex items-center justify-center gap-3 py-1 text-gold-500/60">
            <span className="h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent flex-1"></span>
            <span className="text-xs tracking-widest text-gold-400 font-cinzel">BOTELLAS, REFRESCOS & COMPLEMENTOS</span>
            <span className="h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent flex-1"></span>
          </div>

          <p className="text-xs md:text-sm text-gold-100/70 font-sans tracking-wide">
            Revisa el estado real de las botellas de Tequila, Whiskey, Mezcal, refrescos y frutas disponibles en la fiesta.
          </p>

          <div className="pt-3">
            <button
              onClick={onOpenAddSupply}
              className="bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 px-5 py-2.5 rounded-xl font-cinzel font-bold text-xs shadow-lg tracking-wider inline-flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" /> AGREGAR BOTELLA / INSUMO (ADMIN)
            </button>
          </div>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gold-500/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar botella o insumo (ej: Cuervo, Squirt, Hielo...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-darkcard/90 border border-gold-500/30 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-gold-100 placeholder-gold-500/40 focus:outline-none focus:border-gold-400 font-sans"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel tracking-wider uppercase transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-darkcard text-gold-300/70 border border-gold-500/20 hover:text-gold-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Insumos por Categoría */}
      {filteredSupplies.length === 0 ? (
        <div className="text-center py-12 gold-frame rounded-2xl">
          <Package className="w-12 h-12 text-gold-500/40 mx-auto mb-3" />
          <h3 className="font-cinzel text-gold-200 font-bold text-base mb-1">No hay insumos registrados</h3>
          <p className="text-xs text-gold-400/60 mb-4 font-sans">Agrega las botellas e insumos que tienes en la barra.</p>
          <button
            onClick={onOpenAddSupply}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-cinzel font-bold transition-all"
          >
            <Plus className="w-4 h-4" /> AGREGAR INSUMO
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedSupplies).map(([catName, items]) => (
            <div key={catName} className="space-y-4">
              
              <div className="flex items-center gap-3 border-b border-gold-500/40 pb-2">
                <h3 className="font-cinzel text-xl font-extrabold tracking-widest text-gold-gradient uppercase">
                  {catName}
                </h3>
                <div className="h-px bg-gradient-to-r from-gold-500/40 to-transparent flex-1"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => {
                  const isAgotado = item.status === 'Agotado';
                  const isPoco = item.status === 'Poco';

                  return (
                    <div
                      key={item.id}
                      className="gold-frame rounded-2xl p-4 bg-darkcard flex flex-col justify-between hover:border-gold-400 transition-all shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-cinzel text-base font-bold text-gold-100 uppercase tracking-wider">
                            {item.name}
                          </h4>

                          {/* Badge Estado */}
                          <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
                            isAgotado 
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                              : isPoco 
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gold-300/80 font-sans pt-1 border-t border-gold-500/10">
                          <span>Cantidad actual:</span>
                          <strong className="font-mono text-gold-200">{item.quantity}</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Editar estado/cantidad (Admin)"
                          className="flex items-center gap-1 bg-black hover:bg-gold-500/20 text-gold-300 border border-gold-500/30 px-2.5 py-1.5 rounded-lg font-cinzel text-[11px] font-bold"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-gold-400" /> EDITAR
                        </button>

                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          title="Eliminar insumo (Admin)"
                          className="p-1.5 bg-black hover:bg-rose-950 text-rose-400 border border-rose-500/30 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal Edición Rápida de Insumo */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="gold-frame-double rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl bg-darkcard">
            <div className="bg-gradient-to-r from-gold-900/60 to-darkcard border-b border-gold-500/40 p-4 flex items-center justify-between">
              <h3 className="font-cinzel text-base font-bold text-gold-gradient uppercase">
                Editar {editTarget.name}
              </h3>
              <button
                onClick={() => setEditTarget(null)}
                className="text-gold-400 hover:text-gold-100 bg-black/80 p-1.5 rounded-xl border border-gold-500/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 font-sans">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1 uppercase">
                  Cantidad disponible
                </label>
                <input
                  type="text"
                  value={editTarget.quantity}
                  onChange={(e) => setEditTarget({ ...editTarget, quantity: e.target.value })}
                  className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gold-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1 uppercase">
                  Estado
                </label>
                <select
                  value={editTarget.status}
                  onChange={(e) => setEditTarget({ ...editTarget, status: e.target.value })}
                  className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gold-100 focus:outline-none focus:border-gold-400"
                >
                  <option value="Disponible">Disponible (Suficiente)</option>
                  <option value="Poco">Poco (Se está acabando)</option>
                  <option value="Agotado">Agotado (Sin existencias)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-gold-500/20">
                <label className="block text-xs font-cinzel font-bold text-gold-400 mb-1 uppercase flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-gold-400" /> Contraseña Admin *
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Ingresa clave de admin"
                  className="w-full bg-black/90 border border-gold-500/50 rounded-xl px-3.5 py-2 text-sm text-gold-100 focus:outline-none focus:border-gold-400"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-3 py-2 rounded-xl text-xs font-cinzel font-bold text-gold-400/70"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 font-cinzel font-bold text-xs px-4 py-2 rounded-xl shadow-lg disabled:opacity-50"
                >
                  GUARDAR CAMBIOS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
