import React from 'react'

export const CardsLoadError = ({ message, onRetry }) => {
    return (
        <div className="status-card" role="alert">
            <p className="status-card-text">{message}</p>
            <button type="button" className="button-secondary" onClick={onRetry}>
                Try again
            </button>
        </div>
    )
}
