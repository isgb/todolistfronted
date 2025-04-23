import { createContext, useContext, useEffect, useState } from "react";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
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
    <TasksContext.Provider value={{ tasks, setTasks, newCardTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within an TasksProvider");
  }
  return context;
};
