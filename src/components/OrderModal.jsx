import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, User } from 'lucide-react';

const QUICK_NOTES = [
  'Sin hielo',
  'Doble de ron',
  'Con mucho limón',
  'Poco dulce',
  'Bien fría',
  'Sin azúcar'
];

export default function OrderModal({ drink, onClose, onSubmitOrder }) {
  const [friendName, setFriendName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Recordar nombre del usuario en localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('web_menu_friend_name');
    if (savedName) {
      setFriendName(savedName);
    }
  }, []);

  if (!drink) return null;

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
      setError('Por favor escribe tu nombre para saber de quién es el pedido.');
      return;
    }

    localStorage.setItem('web_menu_friend_name', friendName.trim());

    onSubmitOrder({
      friendName: friendName.trim(),
      drinkName: drink.name,
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="gold-frame-double rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl bg-darkcard">
        
        {/* Header del Modal */}
        <div className="bg-gradient-to-r from-gold-900/60 via-black to-darkcard border-b border-gold-500/40 p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-cinzel font-bold text-gold-400 uppercase tracking-widest block">
              {drink.category}
            </span>
            <h3 className="font-cinzel text-xl font-bold text-gold-gradient uppercase">{drink.name}</h3>
          </div>

          <button
            onClick={onClose}
            className="text-gold-400 hover:text-gold-100 bg-black/80 p-2 rounded-xl border border-gold-500/30 hover:bg-gold-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl font-sans">
              {error}
            </div>
          )}

          {/* Nombre del amigo */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
              <User className="w-4 h-4 text-gold-400" />
              ¿A nombre de quién va el pedido? *
            </label>
            <input
              type="text"
              placeholder="Ej: Carlos, Sofía, Mateo..."
              value={friendName}
              onChange={(e) => {
                setFriendName(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 font-sans"
              autoFocus
            />
          </div>

          {/* Notas Especiales */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-gold-400" />
              Notas especiales / Preferencias
            </label>

            {/* Chips de selección rápida sin emojis */}
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
              placeholder="Ej: Sin hielo, doble de ron, con toque de limón..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 font-sans"
            />
          </div>

          {/* Botones de Acción */}
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
              className="flex items-center gap-2 bg-gradient-to-r from-gold-600 to-amber-500 hover:from-gold-500 hover:to-amber-400 text-slate-950 font-cinzel font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg tracking-wider"
            >
              <Send className="w-4 h-4" />
              CONFIRMAR PEDIDO
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
