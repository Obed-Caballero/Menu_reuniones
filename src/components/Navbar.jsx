import React from 'react';
import { Wine, Users, GlassWater } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, ordersCount, onOpenTempDrink }) {
  return (
    <header className="sticky top-0 z-30 bg-black/90 backdrop-blur border-b border-gold-500/30 shadow-2xl">
      {/* Top Accent Line */}
      <div className="h-0.5 bg-gradient-to-r from-gold-900 via-gold-500 to-gold-900 w-full"></div>

      <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Logo and Branding: MEETINGS GERMAN */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-b from-amber-400 to-gold-600 p-2.5 rounded-xl shadow-lg shadow-gold-500/20 text-slate-950 font-bold border border-gold-300/40">
            <Wine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-cinzel text-xl md:text-2xl font-extrabold tracking-wider text-gold-gradient uppercase">
              MEETINGS GERMAN
            </h1>
            <p className="font-playfair text-xs italic text-gold-300/80 tracking-widest">
              Menú de la Casa & Reuniones
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-darkcard/90 p-1.5 rounded-xl border border-gold-500/30 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-cinzel text-xs font-bold tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-gradient-to-r from-gold-600 via-gold-500 to-amber-500 text-slate-950 shadow-lg'
                : 'text-gold-200/70 hover:text-gold-300 hover:bg-gold-900/30'
            }`}
          >
            <Wine className="w-4 h-4" />
            CARTA DE BEBIDAS
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-cinzel text-xs font-bold tracking-wider transition-all relative whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-gold-600 via-gold-500 to-amber-500 text-slate-950 shadow-lg'
                : 'text-gold-200/70 hover:text-gold-300 hover:bg-gold-900/30'
            }`}
          >
            <Users className="w-4 h-4" />
            PEDIDOS EN VIVO
            {ordersCount > 0 && (
              <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold font-sans ${
                activeTab === 'orders' 
                  ? 'bg-slate-950 text-gold-400' 
                  : 'bg-gold-500 text-slate-950'
              }`}>
                {ordersCount}
              </span>
            )}
          </button>
        </div>

        {/* Acciones Adicionales */}
        <div className="flex items-center gap-2">
          {/* Botón Bebida Temporal */}
          <button
            onClick={onOpenTempDrink}
            title="Pedir una bebida fuera de carta"
            className="flex items-center gap-2 bg-gradient-to-r from-gold-600 to-amber-500 hover:from-gold-500 hover:to-amber-400 text-slate-950 px-4 py-2 rounded-xl font-cinzel text-xs font-bold tracking-wider transition-all shadow-md"
          >
            <GlassWater className="w-4 h-4" />
            <span>BEBIDA TEMPORAL</span>
          </button>
        </div>

      </div>
    </header>
  );
}
