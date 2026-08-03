// file yg bertugas untuk mengambil element html


export const dom = {
  /* Theme */
  themeToggleButton:
    document.querySelector(
      "#themeToggleButton"
    ),

  themeToggleIcon:
    document.querySelector(
      "#themeToggleButton i"
    ),

  themeToggleText:
    document.querySelector(
      "#themeToggleButton span"
    ),

  /* Modal */
  taskModal:
    document.querySelector("#taskModal"),

  openTaskModalButton:
    document.querySelector(
      "#openTaskModalButton"
    ),

  openQuickTaskModalButton:
    document.querySelector(
      "#openQuickTaskModalButton"
    ),

  quickAddSection:
    document.querySelector(
      ".quick-add-section"
    ),

  closeTaskModalButton:
    document.querySelector(
      "#closeTaskModalButton"
    ),

  taskModalOverlay:
    document.querySelector(
      "#taskModalOverlay"
    ),

  cancelTaskButton:
    document.querySelector(
      "#cancelTaskButton"
    ),


  /* Form */
  taskForm:
    document.querySelector("#taskForm"),

  taskTitleInput:
    document.querySelector("#taskTitle"),

  taskTitleError:
    document.querySelector(
      "#taskTitleError"
    ),

  taskCategoryInput:
    document.querySelector(
      "#taskCategory"
    ),

  taskPriorityInput:
    document.querySelector(
      "#taskPriority"
    ),

  taskDueDateInput:
    document.querySelector(
      "#taskDueDate"
    ),

  taskStatusInput:
    document.querySelector(
      "#taskStatus"
    ),

  taskDescriptionInput:
    document.querySelector(
      "#taskDescription"
    ),


  /* Task list */
  taskList:
    document.querySelector("#taskList"),

  taskEmptyState:
    document.querySelector(
      "#taskEmptyState"
    ),


  /* Pagination */
  taskCountText:
    document.querySelector(
      "#taskCountText"
    ),

  taskPagination:
    document.querySelector(
      "#taskPagination"
    ),

  paginationNumbers:
    document.querySelector(
      "#paginationNumbers"
    ),

  prevPageButton:
    document.querySelector(
      "#prevPageButton"
    ),

  nextPageButton:
    document.querySelector(
      "#nextPageButton"
    ),


  /* Filter tabs */
  taskFilterTabs:
    document.querySelector(
      "#taskFilterTabs"
    ),

  taskToolbar:
    document.querySelector(
      ".task-toolbar"
    ),


  /* Filter dropdown */
  filterTaskButton:
    document.querySelector(
      "#filterTaskButton"
    ),

  filterMenu:
    document.querySelector(
      "#filterMenu"
    ),

  filterCategorySelect:
    document.querySelector(
      "#filterCategorySelect"
    ),

  filterPrioritySelect:
    document.querySelector(
      "#filterPrioritySelect"
    ),

  applyFilterButton:
    document.querySelector(
      "#applyFilterButton"
    ),

  resetFilterButton:
    document.querySelector(
      "#resetFilterButton"
    ),


  /* Sort dropdown */
  sortTaskButton:
    document.querySelector(
      "#sortTaskButton"
    ),

  sortMenu:
    document.querySelector(
      "#sortMenu"
    ),

  sortTaskSelect:
    document.querySelector(
      "#sortTaskSelect"
    ),

  applySortButton:
    document.querySelector(
      "#applySortButton"
    ),

  resetSortButton:
    document.querySelector(
      "#resetSortButton"
    ),


  /* Analytics */
  totalTasksCount:
    document.querySelector(
      "#totalTasksCount"
    ),

  totalTasksInfo:
    document.querySelector(
      "#totalTasksInfo"
    ),

  completedTasksCount:
    document.querySelector(
      "#completedTasksCount"
    ),

  completedTasksInfo:
    document.querySelector(
      "#completedTasksInfo"
    ),

  inProgressTasksCount:
    document.querySelector(
      "#inProgressTasksCount"
    ),

  inProgressTasksInfo:
    document.querySelector(
      "#inProgressTasksInfo"
    ),

  overdueTasksCount:
    document.querySelector(
      "#overdueTasksCount"
    ),

  overdueTasksInfo:
    document.querySelector(
      "#overdueTasksInfo"
    ),

      /* Calendar */
  previousMonthButton:
    document.querySelector(
      "#previousMonthButton"
    ),

  nextMonthButton:
    document.querySelector(
      "#nextMonthButton"
    ),

  calendarMonthLabel:
    document.querySelector(
      "#calendarMonthLabel"
    ),

  calendarDays:
    document.querySelector(
      "#calendarDays"
    ),


  /* Upcoming deadlines */
  deadlineList:
    document.querySelector(
      "#deadlineList"
    ),

  deadlineEmptyState:
    document.querySelector(
      "#deadlineEmptyState"
    ),


    /* Search */
searchTaskForm:
  document.querySelector(
    "#searchTaskForm"
  ),

searchTaskInput:
  document.querySelector(
    "#searchTaskInput"
  ),


  taskModalTitle:
  document.querySelector(
    "#taskModalTitle"
  ),

submitTaskButton:
  document.querySelector(
    "#submitTaskButton"
  ),

submitTaskButtonText:
  document.querySelector(
    "#submitTaskButton span"
  ),


  /* View navigation */

sidebarMenu:
  document.querySelector(
    "#sidebarMenu"
  ),


sidebarMenuItems:
  document.querySelectorAll(
    "#sidebarMenu [data-view]"
  ),


dashboardLayout:
  document.querySelector(
    "#dashboardLayout"
  ),


dashboardContent:
  document.querySelector(
    "#dashboardContent"
  ),


dashboardAside:
  document.querySelector(
    "#dashboardAside"
  ),


welcomeSection:
  document.querySelector(
    "#welcomeSection"
  ),


viewTitle:
  document.querySelector(
    "#viewTitle"
  ),


viewSubtitle:
  document.querySelector(
    "#viewSubtitle"
  ),


statisticsSection:
  document.querySelector(
    "#statisticsSection"
  ),


tasksPanel:
  document.querySelector(
    "#tasksPanel"
  ),


calendarWidget:
  document.querySelector(
    "#calendarWidget"
  ),


upcomingDeadlinesWidget:
  document.querySelector(
    "#upcomingDeadlineWidget"
  ),

calendarFullView:
document.querySelector(
  "#calendarFullView"
),

calendarFullDays:
document.querySelector(
  "#calendarPageDays"
),

calendarFullMonthLabel:
document.querySelector(
  "#calendarPageMonthLabel"
),

calendarFullPreviousButton:
document.querySelector(
 "#calendarPagePreviousButton"
),


calendarFullNextButton:
document.querySelector(
 "#calendarPageNextButton"
),

calendarDateDetails:
document.querySelector(
  "#calendarDateDetails"
),

calendarFullDateDetails:
document.querySelector(
  "#calendarPageDateDetails"
),
};
