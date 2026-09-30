import React, { useState, useMemo } from 'react';
import { Search, Plus, GlassWater, PackageCheck, Wine, Flame } from 'lucide-react';

export default function MenuSection({
  menu,
  supplies,
  orders,
  onSelectDrink,
  onOpenAddDrink,
  onOpenTempDrink,
  onGoToBartender
}) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Bebida más pedida (POPULAR 🔥)
  const mostPopularDrinkName = useMemo(() => {
    if (!orders || orders.length === 0) return null;
    const counts = {};
    orders.forEach(o => {
      if (!o.isTemporary) {
        counts[o.drinkName] = (counts[o.drinkName] || 0) + 1;
      }
    });
    let maxCount = 0;
    let popularName = null;
    Object.entries(counts).forEach(([name, count]) => {
      if (count > maxCount) {
        maxCount = count;
        popularName = name;
      }
    });
    return popularName;
  }, [orders]);

  // Categorías
  const categories = useMemo(() => {
    const defaultCats = ['Tequila', 'Mezcal', 'Whiskey', 'Vodka', 'Ginebra', 'Ron'];
    const existingCats = Array.from(new Set(menu.map(item => item.category)));
    const sortedCats = ['Todos'];
    defaultCats.forEach(c => {
      if (existingCats.includes(c)) sortedCats.push(c);
    });
    existingCats.forEach(c => {
      if (!sortedCats.includes(c)) sortedCats.push(c);
    });
    return sortedCats;
  }, [menu]);

  // Filtrar bebidas
  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesCat = selectedCategory === 'Todos' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [menu, selectedCategory, searchTerm]);

  // Agrupar por categoría
  const groupedMenu = useMemo(() => {
    const groups = {};
    filteredMenu.forEach(drink => {
      const cat = drink.category || 'Variados';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(drink);
    });
    return groups;
  }, [filteredMenu]);

  // Insumos extras activos
  const activeSupplies = useMemo(() => {
    return (supplies || []).filter(s => s.active !== false);
  }, [supplies]);

  return (
    <section className="space-y-8 font-sans">
      
      {/* Banner Principal Estilo Bar Elegante */}
      <div className="gold-frame-double rounded-3xl p-6 md:p-8 text-center relative overflow-hidden bg-gradient-to-b from-darkcard via-black to-darkcard border border-gold-500/40">
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="font-playfair italic text-gold-300 text-lg md:text-xl tracking-widest">
            MEETINGS GERMAN
          </p>
          <h2 className="font-cinzel text-3xl md:text-5xl font-black tracking-widest text-gold-gradient uppercase drop-shadow-md">
            BAR MENU
          </h2>
          
          <div className="flex items-center justify-center gap-3 py-1 text-gold-500/60">
            <span className="h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent flex-1"></span>
            <span className="text-xs tracking-widest text-gold-400 font-cinzel">SELECCIÓN EXCLUSIVA</span>
            <span className="h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent flex-1"></span>
          </div>

          <p className="text-xs md:text-sm text-gold-100/70 font-sans tracking-wide">
            Selecciona tu bebida favorita o pide una <span className="text-gold-300 font-semibold">bebida especial fuera de carta</span>.
          </p>

          {/* Botones de Acción Banner */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onOpenTempDrink}
              className="bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 border border-gold-500/30 px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider flex items-center gap-2 transition-all"
            >
              <GlassWater className="w-4 h-4 text-gold-400" />
              PEDIR BEBIDA FUERA DE CARTA
            </button>
          </div>
        </div>
      </div>

      {/* RECUADRO DE INVENTARIO Y ESTADO DE LA BARRA PARA EL CLIENTE */}
      <div className="gold-frame rounded-3xl p-5 md:p-6 bg-gradient-to-br from-darkcard via-black to-darkcard border border-gold-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gold-500/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-gold-500/10 p-2 rounded-xl border border-gold-500/30 text-gold-400">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-sm md:text-base font-extrabold text-gold-gradient uppercase tracking-wider">
                DISPONIBILIDAD DE BARRA & INVENTARIO EN VIVO
              </h3>
              <p className="text-[11px] text-gold-200/70 font-sans">
                Consulta los licores y el estado de las bebidas sin cambiar de página.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Chips de Bebidas del Menú */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-cinzel font-bold text-gold-400 uppercase tracking-wider block">
            Bebidas de la Carta:
          </span>
          <div className="flex flex-wrap gap-2">
            {menu.map((drink) => {
              const isActive = drink.active !== false;
              const hasLimit = !!drink.hasStockLimit;
              const stock = drink.stock !== null && drink.stock !== undefined ? drink.stock : 10;
              const isOutOfStock = hasLimit && stock <= 0;

              let badgeStyle = "bg-emerald-950/40 text-emerald-200 border-emerald-500/30";
              let label = `🟢 ${drink.name}: Disponible`;

              if (!isActive) {
                badgeStyle = "bg-slate-950 text-slate-500 border-slate-800 line-through";
                label = `🚫 ${drink.name} (Desactivada)`;
              } else if (isOutOfStock) {
                badgeStyle = "bg-rose-950/50 text-rose-300 border-rose-500/30";
                label = `🔴 ${drink.name} (Agotada)`;
              } else if (hasLimit) {
                if (stock <= 2) {
                  badgeStyle = "bg-amber-950/50 text-amber-300 border-amber-500/30 animate-pulse";
                  label = `🟡 ${drink.name}: ¡Quedan ${stock}!`;
                } else {
                  badgeStyle = "bg-emerald-950/40 text-emerald-200 border-emerald-500/30";
                  label = `🟢 ${drink.name}: ${stock} disponibles`;
                }
              }

              return (
                <div
                  key={drink.id}
                  className={`text-[11px] px-3 py-1 rounded-xl border font-sans font-medium transition-all ${badgeStyle}`}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Chips de Licores & Insumos Extras en Barra */}
        {activeSupplies.length > 0 && (
          <div className="pt-2 border-t border-gold-500/20 space-y-1.5">
            <span className="text-[11px] font-cinzel font-bold text-gold-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Wine className="w-3.5 h-3.5 text-gold-400" />
              Licores, Botellas & Insumos Extra en Barra:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeSupplies.map((sup) => (
                <div
                  key={sup.id}
                  className="bg-gold-500/10 text-gold-200 border border-gold-500/30 text-[11px] px-3 py-1 rounded-xl font-sans"
                >
                  <strong className="text-gold-300">{sup.name}</strong> ({sup.quantity})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Buscador y Filtros por Categoría */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        
        {/* Buscador */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gold-500/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por licor o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-darkcard/90 border border-gold-500/30 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-gold-100 placeholder-gold-500/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all font-sans"
          />
        </div>

        {/* Categorías */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel tracking-wider uppercase transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 font-bold shadow-md shadow-gold-500/20'
                  : 'bg-darkcard text-gold-300/70 border border-gold-500/20 hover:text-gold-200 hover:border-gold-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Menú Organizado por Categorías */}
      {filteredMenu.length === 0 ? (
        <div className="text-center py-12 gold-frame rounded-2xl">
          <h3 className="font-cinzel text-gold-200 font-bold text-base mb-1">No se encontraron bebidas</h3>
          <p className="text-xs text-gold-400/60 mb-4 font-sans">Intenta cambiar la búsqueda o agrega una nueva bebida a la carta.</p>
          <button
            onClick={onOpenAddDrink}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-600 to-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-cinzel font-bold transition-all"
          >
            <Plus className="w-4 h-4" /> AGREGAR A LA CARTA
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedMenu).map(([categoryName, drinks]) => (
            <div key={categoryName} className="space-y-4">
              
              {/* Encabezado de la Categoría */}
              <div className="flex items-center gap-3 border-b border-gold-500/40 pb-2">
                <h3 className="font-cinzel text-xl md:text-2xl font-extrabold tracking-widest text-gold-gradient uppercase">
                  {categoryName}
                </h3>
                <div className="h-px bg-gradient-to-r from-gold-500/40 to-transparent flex-1"></div>
              </div>

              {/* Grid de Bebidas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drinks.map((drink) => {
                  const isPopular = mostPopularDrinkName === drink.name;
                  const isActive = drink.active !== false;
                  const hasLimit = !!drink.hasStockLimit;
                  const stock = drink.stock !== null && drink.stock !== undefined ? drink.stock : 10;
                  const isOutOfStock = hasLimit && stock <= 0;

                  return (
                    <div
                      key={drink.id}
                      className={`gold-frame rounded-2xl p-5 bg-gradient-to-br from-darkcard via-black to-darkcard flex flex-col justify-between transition-all group ${
                        !isActive 
                          ? 'opacity-50 border-slate-800 bg-slate-950/40' 
                          : isOutOfStock
                          ? 'opacity-70 border-rose-500/30'
                          : 'hover:border-gold-400 hover:shadow-lg hover:shadow-gold-500/10'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Fila Nombre + Badges */}
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-cinzel text-base md:text-lg font-bold text-gold-100 group-hover:text-gold-300 transition-colors uppercase tracking-wider">
                            {drink.name}
                          </h4>

                          <div className="flex flex-wrap items-center gap-1.5 justify-end shrink-0">
                            {/* Badge POPULAR */}
                            {isPopular && isActive && (
                              <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 animate-pulse shadow-md">
                                POPULAR 🔥
                              </span>
                            )}

                            {/* Badges */}
                            {!isActive ? (
                              <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700">
                                DESACTIVADA
                              </span>
                            ) : isOutOfStock ? (
                              <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                AGOTADA
                              </span>
                            ) : drink.badge && !isPopular ? (
                              <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-300 border border-gold-500/30">
                                {drink.badge}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Estado de Inventario en la tarjeta */}
                        <div className="text-xs pt-0.5 font-sans">
                          {!isActive ? (
                            <span className="text-slate-400 text-[11px]">
                              🚫 No disponible en esta reunión
                            </span>
                          ) : isOutOfStock ? (
                            <span className="text-rose-400 text-[11px] font-bold">
                              🔴 Sin existencias disponibles
                            </span>
                          ) : hasLimit ? (
                            stock <= 2 ? (
                              <span className="text-amber-300 text-[11px] font-bold">
                                🟡 ¡Quedan solo {stock} disponibles!
                              </span>
                            ) : (
                              <span className="text-emerald-400 text-[11px]">
                                🟢 {stock} disponibles en barra
                              </span>
                            )
                          ) : (
                            <span className="text-emerald-400 text-[11px]">
                              🟢 Disponible en barra
                            </span>
                          )}
                        </div>

                        {/* Descripción/Ingredientes */}
                        <p className="text-xs text-gold-200/80 font-sans leading-relaxed pt-1.5 border-t border-gold-500/10">
                          {drink.description}
                        </p>
                      </div>

                      {/* Botón de Pedido */}
                      <div className="pt-4">
                        <button
                          onClick={() => onSelectDrink(drink)}
                          disabled={!isActive || isOutOfStock}
                          className={`w-full font-cinzel font-bold text-xs py-2.5 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 tracking-wider shadow-sm ${
                            !isActive
                              ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                              : isOutOfStock
                              ? 'bg-rose-950/20 border-rose-500/20 text-rose-400/50 cursor-not-allowed'
                              : 'bg-darkcard hover:bg-gradient-to-r hover:from-gold-600 hover:to-amber-500 hover:text-slate-950 text-gold-300 border-gold-500/40 hover:border-gold-400'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          {!isActive
                            ? 'NO DISPONIBLE'
                            : isOutOfStock
                            ? 'BEBIDA AGOTADA'
                            : 'PEDIR ESTA BEBIDA'}
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

      {/* Acciones inferiores */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          onClick={onOpenTempDrink}
          className="bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 border border-gold-500/30 px-5 py-3 rounded-2xl font-cinzel text-xs font-bold tracking-wider transition-all flex items-center gap-2"
        >
          <GlassWater className="w-4 h-4 text-gold-400" />
          PEDIR BEBIDA FUERA DE CARTA (TEMPORAL)
        </button>

        <button
          onClick={onOpenAddDrink}
          className="bg-darkcard hover:bg-gold-900/40 text-gold-300 border border-gold-500/30 px-5 py-3 rounded-2xl font-cinzel text-xs font-bold tracking-wider transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          AGREGAR NUEVA BEBIDA AL MENÚ
        </button>
      </div>
    </section>
  );
}
