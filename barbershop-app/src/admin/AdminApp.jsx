import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ClientsPage from './pages/ClientsPage';
import ServicesPage from './pages/ServicesPage';
import BarbersPage from './pages/BarbersPage';
import UnitsPage from './pages/UnitsPage';
import PlansPage from './pages/PlansPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function AdminContent() {
    const { isAdminLoading, currentPage, sidebarOpen } = useAdmin();

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard': return <DashboardPage />;
            case 'appointments': return <AppointmentsPage />;
            case 'clients': return <ClientsPage />;
            case 'services': return <ServicesPage />;
            case 'barbers': return <BarbersPage />;
            case 'units': return <UnitsPage />;
            case 'plans': return <PlansPage />;
            case 'reports': return <ReportsPage />;
            case 'settings': return <SettingsPage />;
            default: return <DashboardPage />;
        }
    };

    if (isAdminLoading) {
        return (
            <div className="admin-loading">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
                    <span className="text-black font-bold text-2xl">VS</span>
                </div>
                <i className="fas fa-spinner fa-spin text-2xl text-primary"></i>
                <p className="text-secondary mt-2">Carregando painel...</p>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <AdminHeader />
                <div className="admin-content">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
}

function AdminApp() {
    return (
        <AdminProvider>
            <AdminContent />
        </AdminProvider>
    );
}

export default AdminApp;
