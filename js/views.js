import { dom } from "./dom.js";
import { state } from "./state.js";

import {
  renderTaskPagination,
} from "./pagination.js";

import {
  renderCalendar,
} from "./calendar.js";

import {
  renderUpcomingDeadlines,
} from "./deadlines.js";

import {
  getTodayDateString,
} from "./date.js";


function setElementHidden(
  element,
  isHidden
) {
  if (element) {
    element.hidden = isHidden;
  }
}


function updatePageHeader(
  title,
  subtitle
) {
  if (dom.viewTitle) {
    dom.viewTitle.textContent =
      title;
  }

  if (dom.viewSubtitle) {
    dom.viewSubtitle.textContent =
      subtitle;
  }
}


export function updateDashboardWelcome() {
  if (
    state.activeView !==
    "dashboard"
  ) {
    return;
  }

  const totalTasks =
    state.tasks.length;

  const today =
    getTodayDateString();

  const upcomingDeadlines =
    state.tasks.filter(
      function (task) {
        return (
          task.dueDate &&
          task.dueDate >= today &&
          task.status !==
            "completed"
        );
      }
    ).length;

  if (totalTasks === 0) {
    updatePageHeader(
      "Welcome back, zipzip!",
      "Add your first task to get started."
    );

    return;
  }

  if (totalTasks === 1) {
    updatePageHeader(
      "You’re off to a great start!",
      upcomingDeadlines === 1
        ? "You have 1 task with an upcoming deadline."
        : "You have 1 task to focus on."
    );

    return;
  }

  if (upcomingDeadlines === 0) {
    updatePageHeader(
      "Everything is organized!",
      `You have ${totalTasks} tasks and no upcoming deadlines.`
    );

    return;
  }

  updatePageHeader(
    "Stay ahead of your deadlines!",
    `${totalTasks} tasks total · ${upcomingDeadlines} upcoming deadline${
      upcomingDeadlines === 1
        ? ""
        : "s"
    }.`
  );
}


function updateActiveSidebar(
  selectedView
) {
  dom.sidebarMenuItems.forEach(
    function (menuItem) {
      menuItem.classList.toggle(
        "sidebar-menu__item--active",
        menuItem.dataset.view ===
          selectedView
      );
    }
  );
}


function resetTaskRefinements() {
  state.selectedCategory = "all";
  state.selectedPriority = "all";
  state.searchQuery = "";

  if (dom.filterCategorySelect) {
    dom.filterCategorySelect.value =
      "all";
  }

  if (dom.filterPrioritySelect) {
    dom.filterPrioritySelect.value =
      "all";
  }

  if (dom.searchTaskInput) {
    dom.searchTaskInput.value = "";
  }
}


function updateTaskFilter(
  filterName
) {
  state.activeFilter =
    filterName;

  state.currentPage = 1;

  if (dom.taskFilterTabs) {
    const filterButtons =
      dom.taskFilterTabs.querySelectorAll(
        "[data-filter]"
      );

    filterButtons.forEach(
      function (button) {
        button.classList.toggle(
          "filter-tab--active",
          button.dataset.filter ===
            filterName
        );
      }
    );
  }

  renderTaskPagination();
}


function resetViewLayout() {
  dom.dashboardLayout?.classList.remove(
    "dashboard-layout--single",
    "dashboard-layout--calendar"
  );

  dom.tasksPanel?.classList.remove(
    "tasks-panel--full",
    "tasks-panel--completed"
  );

  setElementHidden(
    dom.welcomeSection,
    false
  );

  setElementHidden(
    dom.statisticsSection,
    false
  );

  setElementHidden(
    dom.tasksPanel,
    false
  );

  setElementHidden(
    dom.dashboardAside,
    false
  );

  setElementHidden(
    dom.calendarFullView,
    true
  );

  setElementHidden(
    dom.openTaskModalButton,
    false
  );

  setElementHidden(
    dom.taskToolbar,
    false
  );

  setElementHidden(
    dom.openQuickTaskModalButton,
    false
  );

  setElementHidden(
    dom.searchTaskForm,
    false
  );
}


function showDashboardView() {
  resetViewLayout();
  resetTaskRefinements();

  updateDashboardWelcome();

  updateTaskFilter("all");
  renderCalendar();
  renderUpcomingDeadlines();
}


function showTasksView() {
  resetViewLayout();
  resetTaskRefinements();

  dom.dashboardLayout?.classList.add(
    "dashboard-layout--single"
  );

  dom.tasksPanel?.classList.add(
    "tasks-panel--full"
  );

  setElementHidden(
    dom.statisticsSection,
    true
  );

  setElementHidden(
    dom.dashboardAside,
    true
  );

  updatePageHeader(
    "My Tasks",
    "Manage, filter, and organize all your tasks."
  );

  updateTaskFilter("all");
}


function showCalendarView() {
  resetViewLayout();

  dom.dashboardLayout?.classList.add(
    "dashboard-layout--single",
    "dashboard-layout--calendar"
  );

  setElementHidden(
    dom.statisticsSection,
    true
  );

  setElementHidden(
    dom.tasksPanel,
    true
  );

  setElementHidden(
    dom.dashboardAside,
    true
  );

  setElementHidden(
    dom.openTaskModalButton,
    true
  );

  setElementHidden(
    dom.calendarFullView,
    false
  );

  setElementHidden(
    dom.searchTaskForm,
    true
  );

  updatePageHeader(
    "Calendar",
    "View tasks by their deadline date."
  );

  renderCalendar();
}


function showCompletedView() {
  resetViewLayout();
  resetTaskRefinements();

  dom.dashboardLayout?.classList.add(
    "dashboard-layout--single"
  );

  dom.tasksPanel?.classList.add(
    "tasks-panel--full",
    "tasks-panel--completed"
  );

  setElementHidden(
    dom.statisticsSection,
    true
  );

  setElementHidden(
    dom.dashboardAside,
    true
  );

  setElementHidden(
    dom.openTaskModalButton,
    true
  );

  setElementHidden(
    dom.taskToolbar,
    true
  );

  setElementHidden(
    dom.openQuickTaskModalButton,
    true
  );

  updatePageHeader(
    "Completed Tasks",
    "Review all tasks you have successfully completed."
  );

  updateTaskFilter("completed");
}


function showSelectedView(
  selectedView
) {
  state.activeView =
    selectedView;

  updateActiveSidebar(
    selectedView
  );

  switch (selectedView) {
    case "tasks":
      showTasksView();
      break;

    case "calendar":
      showCalendarView();
      break;

    case "completed":
      showCompletedView();
      break;

    case "dashboard":
    default:
      showDashboardView();
  }
}


export function setupViewNavigation() {
  if (!dom.sidebarMenu) {
    return;
  }

  dom.sidebarMenu.addEventListener(
    "click",
    function (event) {
      const menuItem =
        event.target.closest(
          "[data-view]"
        );

      if (!menuItem) {
        return;
      }

      event.preventDefault();

      showSelectedView(
        menuItem.dataset.view
      );
    }
  );
}
