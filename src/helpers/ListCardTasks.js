// Metodo para obtener la lista de cardstaks almacenados en localstorage
export const getListCardTasks = () => {
  const data = localStorage.getItem("cardTasks"); // clave en localStorage

  if (!data) {
    return []; // Si no hay datos, retorna un array vacío
  }

  try {
    const parsedData = JSON.parse(data);

    if (parsedData) {
      return parsedData; // Retorna solo la lista de tarjetas
    } else {
      console.warn("El formato de los datos no es válido.");
      return [];
    }
  } catch (error) {
    console.error("Error al analizar los datos de localStorage:", error);
    return [];
  }
};

// Metodo para alamecenar y actualizar el localstorage de la lista de cardstasks
export const saveCardTasksToLocalStorage = (cardTasksData) => {
  if (!cardTasksData || typeof cardTasksData !== "object") {
    console.warn(
      "Los datos proporcionados no son válidos para guardar en localStorage."
    );
    return;
  }

  try {
    console.log("se guardo")
    localStorage.setItem("cardTasks", JSON.stringify(cardTasksData));
  } catch (error) {
    console.error("Error al guardar en localStorage:", error);
  }
};


// Método para actualizar el localStorage con la nueva lista de tareas
export const updateLocalStorageWithNewTask = async (id, newTask) => {
  try {
    // Obtener los datos actuales de las tareas desde el localStorage
    const storedData = await getListCardTasks();

    // Actualizar las tareas dentro de la carta correspondiente
    const updatedCardTasks = storedData.cardsTasks.map((cardTask) =>
      cardTask.id === id
        ? { ...cardTask, tasks: [newTask, ...cardTask.tasks] }  // Insertamos la nueva tarea en la primera posición
        : cardTask
    );

    // Construir el nuevo objeto con las tareas actualizadas
    const newStoredData = {
      ...storedData,
      cardsTasks: updatedCardTasks,
    };

    // Guardar los cambios en el localStorage
    await saveCardTasksToLocalStorage(newStoredData);
    
  } catch (error) {
    console.error("Error al actualizar el localStorage con la nueva tarea:", error);
    throw new Error("Ocurrió un error al actualizar el localStorage con la nueva tarea");
  }
};
