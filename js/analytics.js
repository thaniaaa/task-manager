// menghitung toal, completed, in progres dan overdue

import { dom } from "./dom.js";
import { state } from "./state.js";
import {
  getTodayDateString,
} from "./date.js";


function setTextContent(
  element,
  value
) {
  if (!element) {
    return;
  }

  element.textContent = value;
}


export function updateTaskAnalytics() {
  const activeTasks =
    state.tasks.filter(
      function (task) {
        return !task.archived;
      }
    );

  const totalTasks =
    activeTasks.length;


  const completedTasks =
    activeTasks.filter(
      function (task) {
        return (
          task.status === "completed"
        );
      }
    );


  const inProgressTasks =
    activeTasks.filter(
      function (task) {
        return (
          task.status === "in-progress"
        );
      }
    );


  const today =
    getTodayDateString();


  const overdueTasks =
    activeTasks.filter(
      function (task) {
        const hasDueDate =
          task.dueDate !== "";

        const dueDateHasPassed =
          task.dueDate < today;

        const isNotCompleted =
          task.status !== "completed";

        return (
          hasDueDate &&
          dueDateHasPassed &&
          isNotCompleted
        );
      }
    );


  const completedPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (
            completedTasks.length /
            totalTasks
          ) * 100
        );


  /*
   * Total Tasks
   */
  setTextContent(
    dom.totalTasksCount,
    totalTasks
  );

  setTextContent(
    dom.totalTasksInfo,
    totalTasks === 0
      ? "No tasks yet"
      : `${totalTasks} total tasks`
  );


  /*
   * Completed
   */
  setTextContent(
    dom.completedTasksCount,
    completedTasks.length
  );

  setTextContent(
    dom.completedTasksInfo,
    `${completedPercentage}% completed`
  );


  /*
   * In Progress
   */
  setTextContent(
    dom.inProgressTasksCount,
    inProgressTasks.length
  );

  setTextContent(
    dom.inProgressTasksInfo,
    inProgressTasks.length === 0
      ? "No ongoing tasks"
      : `${inProgressTasks.length} ongoing`
  );


  /*
   * Overdue
   */
  setTextContent(
    dom.overdueTasksCount,
    overdueTasks.length
  );

  setTextContent(
    dom.overdueTasksInfo,
    overdueTasks.length === 0
      ? "No overdue tasks"
      : "Needs attention"
  );
}
