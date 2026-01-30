import React from 'react';
import { useAdmin } from '../context/AdminContext';

function AdminHeader() {
    const { currentPage, sidebarOpen, setSidebarOpen } = useAdmin();

    const pageNames = {
        dashboard: 'Dashboard',
        appointments: 'Agendamentos',
        clients: 'Clientes',
        services: 'Serviços',
        barbers: 'Barbeiros',
        units: 'Unidades',
        plans: 'Planos',
        reports: 'Relatórios',
        settings: 'Configurações',
    };

    return (
        <header className="admin-header">
            <div className="flex items-center gap-4">
                <button
                    className="lg:hidden w-10 h-10 rounded-lg bg-bg-card flex items-center justify-center"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <i className="fas fa-bars"></i>
                </button>
                <div>
                    <h1 className="text-xl font-bold">{pageNames[currentPage] || 'Dashboard'}</h1>
                    <p className="text-sm text-secondary">
                        {new Date().toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="hidden md:flex items-center gap-2 bg-bg-card rounded-lg px-4 py-2">
                    <i className="fas fa-search text-secondary"></i>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="bg-transparent border-none outline-none w-48"
                    />
                </div>

                {/* Notifications */}
                <button className="relative w-10 h-10 rounded-lg bg-bg-card flex items-center justify-center">
                    <i className="fas fa-bell"></i>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                        3
                    </span>
                </button>

                {/* Quick Actions */}
                <button className="btn-primary text-sm py-2 px-4 hidden sm:flex items-center gap-2">
                    <i className="fas fa-plus"></i>
                    Novo Agendamento
                </button>
            </div>
        </header>
    );
}

export default AdminHeader;
