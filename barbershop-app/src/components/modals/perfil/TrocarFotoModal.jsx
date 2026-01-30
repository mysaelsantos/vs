import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function TrocarFotoModal() {
    const { userInfo, updateUserInfo, closeModal } = useApp();
    const [loading, setLoading] = useState(false);

    const avatarOptions = [
        'https://i.pravatar.cc/150?img=1',
        'https://i.pravatar.cc/150?img=3',
        'https://i.pravatar.cc/150?img=8',
        'https://i.pravatar.cc/150?img=12',
        'https://i.pravatar.cc/150?img=15',
        'https://i.pravatar.cc/150?img=33',
        'https://i.pravatar.cc/150?img=53',
        'https://i.pravatar.cc/150?img=60',
    ];

    const handleSelect = async (url) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateUserInfo({ profilePic: url });
        closeModal();
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Trocar Foto</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {/* Foto atual */}
            <div className="text-center mb-6">
                <img
                    src={userInfo.profilePic}
                    alt="Foto atual"
                    className="avatar w-24 h-24 mx-auto"
                />
                <p className="text-secondary text-sm mt-2">Foto atual</p>
            </div>

            {/* Opções de avatar */}
            <h3 className="font-semibold mb-3">Escolha um avatar</h3>
            <div className="grid grid-cols-4 gap-3 mb-6">
                {avatarOptions.map((url, idx) => (
                    <button
                        key={idx}
                        className={`aspect-square rounded-full overflow-hidden border-2 transition-all ${userInfo.profilePic === url ? 'border-primary' : 'border-transparent'
                            }`}
                        onClick={() => handleSelect(url)}
                        disabled={loading}
                    >
                        <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>

            {loading && (
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-primary text-2xl"></i>
                </div>
            )}

            {/* Upload (simulado) */}
            <button className="btn-outline w-full">
                <i className="fas fa-camera mr-2"></i>
                Fazer Upload de Foto
            </button>
        </div>
    );
}

export default TrocarFotoModal;
