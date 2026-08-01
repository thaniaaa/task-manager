import { dom } from "./dom.js";
import { state } from "./state.js";


import {
  getTodayDateString,
  formatDateForDisplay,
} from "./date.js";



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


const DEADLINE_VISIBLE_LIMIT = 3;


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
  function(taskA, taskB) {


    const dateCompare =
      taskA.dueDate.localeCompare(
        taskB.dueDate
      );


    if (dateCompare !== 0) {
      return dateCompare;
    }


    const priorityOrder = {
      High: 1,
      Medium: 2,
      Low: 3,
    };


    return (
      priorityOrder[taskA.priority] -
      priorityOrder[taskB.priority]
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
   * Tidak ada deadline
   */
  if (upcomingTasks.length === 0) {

    dom.deadlineList?.classList.remove(
      "deadline-list--scrollable"
    );

    if (dom.deadlineEmptyState) {

      dom.deadlineEmptyState.hidden =
        false;

      dom.deadlineList.replaceChildren(
        dom.deadlineEmptyState
      );

    }

    return;

  }


  /*
   * Ada deadline
   */
  if (dom.deadlineEmptyState) {

    dom.deadlineEmptyState.hidden =
      true;

  }


  dom.deadlineList.replaceChildren();

  dom.deadlineList.classList.toggle(
    "deadline-list--scrollable",
    upcomingTasks.length >
      DEADLINE_VISIBLE_LIMIT
  );

  dom.deadlineList.setAttribute(
    "aria-label",
    upcomingTasks.length >
      DEADLINE_VISIBLE_LIMIT
      ? "Upcoming deadlines. Scroll to view more."
      : "Upcoming deadlines"
  );


  const deadlineFragment =
    document.createDocumentFragment();


  upcomingTasks.forEach(
    function(task) {

      const deadlineElement =
        createDeadlineElement(task);


      deadlineFragment.append(
        deadlineElement
      );

    }
  );


  dom.deadlineList.append(
    deadlineFragment
  );

}
/* =========================================
   EVENT UPCOMING DEADLINES
========================================= */

export function setupDeadlineEvents() {
  // dom.viewAllDeadlinesButton
  //   .addEventListener(
  //     "click",
  //     function () {
  //       state.showAllDeadlines =

  //       renderUpcomingDeadlines();
  //     }
  //   );
}
