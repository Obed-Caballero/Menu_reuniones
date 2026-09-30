import React, { useState, useMemo } from 'react';
import { Users, CheckCircle2, Clock, MessageSquare, Wine, RotateCcw, Lock, X, ShieldAlert } from 'lucide-react';

export default function OrdersList({ orders, onDeleteOrder, onClearAllOrders, onGoToMenu }) {
  // Estados para modales de confirmación protegidos por clave
  const [targetAction, setTargetAction] = useState(null);
  const [bartenderPassword, setBartenderPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resumen del total por bebida
  const summary = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      counts[o.drinkName] = (counts[o.drinkName] || 0) + 1;
    });
    return Object.entries(counts).map(([drink, count]) => ({ drink, count }));
  }, [orders]);

  const handleOpenAuthModal = (type, orderId = null, friendName = '', drinkName = '') => {
    const savedPass = sessionStorage.getItem('bartender_pass');
    if (savedPass) {
      setBartenderPassword(savedPass);
    } else {
      setBartenderPassword('');
    }
    setError('');
    setTargetAction({ type, orderId, friendName, drinkName });
  };

  const handleConfirmAction = async (e) => {
    e.preventDefault();
    if (!bartenderPassword) {
      setError('Ingresa la contraseña.');
      return;
    }

    setIsSubmitting(true);
    let result;

    if (targetAction.type === 'delete') {
      result = await onDeleteOrder(targetAction.orderId, bartenderPassword);
    } else if (targetAction.type === 'clearAll') {
      result = await onClearAllOrders(bartenderPassword);
    }

    setIsSubmitting(false);

    if (result && result.error) {
      setError(result.error);
    } else {
      sessionStorage.setItem('bartender_pass', bartenderPassword);
      setTargetAction(null);
      setBartenderPassword('');
      setError('');
    }
  };

  return (
    <section className="space-y-6">
      
      {/* Header y Acciones de Pedidos */}
      <div className="gold-frame rounded-3xl p-5 md:p-6 bg-gradient-to-r from-darkcard via-black to-darkcard flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gold-500/10 text-gold-400 p-2.5 rounded-2xl border border-gold-500/30">
            <Wine className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-cinzel text-xl font-extrabold text-gold-gradient uppercase tracking-wider">
              PEDIDOS DE LA REUNIÓN
            </h2>
            <p className="text-xs text-gold-200/70 font-sans">
              {orders.length === 1 
                ? 'Hay 1 pedido registrado en Meetings German.' 
                : `Hay ${orders.length} pedidos registrados en total.`}
            </p>
          </div>
        </div>

        {orders.length > 0 && (
          <button
            onClick={() => handleOpenAuthModal('clearAll')}
            className="flex items-center gap-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 px-3.5 py-2 rounded-xl font-cinzel text-xs font-bold tracking-wider transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            REINICIAR LISTA
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 gold-frame rounded-3xl p-8 max-w-md mx-auto bg-darkcard">
          <div className="bg-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold-500/30">
            <Wine className="w-8 h-8 text-gold-400" />
          </div>
          <h3 className="font-cinzel text-lg font-bold text-gold-200 uppercase mb-2">¡Nadie ha pedido nada todavía!</h3>
          <p className="text-xs text-gold-400/60 mb-6 font-sans">
            Explora la carta de Meetings German, selecciona tu bebida y pídele a tus amigos que hagan su pedido.
          </p>
          <button
            onClick={onGoToMenu}
            className="bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 px-5 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-wider shadow-lg hover:scale-105 transition-all"
          >
            IR A LA CARTA DE BEBIDAS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Lista Principal de Pedidos por Amigo */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-cinzel text-xs uppercase font-bold text-gold-400 tracking-widest mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" /> ORDENES RECIBIDAS
            </h3>

            {orders.map((order, index) => (
              <div
                key={order.id}
                className="gold-frame rounded-2xl p-4 bg-darkcard flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 text-xs font-extrabold px-2 py-0.5 rounded-md font-mono">
                      #{index + 1}
                    </span>
                    <span className="bg-gold-500/10 text-gold-300 border border-gold-500/30 text-xs font-bold px-2.5 py-0.5 rounded-lg font-sans">
                      {order.friendName}
                    </span>
                    <span className="text-[11px] text-gold-500/40 font-sans">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="font-cinzel text-base font-bold text-gold-100 uppercase tracking-wider">
                    {order.drinkName}
                  </h4>

                  {/* Notas Especiales */}
                  {order.notes && (
                    <div className="flex items-start gap-1.5 bg-black/90 border border-gold-500/30 rounded-xl px-3 py-1.5 text-xs text-gold-200/90 font-sans">
                      <MessageSquare className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                      <span><strong className="text-gold-400">Nota:</strong> {order.notes}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleOpenAuthModal('delete', order.id, order.friendName, order.drinkName)}
                  title="Marcar como servido"
                  className="self-end sm:self-center flex items-center gap-1.5 bg-black hover:bg-gold-500/20 text-gold-300 border border-gold-500/40 px-3.5 py-2 rounded-xl font-cinzel text-xs font-bold tracking-wider transition-all"
                >
                  <Lock className="w-3.5 h-3.5 text-gold-400" />
                  SERVIDO
                </button>
              </div>
            ))}
          </div>

          {/* Resumen Total para Servir */}
          <div className="gold-frame-double rounded-3xl p-5 h-fit space-y-4 bg-darkcard">
            <div className="border-b border-gold-500/30 pb-3">
              <h3 className="font-cinzel text-sm font-bold text-gold-gradient uppercase tracking-wider">
                RESUMEN PARA SERVIR
              </h3>
              <p className="text-xs text-gold-300/60 font-sans">
                Total acumulado para preparar en barra:
              </p>
            </div>

            <div className="space-y-2">
              {summary.map(({ drink, count }) => (
                <div
                  key={drink}
                  className="flex items-center justify-between bg-black/90 border border-gold-500/30 p-3 rounded-xl"
                >
                  <span className="font-cinzel text-xs font-bold text-gold-200 truncate pr-2 uppercase">
                    {drink}
                  </span>
                  <span className="bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 font-extrabold text-xs px-2.5 py-1 rounded-lg font-sans">
                    x{count}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Modal de Autenticación */}
      {targetAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="gold-frame-double rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl bg-darkcard">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-gold-900/60 to-darkcard border-b border-gold-500/40 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-gold-400" />
                <h3 className="font-cinzel text-base font-bold text-gold-gradient uppercase">
                  Acceso Requerido
                </h3>
              </div>
              <button
                onClick={() => setTargetAction(null)}
                className="text-gold-400 hover:text-gold-100 bg-black/80 p-1.5 rounded-xl border border-gold-500/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleConfirmAction} className="p-5 space-y-4 font-sans">
              <div className="text-xs text-gold-200/80">
                {targetAction.type === 'delete' ? (
                  <p>
                    Marcar como servido el pedido de <strong className="text-gold-300">{targetAction.friendName}</strong> (<span className="text-gold-400">{targetAction.drinkName}</span>):
                  </p>
                ) : (
                  <p className="text-rose-300 font-semibold">
                    ¿Confirmas reiniciar toda la lista de pedidos de la reunión?
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-cinzel font-bold text-gold-400 mb-1.5 uppercase tracking-wider">
                  Contraseña *
                </label>
                <input
                  type="password"
                  placeholder="Ingresa la clave"
                  value={bartenderPassword}
                  onChange={(e) => {
                    setBartenderPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-black/90 border border-gold-500/50 rounded-xl px-3.5 py-2.5 text-sm text-gold-100 placeholder-gold-500/30 focus:outline-none focus:border-gold-400 font-sans"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gold-500/20">
                <button
                  type="button"
                  onClick={() => setTargetAction(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-cinzel font-bold text-gold-400/70 hover:text-gold-200"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 font-cinzel font-bold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 tracking-wider disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  CONFIRMAR
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </section>
  );
}
