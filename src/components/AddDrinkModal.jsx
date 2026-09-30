import React, { useState, useEffect } from 'react';
import { X, Plus, Lock, AlertTriangle, ShieldAlert } from 'lucide-react';

const CATEGORIES = ['Tequila', 'Mezcal', 'Whiskey', 'Vodka', 'Ginebra', 'Ron', 'Cervezas', 'Sin Alcohol', 'Variados'];
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 30;

export default function AddDrinkModal({ onClose, onAddDrink }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  
  // Guardar y recordar contraseña en la sesión del navegador
  const [adminPassword, setAdminPassword] = useState(() => {
    return sessionStorage.getItem('admin_password') || sessionStorage.getItem('bartender_pass') || '';
  });
  
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    let timer;
    if (isLocked && lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds((prev) => prev - 1);
      }, 1000);
    } else if (lockoutSeconds === 0 && isLocked) {
      setIsLocked(false);
      setAttemptsLeft(MAX_ATTEMPTS);
      setError('');
    }
    return () => clearInterval(timer);
  }, [isLocked, lockoutSeconds]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      setError(`Formulario bloqueado por seguridad. Inténtalo de nuevo en ${lockoutSeconds} segundos.`);
      return;
    }

    if (!name.trim()) {
      setError('Escribe el nombre de la bebida.');
      return;
    }

    if (!adminPassword) {
      setError('Ingresa la contraseña.');
      return;
    }

    const result = await onAddDrink({
      name: name.trim(),
      category,
      description: description.trim(),
      adminPassword
    });

    if (result && result.error) {
      const nextAttempts = attemptsLeft - 1;
      setAttemptsLeft(nextAttempts);

      if (nextAttempts <= 0) {
        setIsLocked(true);
        setLockoutSeconds(LOCKOUT_TIME);
        setError(`Has superado el límite de ${MAX_ATTEMPTS} intentos. Acceso bloqueado temporalmente por ${LOCKOUT_TIME} segundos.`);
      } else {
        setError(`Contraseña incorrecta. Te quedan ${nextAttempts} ${nextAttempts === 1 ? 'intento' : 'intentos'}.`);
      }
    } else {
      // Guardar clave exitosa en la sesión para futuras acciones
      sessionStorage.setItem('admin_password', adminPassword);
      sessionStorage.setItem('bartender_pass', adminPassword);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="gold-frame-double rounded-3xl w-full max-w-md overflow-hidden shadow-2xl bg-darkcard">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gold-900/60 to-darkcard border-b border-gold-500/40 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gold-400" />
            <h3 className="font-cinzel text-lg font-bold text-gold-gradient uppercase">
              Agregar Bebida (Solo Admin)
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
            <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
              isLocked 
                ? 'bg-rose-950/80 border border-rose-500/50 text-rose-200'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}>
              {isLocked ? (
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <span>{error}</span>
            </div>
          )}

          {/* Nombre de la bebida */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1.5 uppercase tracking-wider">
              Nombre de la bebida *
            </label>
            <input
              type="text"
              placeholder="Ej: Paloma, Margarita..."
              value={name}
              disabled={isLocked}
              onChange={(e) => {
                setName(e.target.value);
                if (error && !isLocked) setError('');
              }}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400 font-sans disabled:opacity-50"
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
              disabled={isLocked}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 focus:outline-none focus:border-gold-400 font-sans disabled:opacity-50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-gold-300 mb-1.5 uppercase tracking-wider">
              Ingredientes / Descripción Corta
            </label>
            <input
              type="text"
              placeholder="Ej: Licor de naranja + Limón + Squirt"
              value={description}
              disabled={isLocked}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/90 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400 font-sans disabled:opacity-50"
            />
          </div>

          {/* Contraseña de Administrador */}
          <div className="pt-2 border-t border-gold-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-cinzel font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gold-400" />
                Contraseña de Administrador *
              </label>
              <span className="text-[10px] text-gold-500/60 font-mono">
                {attemptsLeft}/{MAX_ATTEMPTS} intentos
              </span>
            </div>
            <input
              type="password"
              placeholder={isLocked ? `Bloqueado (${lockoutSeconds}s)` : "Ingresa la clave"}
              value={adminPassword}
              disabled={isLocked}
              onChange={(e) => {
                setAdminPassword(e.target.value);
                if (error && !isLocked) setError('');
              }}
              className="w-full bg-black/90 border border-gold-500/50 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400 font-sans disabled:opacity-50"
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
              disabled={isLocked}
              className="bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 font-cinzel font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" /> {isLocked ? `ESPERA (${lockoutSeconds}S)` : 'GUARDAR BEBIDA'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
