// Datos de prueba con la misma forma que devuelve el backend real
export const initialCardsTasks = [
  {
    id: "card-1",
    title: "Sprint planning",
    description: "Tasks to prepare the next sprint with the team.",
    tasks: [
      { _id: "task-1", cardTasksId: "card-1", description: "Review backlog priorities", isCompleted: true },
      { _id: "task-2", cardTasksId: "card-1", description: "Estimate user stories", isCompleted: true },
      { _id: "task-3", cardTasksId: "card-1", description: "Define sprint goal", isCompleted: false },
      { _id: "task-4", cardTasksId: "card-1", description: "Book the planning meeting", isCompleted: false },
    ],
  },
  {
    id: "card-2",
    title: "Groceries",
    description: "Weekly shopping list for the house.",
    tasks: [
      { _id: "task-5", cardTasksId: "card-2", description: "Coffee beans", isCompleted: false },
      { _id: "task-6", cardTasksId: "card-2", description: "Oat milk", isCompleted: true },
      { _id: "task-7", cardTasksId: "card-2", description: "Whole wheat bread", isCompleted: false },
    ],
  },
  {
    id: "card-3",
    title: "Portfolio website",
    description: "Pending items before publishing the new portfolio.",
    tasks: [],
  },
];
