import { dom } from "./dom.js";
import { state } from "./state.js";

import {
  getTodayDateString,
  formatDateForDisplay,
} from "./date.js";


const maximumDeadlinePreview = 3;


const priorityDotClassMap = {
  High:
    "deadline-item__dot--red",

  Medium:
    "deadline-item__dot--yellow",

  Low:
    "deadline-item__dot--purple",
};


const priorityBadgeClassMap = {
  High:
    "priority-badge--high",

  Medium:
    "priority-badge--medium",

  Low:
    "priority-badge--low",
};


/* =========================================
   MENGAMBIL UPCOMING DEADLINES
========================================= */

function getUpcomingDeadlineTasks() {
  const today =
    getTodayDateString();


  return state.tasks
    .filter(
      function (task) {
        const hasDueDate =
          task.dueDate !== "";

        const isTodayOrFuture =
          task.dueDate >= today;

        const isNotCompleted =
          task.status !== "completed";


        return (
          hasDueDate &&
          isTodayOrFuture &&
          isNotCompleted
        );
      }
    )
    .sort(
      function (taskA, taskB) {
        return taskA.dueDate.localeCompare(
          taskB.dueDate
        );
      }
    );
}


/* =========================================
   MEMBUAT DEADLINE ITEM
========================================= */

function createDeadlineElement(task) {
  const deadlineItem =
    document.createElement("article");

  deadlineItem.classList.add(
    "deadline-item"
  );


  /*
   * Dot priority.
   */
  const deadlineDot =
    document.createElement("span");

  deadlineDot.classList.add(
    "deadline-item__dot"
  );


  const dotClass =
    priorityDotClassMap[
      task.priority
    ];

  if (dotClass) {
    deadlineDot.classList.add(
      dotClass
    );
  }


  /*
   * Judul dan tanggal.
   */
  const deadlineContent =
    document.createElement("div");

  deadlineContent.classList.add(
    "deadline-item__content"
  );


  const deadlineTitle =
    document.createElement("strong");

  deadlineTitle.textContent =
    task.title;


  const deadlineDate =
    document.createElement("span");

  deadlineDate.textContent =
    formatDateForDisplay(
      task.dueDate
    );


  deadlineContent.append(
    deadlineTitle,
    deadlineDate
  );


  /*
   * Priority badge.
   */
  const priorityBadge =
    document.createElement("span");

  priorityBadge.classList.add(
    "priority-badge"
  );

  priorityBadge.textContent =
    task.priority;


  const priorityClass =
    priorityBadgeClassMap[
      task.priority
    ];

  if (priorityClass) {
    priorityBadge.classList.add(
      priorityClass
    );
  }


  deadlineItem.append(
    deadlineDot,
    deadlineContent,
    priorityBadge
  );


  return deadlineItem;
}


/* =========================================
   MERENDER UPCOMING DEADLINES
========================================= */

export function renderUpcomingDeadlines() {
  const upcomingTasks =
    getUpcomingDeadlineTasks();


  /*
   * Kondisi tidak memiliki deadline.
   */
  if (upcomingTasks.length === 0) {
    dom.deadlineEmptyState.hidden =
      false;

    dom.deadlineList.replaceChildren(
      dom.deadlineEmptyState
    );

    dom.viewAllDeadlinesButton.hidden =
      true;

    state.showAllDeadlines = false;

    return;
  }


  dom.deadlineEmptyState.hidden =
    true;


  /*
   * Tentukan jumlah yang ditampilkan.
   */
  const visibleTasks =
    state.showAllDeadlines
      ? upcomingTasks
      : upcomingTasks.slice(
          0,
          maximumDeadlinePreview
        );


  dom.deadlineList.replaceChildren();


  visibleTasks.forEach(
    function (task) {
      const deadlineElement =
        createDeadlineElement(task);

      dom.deadlineList.append(
        deadlineElement
      );
    }
  );


  /*
   * Tombol View all hanya muncul
   * jika deadline lebih dari 3.
   */
  const hasMoreDeadlines =
    upcomingTasks.length >
    maximumDeadlinePreview;

  dom.viewAllDeadlinesButton.hidden =
    !hasMoreDeadlines;


  dom.viewAllDeadlinesButton.textContent =
    state.showAllDeadlines
      ? "Show less"
      : "View all";
}


/* =========================================
   EVENT UPCOMING DEADLINES
========================================= */

export function setupDeadlineEvents() {
  dom.viewAllDeadlinesButton
    .addEventListener(
      "click",
      function () {
        state.showAllDeadlines =
          !state.showAllDeadlines;
        renderUpcomingDeadlines();
      }
    );
}