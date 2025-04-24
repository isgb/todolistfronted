import { useCallback, useState } from "react";


export const useHandleIcons = (isCompleted = false) => {

      const [iconCheck, setIconCheck] = useState(isCompleted)

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

      const handleCheckChange = useCallback(() => {
        setIconCheck(prev => !prev);
      }, []);

      return {
        handleChange,
        handleCheckChange,
        iconState,
        iconCheck,
        setIconCheck
      }
}