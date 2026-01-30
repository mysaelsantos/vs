import React from 'react';
import { useBarber } from '../context/BarberContext';

function BarberHeader() {
    const { currentPage, sidebarOpen, setSidebarOpen, barber, earnings } = useBarber();

    const pageTitles = {
        schedule: 'Minha Agenda',
        blocks: 'Bloqueio de Horários',
        earnings: 'Meu Faturamento',
        profile: 'Meu Perfil',
    };

    return (
        <header className="h-16 bg-bg-card border-b border-gray-800 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <button
                    className="lg:hidden w-10 h-10 rounded-lg bg-bg-alt flex items-center justify-center"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <i className="fas fa-bars"></i>
                </button>
                <h1 className="text-xl font-bold text-white">{pageTitles[currentPage] || 'Portal'}</h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Resumo rápido de ganhos */}
                <div className="hidden md:flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
                        <i className="fas fa-coins text-green-500"></i>
                        <span className="text-green-500 font-semibold">
                            Hoje: R$ {(earnings?.today || 0).toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                        <i className="fas fa-wallet text-primary"></i>
                        <span className="text-primary font-semibold">
                            Mês: R$ {(earnings?.month || 0).toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-2">
                    {barber?.image ? (
                        <img src={barber.image} alt={barber.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <i className="fas fa-user text-primary text-sm"></i>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default BarberHeader;
