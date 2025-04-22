import { useCallback, useState } from "react";


export const useHandleIcons = () => {

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

      return {
        handleChange,
        iconState
      }
}