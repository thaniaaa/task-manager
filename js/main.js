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

/* =========================================
   MEMASANG EVENT
========================================= */
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
