import { createContext, useContext, useEffect, useState } from "react";

const CardTasksContext = createContext();

export const CardTasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState({});

  const newCardTask = () => {
    console.log("entrando")
    const newCardTask = {
      title: "New Tasks List",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      tasks: [],
    };

    setTasks({
      ...tasks,
      cardsTasks: [newCardTask, ...tasks.cardsTasks],
    });
  }

  const deleteCardTask = (index) => {
    const updatedTasks = tasks.cardsTasks.filter((_, i) => i !== index);
    setTasks({ ...tasks, cardsTasks: updatedTasks });
  }

  useEffect(() => {
    const handleData = async () => {
      const response = await fetch("/data/cardsTasks.json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTasks(data);
    };

    handleData();
  }, []);

  return (
    <CardTasksContext.Provider value={{ 
        tasks, 
        setTasks, 
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
