import { createContext, useContext, useState } from "react";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {

  const [tasks,setTasks] = useState({})


  return (
    <TasksContext.Provider value={{tasks,setTasks}}>
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