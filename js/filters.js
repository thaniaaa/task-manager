// menangani filter tab, dropdown filter dan dropdown sort

import { dom } from "./dom.js";
import { state } from "./state.js";
import {
  getTodayDateString,
} from "./date.js";


/* =========================================
   FILTER TASK
========================================= */

export function getFilteredTaskItems(
  allTaskItems
) {
  const today =
    getTodayDateString();


  return allTaskItems.filter(
    function (taskItem) {
      const taskStatus =
        taskItem.dataset.status;

      const taskCategory =
        taskItem.dataset.category;

      const taskPriority =
        taskItem.dataset.priority;

      const taskDueDate =
        taskItem.dataset.dueDate;

      const taskTitle =
      taskItem.dataset.title || "";

      const taskDescription =
      taskItem.dataset.description || "";

      const taskIsArchived =
        taskItem.dataset.archived ===
          "true";

      const matchesArchiveView =
        state.activeView === "archive"
          ? taskIsArchived
          : !taskIsArchived;


      /*
       * Filter tab.
       */
      let matchesTabFilter = true;


      if (
        state.activeFilter === "today"
      ) {
        matchesTabFilter =
          taskDueDate === today;
      }


      if (
        state.activeFilter ===
        "in-progress"
      ) {
        matchesTabFilter =
          taskStatus === "in-progress";
      }


      if (
        state.activeFilter ===
        "completed"
      ) {
        matchesTabFilter =
          taskStatus === "completed";
      }


      if (
        state.activeFilter === "high"
      ) {
        matchesTabFilter =
          taskPriority === "High";
      }


      /*
       * Filter category.
       */
      const matchesCategory =
        state.selectedCategory ===
          "all" ||
        taskCategory ===
          state.selectedCategory;


      /*
       * Filter priority.
       */
      const matchesPriority =
        state.selectedPriority ===
          "all" ||
        taskPriority ===
          state.selectedPriority;

        const normalizedSearchQuery =
  state.searchQuery
    .trim()
    .toLowerCase();

const searchableText = [
  taskTitle,
  taskCategory,
  taskPriority,
  taskStatus,
  taskDueDate,
  taskDescription,
]
  .join(" ")
  .toLowerCase();

const matchesSearch =
  normalizedSearchQuery === "" ||
  searchableText.includes(
    normalizedSearchQuery
  );

      return (
          matchesArchiveView &&
          matchesTabFilter &&
          matchesCategory &&
        matchesPriority &&
        matchesSearch
      );
    }
  );
}


/* =========================================
   SORT TASK
========================================= */

export function getSortedTaskItems(
  taskItems
) {
  const sortedTaskItems =
    [...taskItems];


  const priorityOrder = {
    High: 3,
    Medium: 2,
    Low: 1,
  };


  sortedTaskItems.sort(
    function (taskA, taskB) {
      const titleA =
        taskA.dataset.title || "";

      const titleB =
        taskB.dataset.title || "";

      const createdAtA =
        Number(
          taskA.dataset.createdAt
        );

      const createdAtB =
        Number(
          taskB.dataset.createdAt
        );

      const dueDateA =
        taskA.dataset.dueDate || "";

      const dueDateB =
        taskB.dataset.dueDate || "";

      const priorityA =
        priorityOrder[
          taskA.dataset.priority
        ] || 0;

      const priorityB =
        priorityOrder[
          taskB.dataset.priority
        ] || 0;


      if (
        state.activeSort === "newest"
      ) {
        return createdAtB - createdAtA;
      }


      if (
        state.activeSort === "oldest"
      ) {
        return createdAtA - createdAtB;
      }


      if (
        state.activeSort ===
        "title-asc"
      ) {
        return titleA.localeCompare(
          titleB
        );
      }


      if (
        state.activeSort ===
        "title-desc"
      ) {
        return titleB.localeCompare(
          titleA
        );
      }


      if (
        state.activeSort === "due-asc"
      ) {
        if (!dueDateA && !dueDateB) {
          return 0;
        }

        if (!dueDateA) {
          return 1;
        }

        if (!dueDateB) {
          return -1;
        }

        return dueDateA.localeCompare(
          dueDateB
        );
      }


      if (
        state.activeSort ===
        "due-desc"
      ) {
        if (!dueDateA && !dueDateB) {
          return 0;
        }

        if (!dueDateA) {
          return 1;
        }

        if (!dueDateB) {
          return -1;
        }

        return dueDateB.localeCompare(
          dueDateA
        );
      }


      if (
        state.activeSort ===
        "priority-high"
      ) {
        return priorityB - priorityA;
      }


      if (
        state.activeSort ===
        "priority-low"
      ) {
        return priorityA - priorityB;
      }


      return 0;
    }
  );


  return sortedTaskItems;
}


/* =========================================
   MENUTUP MENU
========================================= */

function closeFilterMenu() {
  if (!dom.filterMenu) {
    return;
  }

  dom.filterMenu.hidden = true;

  dom.filterTaskButton.setAttribute(
    "aria-expanded",
    "false"
  );
}


function closeSortMenu() {
  if (!dom.sortMenu) {
    return;
  }

  dom.sortMenu.hidden = true;

  dom.sortTaskButton.setAttribute(
    "aria-expanded",
    "false"
  );
}


/* =========================================
   EVENT FILTER DAN SORT
========================================= */

