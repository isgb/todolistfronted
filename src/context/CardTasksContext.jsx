import { createContext, useContext, useEffect, useState } from "react";
import {
  getListCardTasks,
  saveCardTasksToLocalStorage,
} from "../helpers/ListCardTasks";
import { v4 as uuidv4 } from "uuid";

const CardTasksContext = createContext();

export const CardTasksProvider = ({ children }) => {
  // Inicializar state para cardsTaks
  const [cardTasksItem, setCardTasksItem] = useState({});

  const newCardTask = async () => {
    try {
      const newCardTask = {
        title: "New Tasks List",
        description: "Write a description",
        tasks: [],
      };

      // Crea la nueva lista con la card recién agregada
      const updatedCardTasks = {
        ...cardTasksItem,
        cardsTasks: [
          {
            ...newCardTask,
            id: uuidv4(),
          },
          ...(Array.isArray(cardTasksItem.cardsTasks)
            ? cardTasksItem.cardsTasks
            : []),
        ],
      };

      // Actualiza el estado (si usas React)
      setCardTasksItem(updatedCardTasks);

      // Guarda en localStorage
      await saveCardTasksToLocalStorage(updatedCardTasks);
    } catch (error) {
      throw new Error("Error al crear la card: " + error.message);
    }
  };

  const handleDeleteCarTask = (prevState, idToDelete) => {
    const updatedCardsTasks = prevState.cardsTasks.filter(
      (card) => card.id !== idToDelete
    );

    return {
      ...prevState,
      cardsTasks: updatedCardsTasks,
    };
  };

  // Metodo para borrar una card tasks
  const deleteCardTask = async (idToDelete) => {
    try {
      setCardTasksItem((prevState) => {
        const updatedState = handleDeleteCarTask(prevState, idToDelete);
        saveCardTasksToLocalStorage(updatedState); // Guarda en localStorage
        return updatedState;
      });
    } catch (error) {
      console.error("Error al eliminar la card task: ", error);
    }
  };

  const updateCardTitle = async (newTitle, cardId) => {
    try {
      const updatedCardsTasks = await cardTasksItem.cardsTasks.map((card) =>
        card.id === cardId ? { ...card, title: newTitle } : card
      );
  
      return {
        ...cardTasksItem,
        cardsTasks: updatedCardsTasks,
      };
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeCardTaskTitle = async (titleModified, cardId) => {
    // Actualizar titulo en cardtasks
    const updatedCardsTasks = await updateCardTitle(titleModified, cardId);

    // Actualizar estado
    setCardTasksItem(updatedCardsTasks);

    // Actualizar lista de cardstasks en localstorage
    await saveCardTasksToLocalStorage(updatedCardsTasks);
  };

  const handleChangeCardTaskDescription = async (descriptionModified,index) => {

    const updatedCardsTasks = cardTasksItem.cardsTasks.map((card) =>
      card.id === index ? { ...card, description: descriptionModified } : card
    );

    //Actualizar estado
    setCardTasksItem({
      ...cardTasksItem,
      cardsTasks: updatedCardsTasks,
    });
    
    // Actualizar lista de cardstasks en localstorage
    await saveCardTasksToLocalStorage(updatedCardsTasks);
  };

  useEffect(() => {
    // Obtener la lista de card tasks desde el backend
    const handleData = async () => {
      const data = await getListCardTasks();
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
        handleChangeCardTaskDescription,
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
