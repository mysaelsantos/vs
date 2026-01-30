import React, { useEffect, useRef, useState } from 'react';

function Modal({ children, onClose, type = 'bottom', showHandle = true }) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragY, setDragY] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    const modalRef = useRef(null);
    const startY = useRef(0);

    // Prevenir scroll do body quando modal está aberto
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Função para fechar com animação
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300); // Duração da animação
    };

    // Fechar com ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Handle drag para fechar
    const handleDragStart = (e) => {
        setIsDragging(true);
        startY.current = e.touches ? e.touches[0].clientY : e.clientY;
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        const currentY = e.touches ? e.touches[0].clientY : e.clientY;
        const diff = currentY - startY.current;
        if (diff > 0) {
            setDragY(diff);
        }
    };

    const handleDragEnd = () => {
        if (dragY > 100) {
            handleClose();
        }
        setIsDragging(false);
        setDragY(0);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove);
            window.addEventListener('touchend', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, dragY]);

    const modalClasses = {
        bottom: 'modal-content',
        center: 'modal-content center',
        full: 'modal-content full',
    };

    return (
        <div
            className={`modal-overlay ${type === 'center' ? 'center' : ''} ${isClosing ? 'closing' : ''}`}
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className={`${modalClasses[type]} ${isClosing ? 'closing' : ''}`}
                style={{
                    transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
                    transition: isDragging ? 'none' : 'transform 0.3s ease'
                }}
            >
                {/* Handle para arrastar */}
                {showHandle && type === 'bottom' && (
                    <div
                        className="modal-handle-area"
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                    >
                        <div className="modal-handle"></div>
                    </div>
                )}

                {/* Conteúdo do modal */}
                <div className="modal-inner-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