export function setupFilterSortEvents(
  renderTasks
) {
  /*
   * Filter tabs.
   */
  if (dom.taskFilterTabs) {
    const mobileFilterQuery =
      window.matchMedia(
        "(max-width: 680px)"
      );

    let railPointerId = null;
    let railStartX = 0;
    let railStartY = 0;
    let railStartScrollLeft = 0;
    let railDidDrag = false;
    let suppressFilterClickUntil = 0;

    dom.taskFilterTabs.addEventListener(
      "pointerdown",
      function (event) {
        if (!mobileFilterQuery.matches) {
          return;
        }

        railPointerId = event.pointerId;
        railStartX = event.clientX;
        railStartY = event.clientY;
        railStartScrollLeft =
          dom.taskFilterTabs.scrollLeft;
        railDidDrag = false;
      }
    );

    dom.taskFilterTabs.addEventListener(
      "pointermove",
      function (event) {
        if (
          !mobileFilterQuery.matches ||
          event.pointerId !== railPointerId
        ) {
          return;
        }

        const distanceX =
          event.clientX - railStartX;
        const distanceY =
          event.clientY - railStartY;

        if (
          !railDidDrag &&
          Math.abs(distanceX) < 6
        ) {
          return;
        }

        if (
          !railDidDrag &&
          Math.abs(distanceY) >
            Math.abs(distanceX)
        ) {
          railPointerId = null;
          return;
        }

        railDidDrag = true;
        dom.taskFilterTabs.scrollLeft =
          railStartScrollLeft - distanceX;

        event.preventDefault();
      }
    );

    function finishRailDrag(event) {
      if (event.pointerId !== railPointerId) {
        return;
      }

      if (railDidDrag) {
        suppressFilterClickUntil =
          Date.now() + 250;
      }

      railPointerId = null;
      railDidDrag = false;
    }

    dom.taskFilterTabs.addEventListener(
      "pointerup",
      finishRailDrag
    );

    dom.taskFilterTabs.addEventListener(
      "pointercancel",
      finishRailDrag
    );

    dom.taskFilterTabs.addEventListener(
      "click",
      function (event) {
        if (
          mobileFilterQuery.matches &&
          Date.now() <
            suppressFilterClickUntil
        ) {
          event.preventDefault();
          return;
        }

        const filterButton =
          event.target.closest(
            ".filter-tab"
          );

        if (!filterButton) {
          return;
        }


        const filterButtons =
          dom.taskFilterTabs
            .querySelectorAll(
              ".filter-tab"
            );


        filterButtons.forEach(
          function (button) {
            button.classList.remove(
              "filter-tab--active"
            );
            button.setAttribute(
              "aria-pressed",
              "false"
            );
          }
        );


        filterButton.classList.add(
          "filter-tab--active"
        );
        filterButton.setAttribute(
          "aria-pressed",
          "true"
        );

        filterButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });


        state.activeFilter =
          filterButton.dataset.filter;

        state.currentPage = 1;

        renderTasks();
      }
    );
  }


  /*
   * Membuka dropdown filter.
   */
  if (
    dom.filterTaskButton &&
    dom.filterMenu
  ) {
    dom.filterTaskButton.addEventListener(
      "click",
      function () {
        const filterIsOpen =
          !dom.filterMenu.hidden;

        dom.filterMenu.hidden =
          filterIsOpen;

        dom.filterTaskButton.setAttribute(
          "aria-expanded",
          String(!filterIsOpen)
        );

        if (!filterIsOpen) {
          closeSortMenu();
        }
      }
    );
  }


  /*
   * Apply filter.
   */
  if (dom.applyFilterButton) {
    dom.applyFilterButton.addEventListener(
      "click",
      function () {
        state.selectedCategory =
          dom.filterCategorySelect.value;

        state.selectedPriority =
          dom.filterPrioritySelect.value;

        state.currentPage = 1;

        renderTasks();

        closeFilterMenu();
      }
    );
  }


  /*
   * Reset filter.
   */
  if (dom.resetFilterButton) {
    dom.resetFilterButton.addEventListener(
      "click",
      function () {
        state.selectedCategory =
          "all";

        state.selectedPriority =
          "all";

        dom.filterCategorySelect.value =
          "all";

        dom.filterPrioritySelect.value =
          "all";

        state.currentPage = 1;

        renderTasks();

        closeFilterMenu();
      }
    );
  }


  /*
   * Membuka dropdown sort.
   */
  if (
    dom.sortTaskButton &&
    dom.sortMenu
  ) {
    dom.sortTaskButton.addEventListener(
      "click",
      function () {
        const sortIsOpen =
          !dom.sortMenu.hidden;

        dom.sortMenu.hidden =
          sortIsOpen;

        dom.sortTaskButton.setAttribute(
          "aria-expanded",
          String(!sortIsOpen)
        );

        if (!sortIsOpen) {
          closeFilterMenu();
        }
      }
    );
  }


  /*
   * Apply sort.
   */
  if (dom.applySortButton) {
    dom.applySortButton.addEventListener(
      "click",
      function () {
        state.activeSort =
          dom.sortTaskSelect.value;

        state.currentPage = 1;

        renderTasks();

        closeSortMenu();
      }
    );
  }


  /*
   * Reset sort.
   */
  if (dom.resetSortButton) {
    dom.resetSortButton.addEventListener(
      "click",
      function () {
        state.activeSort = "newest";

        dom.sortTaskSelect.value =
          "newest";

        state.currentPage = 1;

        renderTasks();

        closeSortMenu();
      }
    );
  }


  /*
   * Tutup dropdown ketika klik
   * di luar menu.
   */
  document.addEventListener(
    "click",
    function (event) {
      const clickedInsideFilter =
        dom.filterMenu?.contains(
          event.target
        ) ||
        dom.filterTaskButton?.contains(
          event.target
        );

      const clickedInsideSort =
        dom.sortMenu?.contains(
          event.target
        ) ||
        dom.sortTaskButton?.contains(
          event.target
        );


      if (!clickedInsideFilter) {
        closeFilterMenu();
      }

      if (!clickedInsideSort) {
        closeSortMenu();
      }
    }
  );
}
