import React, { useEffect, useRef, useState } from 'react';

function Modal({ children, onClose, type = 'bottom', showHandle = true }) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragY, setDragY] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    const [closingFromDrag, setClosingFromDrag] = useState(false);
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
    const handleClose = (fromDrag = false) => {
        if (fromDrag) {
            // Se fechando por drag, não reseta a posição - continua deslizando
            setClosingFromDrag(true);
        }
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300); // Duração da animação
    };

    // Fechar com ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                handleClose(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose(false);
        }
    };

    // Handle drag para fechar
    const handleDragStart = (e) => {
        if (isClosing) return;
        setIsDragging(true);
        startY.current = e.touches ? e.touches[0].clientY : e.clientY;
    };

    const handleDragMove = (e) => {
        if (!isDragging || isClosing) return;
        const currentY = e.touches ? e.touches[0].clientY : e.clientY;
        const diff = currentY - startY.current;
        if (diff > 0) {
            setDragY(diff);
        }
    };

    const handleDragEnd = () => {
        if (isClosing) return;

        if (dragY > 100) {
            // Fecha continuando o movimento
            handleClose(true);
        } else {
            // Não fechou, volta para posição inicial
            setIsDragging(false);
            setDragY(0);
        }
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
    }, [isDragging, dragY, isClosing]);

    const modalClasses = {
        bottom: 'modal-content',
        center: 'modal-content center',
        full: 'modal-content full',
    };

    // Determinar o estilo do modal
    const getModalStyle = () => {
        if (closingFromDrag && isClosing) {
            // Quando fecha por drag, continua do ponto atual até sair da tela
            return {
                transform: `translateY(100%)`,
                transition: 'transform 0.3s ease-out'
            };
        } else if (isClosing) {
            // Fechando por clique/ESC - usa a animação CSS
            return {};
        } else if (dragY > 0) {
            // Arrastando
            return {
                transform: `translateY(${dragY}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease'
            };
        }
        return {};
    };

    return (
        <div
            className={`modal-overlay ${type === 'center' ? 'center' : ''} ${isClosing ? 'closing' : ''}`}
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className={`${modalClasses[type]} ${isClosing && !closingFromDrag ? 'closing' : ''}`}
                style={getModalStyle()}
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
