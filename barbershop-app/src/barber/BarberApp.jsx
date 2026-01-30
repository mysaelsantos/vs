import React from 'react';
import { BarberProvider, useBarber } from './context/BarberContext';
import BarberSidebar from './components/BarberSidebar';
import BarberHeader from './components/BarberHeader';
import BarberLoginPage from './pages/BarberLoginPage';
import BarberSchedulePage from './pages/BarberSchedulePage';
import BarberBlocksPage from './pages/BarberBlocksPage';
import BarberEarningsPage from './pages/BarberEarningsPage';
import BarberProfilePage from './pages/BarberProfilePage';

function BarberContent() {
    const { isLoading, isAuthenticated, currentPage, sidebarOpen } = useBarber();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-dark flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
                    <p className="text-secondary">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <BarberLoginPage />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'schedule':
                return <BarberSchedulePage />;
            case 'blocks':
                return <BarberBlocksPage />;
            case 'earnings':
                return <BarberEarningsPage />;
            case 'profile':
                return <BarberProfilePage />;
            default:
                return <BarberSchedulePage />;
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark flex">
            <BarberSidebar />
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
                <BarberHeader />
                <main className="p-6">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}

function BarberApp() {
    return (
        <BarberProvider>
            <BarberContent />
        </BarberProvider>
    );
}

export default BarberApp;
