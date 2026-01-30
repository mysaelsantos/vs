import React, { useEffect } from 'react';

function Modal({ children, onClose, type = 'bottom', showHandle = true }) {
    // Prevenir scroll do body quando modal está aberto
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Fechar com ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const modalClasses = {
        bottom: 'modal-content',
        center: 'modal-content center',
        full: 'modal-content full',
    };

    return (
        <div
            className={`modal-overlay ${type === 'center' ? 'center' : ''}`}
            onClick={handleOverlayClick}
        >
            <div className={modalClasses[type]}>
                {showHandle && type === 'bottom' && (
                    <div className="modal-handle"></div>
                )}
                {children}
            </div>
        </div>
    );
}

export default Modal;
