import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function AvaliacaoModal() {
    const { modalData, closeModal, rateAppointment, getBarberById } = useApp();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const barber = getBarberById(modalData?.barberId);

    const handleSubmit = async () => {
        if (rating === 0) return;

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        rateAppointment(modalData.id, rating);
        closeModal();
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Avaliar Atendimento</h2>
            </div>

            <div className="text-center mb-6">
                <img
                    src={barber?.image}
                    alt={barber?.name}
                    className="avatar w-20 h-20 mx-auto mb-4"
                />
                <h3 className="font-semibold text-lg">{barber?.name}</h3>
                <p className="text-secondary text-sm">{barber?.role}</p>
            </div>

            {/* Estrelas */}
            <div className="text-center mb-6">
                <p className="text-secondary mb-4">Como foi sua experiência?</p>
                <div className="rating-stars justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className={`rating-star ${star <= (hoverRating || rating) ? 'active' : ''
                                }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            <i className="fas fa-star"></i>
                        </button>
                    ))}
                </div>
                {rating > 0 && (
                    <p className="text-primary mt-2 font-semibold">
                        {rating === 1 && 'Ruim'}
                        {rating === 2 && 'Regular'}
                        {rating === 3 && 'Bom'}
                        {rating === 4 && 'Muito Bom'}
                        {rating === 5 && 'Excelente!'}
                    </p>
                )}
            </div>

            {/* Comentário */}
            <div className="mb-6">
                <label className="text-sm text-secondary mb-2 block">
                    Deixe um comentário (opcional)
                </label>
                <textarea
                    className="form-input h-24 resize-none"
                    placeholder="Conte como foi sua experiência..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>
            </div>

            {/* Botão */}
            <button
                className="btn-primary w-full flex items-center justify-center"
                onClick={handleSubmit}
                disabled={rating === 0 || loading}
            >
                {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                ) : (
                    <>
                        <span>Enviar Avaliação</span>
                        <i className="fas fa-paper-plane ml-2"></i>
                    </>
                )}
            </button>
        </div>
    );
}

export default AvaliacaoModal;
