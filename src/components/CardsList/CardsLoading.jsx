import React from 'react'

const SKELETON_CARDS = 3;

export const CardsLoading = () => {
    return (
        <div className="cards-loading" role="status">
            <span className="visually-hidden">Loading tasks...</span>
            {Array.from({ length: SKELETON_CARDS }, (_, index) => (
                <div key={index} className="card-skeleton" aria-hidden="true">
                    <div className="card-skeleton-circle"></div>
                    <div className="card-skeleton-lines">
                        <div className="card-skeleton-line"></div>
                        <div className="card-skeleton-line card-skeleton-line-short"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}
