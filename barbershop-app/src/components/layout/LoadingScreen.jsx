import React from 'react';

function LoadingScreen() {
    return (
        <div className="loading-screen">
            <img
                src="https://i.postimg.cc/5yBSjg1F/Bigode-3.png"
                alt="VS Barbearia"
                className="loader-logo"
            />
            <div className="loader-spinner"></div>
            <p className="mt-6 text-gray-400 text-sm animate-fade-in-delay">
                Carregando sua experiência...
            </p>
        </div>
    );
}

export default LoadingScreen;
