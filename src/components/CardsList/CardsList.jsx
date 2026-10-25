import React from "react";
import "../../styles/cardtasks.css";
import "react-circular-progressbar/dist/styles.css";
import { CardTasks } from "./CardTasks/CardTasks";
import { CardNoTasksAvaible } from "./CardNoTasksAvaible";
import { CardsLoading } from "./CardsLoading";
import { CardsLoadError } from "./CardsLoadError";
import { useCardTasksContext } from "../../context/CardTasksContext";

export const CardsList = () => {
  const { cardTasksItem, isLoading, loadError, cardsError, loadCardTasks } = useCardTasksContext();

  const renderContent = () => {
    if (isLoading) return <CardsLoading />;
    if (loadError) return <CardsLoadError message={loadError} onRetry={loadCardTasks} />;

    // Las cards que se están borrando siguen montadas (ocultas) por si hay que restaurarlas
    const hasVisibleCards = cardTasksItem.cardsTasks.some((card) => !card.isDeleting);

    return (
      <>
        {!hasVisibleCards && <CardNoTasksAvaible />}
        {cardTasksItem.cardsTasks.map((cardTasks) => (
          <CardTasks
            key={cardTasks.clientKey || cardTasks.id}
            cardTasks={cardTasks}
            indexCard={cardTasks.id}
          />
        ))}
      </>
    );
  };

  return (
    <section className="cards-list" aria-label="Task lists">
      {cardsError && (
        <p className="cards-error" role="alert">{cardsError}</p>
      )}
      {renderContent()}
    </section>
  );
};
