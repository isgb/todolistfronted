import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createCardTask, deleteCardTaskRequest, getListCardTasks, updateCardTask } from "../api/cardtasks";

const CardTasksContext = createContext();

export const CardTasksProvider = ({ children }) => {

  // Inicializar state para cardsTaks
  const [cardTasksItem, setCardTasksItem] = useState({ cardsTasks: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [cardsError, setCardsError] = useState("");

  // Referencia al estado actual para usarla dentro de callbacks estables
  const cardTasksRef = useRef(cardTasksItem);
  cardTasksRef.current = cardTasksItem;

  // Solo se aplica la respuesta de la carga más reciente: una respuesta vieja
  // (p. ej. StrictMode carga dos veces en desarrollo) borraría las cards recién creadas
  const latestLoadIdRef = useRef(0);

  // Obtener la lista de card tasks desde el backend
  const loadCardTasks = useCallback(async () => {
    const loadId = ++latestLoadIdRef.current;
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await getListCardTasks();
      if (loadId !== latestLoadIdRef.current) return;
      setCardTasksItem({ ...response.data, cardsTasks: response.data?.cardsTasks || [] });
    } catch (error) {
      if (loadId !== latestLoadIdRef.current) return;
      console.warn("Error al obtener las card tasks:", error.message);
      setLoadError("Could not load your task lists. Check your connection and try again.");
    } finally {
      if (loadId === latestLoadIdRef.current) setIsLoading(false);
    }
  }, []);

  const updateCards = (updateCardsList) =>
    setCardTasksItem((prevState) => ({
      ...prevState,
      cardsTasks: updateCardsList(prevState.cardsTasks),
    }));

  // Se muestra al instante con un id temporal y se reemplaza por el del servidor.
  // clientKey mantiene la misma key de React para que la card no se vuelva a montar.
  const newCardTask = async () => {
    const temporaryId = `temp-${Date.now()}`;
    const newCardTask = {
      title: "New Tasks List",
      description: "Write a description",
      tasks: [],
    };

    setCardsError("");
    updateCards((cards) => [
      { ...newCardTask, id: temporaryId, clientKey: temporaryId, isSaving: true },
      ...cards,
    ]);

    try {
      const resp = await createCardTask(newCardTask);
      updateCards((cards) =>
        cards.map((card) =>
          card.id === temporaryId ? { ...card, id: resp.data.cardtasks._id, isSaving: false } : card
        )
      );
    } catch (error) {
      console.error("Error al crear la card:", error);
      updateCards((cards) => cards.filter((card) => card.id !== temporaryId));
      setCardsError("Could not create the list. Please try again.");
    }
  };

  // Se oculta al instante; si el servidor falla vuelve a mostrarse con sus tareas
  const deleteCardTask = async (idToDelete) => {
    const cardToDelete = cardTasksRef.current.cardsTasks.find((card) => card.id === idToDelete);
    if (!cardToDelete || cardToDelete.isSaving || cardToDelete.isDeleting) return;

    const setIsDeleting = (isDeleting) =>
      updateCards((cards) =>
        cards.map((card) => (card.id === idToDelete ? { ...card, isDeleting } : card))
      );

    setCardsError("");
    setIsDeleting(true);

    try {
      await deleteCardTaskRequest(idToDelete);
      updateCards((cards) => cards.filter((card) => card.id !== idToDelete));
    } catch (error) {
      console.error("Error al eliminar la card task: ", error);
      setIsDeleting(false);
      setCardsError("Could not delete the list. Please try again.");
    }
  };

  // Actualiza título o descripción de una card (local y backend)
  const updateCardFields = useCallback(async (cardId, changedFields) => {
    const cardToUpdate = cardTasksRef.current.cardsTasks.find((card) => card.id === cardId);

    if (!cardToUpdate) {
      console.error("No se encontró la tarjeta con el id proporcionado.");
      return;
    }

    // El backend exige título y descripción en cada actualización
    const updatedData = {
      title: cardToUpdate.title,
      description: cardToUpdate.description,
      ...changedFields,
    };

    setCardTasksItem((prevState) => ({
      ...prevState,
      cardsTasks: prevState.cardsTasks.map((card) =>
        card.id === cardId ? { ...card, ...changedFields } : card
      ),
    }));

    try {
      await updateCardTask(cardId, updatedData);
    } catch (error) {
      console.error("Error al actualizar la card:", error);
    }
  }, []);

  const handleChangeCardTaskTitle = useCallback(
    (titleModified, cardId) => updateCardFields(cardId, { title: titleModified }),
    [updateCardFields]
  );

  const handleChangeCardTaskDescription = useCallback(
    (descriptionModified, cardId) => updateCardFields(cardId, { description: descriptionModified }),
    [updateCardFields]
  );

  useEffect(() => {
    loadCardTasks();
  }, [loadCardTasks]);

  return (
    <CardTasksContext.Provider
      value={{
        cardTasksItem,
        setCardTasksItem,
        isLoading,
        loadError,
        cardsError,
        loadCardTasks,
        newCardTask,
        deleteCardTask,
        handleChangeCardTaskTitle,
        handleChangeCardTaskDescription
      }}
    >
      {children}
    </CardTasksContext.Provider>
  );
};

export const useCardTasksContext = () => {
  const context = useContext(CardTasksContext);
  if (!context) {
    throw new Error(
      "useCardTasksContext must be used within an CardTasksProvider"
    );
  }
  return context;
};
