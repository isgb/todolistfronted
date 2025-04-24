import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CardTasksContext = createContext();

export const CardTasksProvider = ({ children }) => {
  // Inicializar state para cardsTaks
  const [cardTasksItem, setCardTasksItem] = useState({});

  // Metodo para agregar una card tasks
  const newCardTask = () => {

    // Nueva card tasks
    const newCardTask = {
      title: "New Tasks List",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      tasks: [],
    };

    // Agregar la nueva card tasks en la lista de estas mismas
    setCardTasksItem({
      ...cardTasksItem,
      cardsTasks: [newCardTask, ...cardTasksItem.cardsTasks],
    });
  }

  // Metodo para borrar una card tasks
  const deleteCardTask = (idToDelete) => {
    setCardTasksItem((prevState) => {
      const updatedCardsTasks = prevState.cardsTasks.filter(card => card.id !== idToDelete);
  
      return {
        ...prevState,
        cardsTasks: updatedCardsTasks,
      };
    });
  };
  

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
      const response = await fetch("/data/cardsTasks.json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const initialFormattedData = await formatCardsDataWithIds(data);
      setCardTasksItem(initialFormattedData);
    };

    handleData();
  }, []);

  return (
    <CardTasksContext.Provider value={{ 
        cardTasksItem, 
        setCardTasksItem, 
        newCardTask,
        deleteCardTask 
      }}>
      {children}
    </CardTasksContext.Provider>
  );
};

export const useCardTasksContext = () => {
  const context = useContext(CardTasksContext);
  if (!context) {
    throw new Error("useCardTasksContext must be used within an CardTasksProvider");
  }
  return context;
};
