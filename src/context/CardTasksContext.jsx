import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createCardTask, getListCardTasks } from "../api/cardtasks";

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
  const deleteCardTask = (idToDelete) => {
    setCardTasksItem((prevState) => {
      const updatedCardsTasks = prevState.cardsTasks.filter(
        (card) => card.id !== idToDelete
      );

      return {
        ...prevState,
        cardsTasks: updatedCardsTasks,
      };
    });
  };

  const handleChangeCardTaskTitle = async (titleModified, index) => {
    const updatedCardsTasks = cardTasksItem.cardsTasks.map((card) =>
      card.id === index ? { ...card, title: titleModified } : card
    );

    setCardTasksItem({
      ...cardTasksItem,
      cardsTasks: updatedCardsTasks,
    });
  }

  const handleChangeCardTaskDescription = async (descriptionModified, index) => {
    const updatedCardsTasks = cardTasksItem.cardsTasks.map((card) =>
      card.id === index ? { ...card, description: descriptionModified } : card
    );

    setCardTasksItem({
      ...cardTasksItem,
      cardsTasks: updatedCardsTasks,
    });
  }

  useEffect(() => {
    const formatCardsDataWithIds = (data) => {
      return {
        cardsTasks: data.cardsTasks.map((card) => ({
          ...card,
          id: uuidv4(),
          tasks: card.tasks.map((task) => ({
            ...task,
            id: uuidv4(),
          })),
        })),
      };
    };

    const handleData = async () => {

      const response = await getListCardTasks();
      console.log("response", response?.data);

      // const response = await fetch("/data/cardsTasks.json", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      const data = await response?.data;
      const initialFormattedData = await formatCardsDataWithIds(data);
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
