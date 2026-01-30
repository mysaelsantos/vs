import React from 'react';
import { useApp } from '../../context/AppContext';

function TermosModal() {
    const { closeModal } = useApp();

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Termos de Uso</h2>
            </div>

            <div className="space-y-4 text-sm text-secondary max-h-96 overflow-y-auto pr-2">
                <section>
                    <h3 className="text-white font-semibold mb-2">1. Aceitação dos Termos</h3>
                    <p>
                        Ao usar o aplicativo VS Barbearia, você concorda com estes termos de uso.
                        Se não concordar, por favor não utilize nossos serviços.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-semibold mb-2">2. Serviços</h3>
                    <p>
                        A VS Barbearia oferece serviços de barbearia, incluindo cortes de cabelo,
                        barba e outros tratamentos estéticos masculinos. Os serviços são prestados
                        por profissionais qualificados em nossas unidades.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-semibold mb-2">3. Agendamentos</h3>
                    <p>
                        Os agendamentos realizados pelo aplicativo estão sujeitos à disponibilidade.
                        Cancelamentos devem ser feitos com pelo menos 2 horas de antecedência.
                        Faltas sem aviso prévio podem resultar em restrições de agendamento.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-semibold mb-2">4. Planos de Assinatura</h3>
                    <p>
                        Os planos de assinatura são cobrados mensalmente e renovados automaticamente.
                        Os serviços inclusos no plano não são cumulativos entre períodos.
                        O cancelamento pode ser feito a qualquer momento, sendo efetivo ao final do período vigente.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-semibold mb-2">5. Programa de Indicação</h3>
                    <p>
                        Os créditos de indicação são válidos por 12 meses. Cada indicação bem-sucedida
                        gera 1 crédito para serviço gratuito. É proibido o uso fraudulento do programa.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-semibold mb-2">6. Privacidade</h3>
                    <p>
                        Seus dados pessoais são protegidos conforme a LGPD. Utilizamos suas informações
                        apenas para prestação dos serviços e comunicações relacionadas.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-semibold mb-2">7. Alterações</h3>
                    <p>
                        Reservamo-nos o direito de alterar estes termos a qualquer momento,
                        notificando os usuários através do aplicativo.
                    </p>
                </section>
            </div>

            <button className="btn-primary w-full mt-6" onClick={closeModal}>
                Li e Aceito
            </button>
        </div>
    );
}

export default TermosModal;
