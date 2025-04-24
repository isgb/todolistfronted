import { createContext, useContext, useEffect, useState } from "react";

const TasksContext = createContext();

export const TasksContextProvider = ({ children }) => {
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
    <TasksContext.Provider value={{ 
        tasks, 
        setTasks, 
        newCardTask,
        deleteCardTask 
      }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within an TasksContextProvider");
  }
  return context;
};
