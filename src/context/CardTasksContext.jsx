import { createContext, useContext, useEffect, useState } from "react";
import { createCardTask, deleteCardTaskRequest, getListCardTasks, updateCardTask } from "../api/cardtasks";

const CardTasksContext = createContext();

export const CardTasksProvider = ({ children }) => {
  
  // Inicializar state para cardsTaks
  const [cardTasksItem, setCardTasksItem] = useState({});

  // Metodo para agregar una card tasks
  const newCardTask = async () => {
    try {
      // Nueva card tasks
      const newCardTask = {
        title: "New Tasks List",
        description: "Write a description",
        tasks: [],
      };

      // Crear la card tasks en el backend
      const resp = await createCardTask(newCardTask);

      // Agregar la nueva card tasks en la lista de estas mismas
      if (resp.status === 200) {
        setCardTasksItem({
          ...cardTasksItem,
          cardsTasks: [
            {
              ...newCardTask,
              id: resp.data.cardtasks._id,
            },
            ...cardTasksItem.cardsTasks,
          ],
        });
      }

    } catch (error) {
      throw new Error("Error al crear la card: ", error);
    }
  };

  // Metodo para borrar una card tasks
  const deleteCardTask = async (idToDelete) => {
    try {
      const respDelete = await deleteCardTaskRequest(idToDelete);

      if (respDelete.status === 200) {
        setCardTasksItem((prevState) => {
          const updatedCardsTasks = prevState.cardsTasks.filter(
            (card) => card.id !== idToDelete
          );

          return {
            ...prevState,
            cardsTasks: updatedCardsTasks,
          };
        });
      }
      else {
        console.log("Error al eliminar la card task: ", respDelete);
      }

    } catch (error) {
      console.error("Error al eliminar la card task: ", error);
    }
  };

const handleChangeCardTaskTitle = async (titleModified, index) => {
  try {
    // Encontrar la tarjeta actualizada
    const updatedCard = cardTasksItem.cardsTasks.find((card) => card.id === index);

    if (!updatedCard) {
      console.error("No se encontró la tarjeta con el índice proporcionado.");
      return;
    }

    // Actualizar título y conservar la descripción existente
    const updatedData = { 
      title: titleModified, 
      description: updatedCard.description 
    };

    // Actualizar el estado local
    const updatedCardsTasks = cardTasksItem.cardsTasks.map((card) =>
      card.id === index ? { ...card, ...updatedData } : card
    );

    setCardTasksItem({
      ...cardTasksItem,
      cardsTasks: updatedCardsTasks,
    });

    // Enviar la actualización al backend
    await updateCardTask(index, updatedData);

    console.log("Título actualizado exitosamente");
  } catch (error) {
    console.error("Error al actualizar el título:", error);
  }
};

const handleChangeCardTaskDescription = async (descriptionModified, index) => {
  try {

    // Encontrar la tarjeta actualizada
    const updatedCard = cardTasksItem.cardsTasks.find((card) => card.id === index);

    if (!updatedCard) {
      console.error("No se encontró la tarjeta con el índice proporcionado.");
      return;
    }

    // Actualizar descripción y conservar el título existente
    const updatedData = { 
      title: updatedCard.title, 
      description: descriptionModified 
    };

    // Actualizar el estado local
    const updatedCardsTasks = cardTasksItem.cardsTasks.map((card) =>
      card.id === index ? { ...card, ...updatedData } : card
    );

    setCardTasksItem({
      ...cardTasksItem,
      cardsTasks: updatedCardsTasks,
    });

    // Enviar la actualización al backend
    await updateCardTask(index, updatedData);

    console.log("Descripción actualizada exitosamente");
  } catch (error) {
    console.error("Error al actualizar la descripción:", error);
  }
};

  useEffect(() => {

    // Obtener la lista de card tasks desde el backend
    const handleData = async () => {
      const response = await getListCardTasks();
      const data = await response?.data;
      const initialFormattedData = data;
      setCardTasksItem(initialFormattedData);
    };

    handleData();
  }, []);

  return (
    <CardTasksContext.Provider
      value={{
        cardTasksItem,
        setCardTasksItem,
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
