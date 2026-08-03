const taskStorageKey =
  "zipzip-tasks";


function normalizeTask(
  task,
  index
) {
  if (
    !task ||
    typeof task !== "object" ||
    typeof task.title !== "string" ||
    task.title.trim() === ""
  ) {
    return null;
  }

  const fallbackId =
    Date.now() + index;

  const taskId =
    Number(task.id) || fallbackId;

  return {
    id: taskId,
    createdAt:
      Number(task.createdAt) || taskId,
    title: task.title.trim(),
    category:
      typeof task.category === "string"
        ? task.category
        : "",
    priority:
      typeof task.priority === "string"
        ? task.priority
        : "Low",
    dueDate:
      typeof task.dueDate === "string"
        ? task.dueDate
        : "",
    status:
      typeof task.status === "string"
        ? task.status
        : "todo",
    description:
      typeof task.description === "string"
        ? task.description
        : "",
    archived:
      Boolean(task.archived),
  };
}


export function loadTasks() {
  try {
    const savedTasks =
      localStorage.getItem(
        taskStorageKey
      );

    if (!savedTasks) {
      return [];
    }

    const parsedTasks =
      JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return [];
    }

    return parsedTasks
      .map(normalizeTask)
      .filter(Boolean);
  } catch {
    return [];
  }
}


export function saveTasks(tasks) {
  try {
    localStorage.setItem(
      taskStorageKey,
      JSON.stringify(tasks)
    );

    return true;
  } catch {
    return false;
  }
}
