import React, { useState, useEffect } from 'react';
import { X, Send, User, MessageSquare, GlassWater } from 'lucide-react';

const QUICK_NOTES = [
  'Sin hielo',
  'Doble de alcohol',
  'Con mucho limón',
  'Poco dulce',
  'Bien fría',
  'Sin azúcar'
];

export default function TempDrinkModal({ onClose, onSubmitTempOrder }) {
  const [friendName, setFriendName] = useState('');
  const [drinkName, setDrinkName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('web_menu_friend_name');
    if (savedName) {
      setFriendName(savedName);
    }
  }, []);

  const handleQuickNote = (noteTag) => {
    if (notes.includes(noteTag)) {
      const updated = notes.replace(noteTag, '').replace(/,\s*,/g, ',').trim();
      setNotes(updated);
    } else {
      const updated = notes ? `${notes}, ${noteTag}` : noteTag;
      setNotes(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!friendName.trim()) {
      setError('Escribe tu nombre para saber de quién es el pedido.');
      return;
    }

    if (!drinkName.trim()) {
      setError('Escribe el nombre de la bebida que deseas pedir.');
      return;
    }

    localStorage.setItem('web_menu_friend_name', friendName.trim());

    onSubmitTempOrder({
      friendName: friendName.trim(),
      drinkName: drinkName.trim(),
      notes: notes.trim(),
      isTemporary: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="gold-frame-double rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl bg-darkcard">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gold-900/60 via-black to-darkcard border-b border-gold-500/40 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GlassWater className="w-5 h-5 text-gold-400" />
            <div>
              <span className="text-[10px] font-cinzel font-bold text-gold-400 uppercase tracking-widest block">
                FUERA DE CARTA
              </span>
              <h3 className="font-cinzel text-lg font-bold text-gold-gradient uppercase">
                PEDIR BEBIDA TEMPORAL
              </h3>
            </div>
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

          <p className="text-xs text-gold-300/70">
            Pide una bebida especial fuera del menú. Esta orden aparecerá en la lista de pedidos de la reunión pero <strong className="text-gold-300">no modificará el menú permanente</strong>.
          </p>

          {/* Nombre del amigo */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
              <User className="w-4 h-4 text-gold-400" />
              ¿A nombre de quién va la bebida? *
            </label>
            <input
              type="text"
              placeholder="Ej: Carlos, Sofía, Mateo..."
              value={friendName}
              onChange={(e) => {
                setFriendName(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400 font-sans"
              autoFocus
            />
          </div>

          {/* Nombre de la bebida temporal */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1.5 uppercase tracking-wider">
              Nombre de la bebida especial *
            </label>
            <input
              type="text"
              placeholder="Ej: Tequila Sunrise, Michelada Especial, Carajillo..."
              value={drinkName}
              onChange={(e) => {
                setDrinkName(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400 font-sans"
            />
          </div>

          {/* Notas Especiales */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-gold-400" />
              Notas especiales / Receta (Opcional)
            </label>

            {/* Chips de selección rápida */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {QUICK_NOTES.map((chip) => {
                const isSelected = notes.includes(chip);
                return (
                  <button
                    type="button"
                    key={chip}
                    onClick={() => handleQuickNote(chip)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all font-sans ${
                      isSelected
                        ? 'bg-gold-500/20 text-gold-200 border-gold-400 font-semibold'
                        : 'bg-black text-gold-400/60 border-gold-500/20 hover:text-gold-200 hover:bg-gold-900/20'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

            <textarea
              placeholder="Ej: Con clamato, escarchado con tajín y salsa negra..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400 font-sans"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gold-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold text-gold-400/70 hover:text-gold-200"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 font-cinzel font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg tracking-wider"
            >
              <Send className="w-4 h-4" /> CONFIRMAR PEDIDO
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
