import {
  setupModalEvents,
} from "./modal.js";

import {
  setupTaskEvents,
} from "./tasks.js";

import {
  setupPaginationEvents,
  renderTaskPagination,
} from "./pagination.js";

import {
  setupFilterSortEvents,
} from "./filters.js";

import {
  updateTaskAnalytics,
} from "./analytics.js";

import {
  setupCalendarEvents,
  renderCalendar,
} from "./calendar.js";

import {
  setupDeadlineEvents,
  renderUpcomingDeadlines,
} from "./deadlines.js";

import {
  setupSearchEvents,
} from "./search.js";

import {
  setupViewNavigation,
} from "./views.js";

import {
  setupTheme,
} from "./theme.js";

import {
  state,
} from "./state.js";

import {
  createTaskElement,
} from "./tasks.js";

import {
  loadTasks,
} from "./storage.js";

import {
  dom,
} from "./dom.js";


function restoreSavedTasks() {
  const savedTasks =
    loadTasks();

  state.tasks.push(
    ...savedTasks
  );

  savedTasks.forEach(
    function (task) {
      dom.taskList.append(
        createTaskElement(task)
      );
    }
  );
}

/* =========================================
   MEMASANG EVENT
========================================= */
restoreSavedTasks();

setupTheme();

setupViewNavigation();

setupModalEvents();

setupTaskEvents();

setupPaginationEvents();

setupFilterSortEvents(
  renderTaskPagination
);

setupSearchEvents(
  renderTaskPagination
);

setupCalendarEvents();

setupDeadlineEvents();


/* =========================================
   TAMPILAN AWAL
========================================= */

updateTaskAnalytics();

renderTaskPagination();

renderCalendar();

renderUpcomingDeadlines();
