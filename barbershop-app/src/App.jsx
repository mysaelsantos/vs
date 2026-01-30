import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoadingScreen from './components/layout/LoadingScreen';
import Footer from './components/layout/Footer';
import Modal from './components/layout/Modal';
import AgendarView from './components/views/AgendarView';
import HistoricoView from './components/views/HistoricoView';
import PlanosView from './components/views/PlanosView';
import PerfilView from './components/views/PerfilView';

// Import all modals
import LoginModal from './components/modals/auth/LoginModal';
import CadastroModal from './components/modals/auth/CadastroModal';
import EsqueciSenhaModal from './components/modals/auth/EsqueciSenhaModal';
import VerificarCodigoModal from './components/modals/auth/VerificarCodigoModal';
import RedefinirSenhaModal from './components/modals/auth/RedefinirSenhaModal';
import BemVindoModal from './components/modals/auth/BemVindoModal';
import UnidadesModal from './components/modals/agendamento/UnidadesModal';
import BarbeirosModal from './components/modals/agendamento/BarbeirosModal';
import ServicosModal from './components/modals/agendamento/ServicosModal';
import CalendarioModal from './components/modals/agendamento/CalendarioModal';
import ResumoModal from './components/modals/agendamento/ResumoModal';
import SucessoModal from './components/modals/agendamento/SucessoModal';
import DetalhesAgendamentoModal from './components/modals/historico/DetalhesAgendamentoModal';
import RemarcarModal from './components/modals/historico/RemarcarModal';
import CancelarModal from './components/modals/historico/CancelarModal';
import AvaliacaoModal from './components/modals/historico/AvaliacaoModal';
import AssinaturaModal from './components/modals/planos/AssinaturaModal';
import BeneficiosModal from './components/modals/planos/BeneficiosModal';
import PagamentosModal from './components/modals/planos/PagamentosModal';
import GerenciarAssinaturaModal from './components/modals/planos/GerenciarAssinaturaModal';
import MudarPlanoModal from './components/modals/planos/MudarPlanoModal';
import CancelarPlanoModal from './components/modals/planos/CancelarPlanoModal';
import EditarPerfilModal from './components/modals/perfil/EditarPerfilModal';
import TrocarFotoModal from './components/modals/perfil/TrocarFotoModal';
import NotificacoesModal from './components/modals/perfil/NotificacoesModal';
import AlterarPinModal from './components/modals/perfil/AlterarPinModal';
import FormasPagamentoModal from './components/modals/perfil/FormasPagamentoModal';
import AdicionarCartaoModal from './components/modals/perfil/AdicionarCartaoModal';
import AdicionarPixModal from './components/modals/perfil/AdicionarPixModal';
import IndiqueAmigoModal from './components/modals/perfil/IndiqueAmigoModal';
import CashbackModal from './components/modals/perfil/CashbackModal';
import ResgatarCreditoModal from './components/modals/perfil/ResgatarCreditoModal';
import TermosModal from './components/modals/TermosModal';
import FaleConoscoModal from './components/modals/FaleConoscoModal';

function AppContent() {
    const { isLoading, currentView, activeModal, closeModal } = useApp();

    const renderView = () => {
        switch (currentView) {
            case 'agendar':
                return <AgendarView />;
            case 'historico':
                return <HistoricoView />;
            case 'planos':
                return <PlanosView />;
            case 'perfil':
                return <PerfilView />;
            default:
                return <AgendarView />;
        }
    };

    const renderModal = () => {
        if (!activeModal) return null;

        const modalComponents = {
            // Auth
            login: LoginModal,
            cadastro: CadastroModal,
            esqueciSenha: EsqueciSenhaModal,
            verificarCodigo: VerificarCodigoModal,
            redefinirSenha: RedefinirSenhaModal,
            bemVindo: BemVindoModal,
            // Agendamento
            unidades: UnidadesModal,
            barbeiros: BarbeirosModal,
            servicos: ServicosModal,
            calendario: CalendarioModal,
            resumo: ResumoModal,
            sucesso: SucessoModal,
            // Histórico
            detalhesAgendamento: DetalhesAgendamentoModal,
            remarcar: RemarcarModal,
            cancelar: CancelarModal,
            avaliacao: AvaliacaoModal,
            // Planos
            assinatura: AssinaturaModal,
            beneficios: BeneficiosModal,
            pagamentos: PagamentosModal,
            gerenciarAssinatura: GerenciarAssinaturaModal,
            mudarPlano: MudarPlanoModal,
            cancelarPlano: CancelarPlanoModal,
            // Perfil
            editarPerfil: EditarPerfilModal,
            trocarFoto: TrocarFotoModal,
            notificacoes: NotificacoesModal,
            alterarPin: AlterarPinModal,
            formasPagamento: FormasPagamentoModal,
            adicionarCartao: AdicionarCartaoModal,
            adicionarPix: AdicionarPixModal,
            indiqueAmigo: IndiqueAmigoModal,
            cashback: CashbackModal,
            resgatarCredito: ResgatarCreditoModal,
            // Gerais
            termos: TermosModal,
            faleConosco: FaleConoscoModal,
        };

        const ModalComponent = modalComponents[activeModal];
        if (!ModalComponent) return null;

        return (
            <Modal onClose={closeModal}>
                <ModalComponent />
            </Modal>
        );
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="app-container">
            <main className="main-content">
                {renderView()}
            </main>
            <Footer />
            {renderModal()}
        </div>
    );
}

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

export default App;
