import React, { useState } from 'react';
import { useBarber } from '../context/BarberContext';

function BarberLoginPage() {
    const { login } = useBarber();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (!result.success) {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center">
                        <i className="fas fa-cut text-black text-3xl"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Portal do Barbeiro</h1>
                    <p className="text-secondary mt-2">VS Barbearia</p>
                </div>

                {/* Login Form */}
                <div className="admin-card p-6">
                    <h2 className="text-xl font-bold text-center mb-6">Entrar</h2>

                    {error && (
                        <div className="bg-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-secondary mb-1 block">E-mail</label>
                            <div className="relative">
                                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-secondary"></i>
                                <input
                                    type="email"
                                    className="form-input pl-11"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-secondary mb-1 block">Senha</label>
                            <div className="relative">
                                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-secondary"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input pl-11 pr-11"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-white"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full py-3"
                            disabled={loading}
                        >
                            {loading ? (
                                <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt mr-2"></i>
                                    Entrar
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="#" className="text-primary text-sm hover:underline">
                            Esqueci minha senha
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-secondary text-sm mt-6">
                    Acesso exclusivo para colaboradores
                </p>
            </div>
        </div>
    );
}

export default BarberLoginPage;
