import { createContext, useCallback, useContext, useState } from "react";

const IconContext = createContext();

export const IconProvider = ({ children }) => {

  const [iconState, setIconState] = useState({
    showTrashIcon: false,
    showIconAngle: false,
  });

  const handleChange = useCallback(() => {
    setIconState((prev) => ({
      showIconAngle: !prev.showIconAngle,
      showTrashIcon: !prev.showTrashIcon,
    }));
  }, []);

  return (
    <IconContext.Provider value={{iconState, handleChange}}>
        {children}
    </IconContext.Provider>
   );
};

export const useIconContext = () => {
  const context = useContext(IconContext);
  if (!context) {
    throw new Error("useIconContext must be used within an IconProvider");
  }
  return context;
};