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



/* =========================================
   UPDATE PAGE HEADER
========================================= */

function updatePageHeader(
  title,
  subtitle
){

  if (dom.viewTitle) {
    dom.viewTitle.textContent =
      title;
  }


  if (dom.viewSubtitle) {
    dom.viewSubtitle.textContent =
      subtitle;
  }

}



/* =========================================
   UPDATE ACTIVE SIDEBAR
========================================= */

function updateActiveSidebar(
  selectedView
){

  dom.sidebarMenuItems.forEach(
    function(menuItem){

      const isActive =
        menuItem.dataset.view ===
        selectedView;


      menuItem.classList.toggle(
        "sidebar-menu__item--active",
        isActive
      );

    }
  );

}



/* =========================================
   UPDATE FILTER TASK
========================================= */

function updateTaskFilter(
  filterName
){

  state.activeFilter =
    filterName;


  state.currentPage =
    1;



  if(dom.taskFilterTabs){

    const filterButtons =
      dom.taskFilterTabs.querySelectorAll(
        "[data-filter]"
      );


    filterButtons.forEach(
      function(filterButton){

        const isActive =
          filterButton.dataset.filter ===
          filterName;


        filterButton.classList.toggle(
          "filter-tab--active",
          isActive
        );

      }
    );

  }


  renderTaskPagination();

}



/* =========================================
   RESET VIEW LAYOUT
========================================= */

function resetViewLayout(){

    dom.calendarFullView.hidden =
true;

  /*
    Reset class layout
  */

  if(dom.dashboardLayout){

    dom.dashboardLayout.classList.remove(
      "dashboard-layout--single",
      "dashboard-layout--calendar"
    );

  }



  if(dom.tasksPanel){

    dom.tasksPanel.classList.remove(
      "tasks-panel--full"
    );

  }



  /*
    Default visibility
  */


  if(dom.welcomeSection){

    dom.welcomeSection.hidden =
      false;

  }



  if(dom.dashboardContent){

    dom.dashboardContent.hidden =
      false;

  }



  if(dom.dashboardAside){

    dom.dashboardAside.hidden =
      false;

  }



  if(dom.statisticsSection){

    dom.statisticsSection.hidden =
      false;

  }



  if(dom.tasksPanel){

    dom.tasksPanel.hidden =
      false;

  }



  if(dom.openTaskModalButton){

    dom.openTaskModalButton.hidden =
      false;

  }

}



/* =========================================
   DASHBOARD VIEW
========================================= */

function showDashboardView(){

  resetViewLayout();



  updatePageHeader(
    "Welcome back, zipzip!",
    "Add your first task to get started."
  );



  updateTaskFilter(
    "all"
  );



  renderCalendar();

  renderUpcomingDeadlines();

}



/* =========================================
   MY TASKS VIEW
========================================= */

function showTasksView(){

  resetViewLayout();



  /*
    Full width task page
  */

  if(dom.dashboardLayout){

    dom.dashboardLayout.classList.add(
      "dashboard-layout--single"
    );

  }



  if(dom.tasksPanel){

    dom.tasksPanel.classList.add(
      "tasks-panel--full"
    );

  }



  /*
    Hide dashboard component
  */


  if(dom.dashboardAside){

    dom.dashboardAside.hidden =
      true;

  }



  if(dom.statisticsSection){

    dom.statisticsSection.hidden =
      true;

  }



  /*
    Header tetap aktif
  */

  if(dom.welcomeSection){

    dom.welcomeSection.hidden =
      false;

  }



  updatePageHeader(
    "My Tasks",
    "Manage, filter, and organize all your tasks."
  );



  updateTaskFilter(
    "all"
  );

}



/* =========================================
   CALENDAR VIEW
========================================= */
function showCalendarView() {

  resetViewLayout();

  dom.openTaskModalButton.hidden =
false;

  dom.openTaskModalButton.hidden =
true;

  dom.dashboardLayout.classList.add(
    "dashboard-layout--single"
  );


  dom.dashboardAside.hidden =
    true;


  dom.statisticsSection.hidden =
    true;


  dom.tasksPanel.hidden =
    true;


  dom.welcomeSection.hidden =
    false;


  dom.calendarFullView.hidden =
    false;


  updatePageHeader(
    "Calendar",
    "View your schedule and upcoming deadlines."
  );

}
/* =========================================
   COMPLETED VIEW
========================================= */

function showCompletedView(){

  resetViewLayout();



  updatePageHeader(
    "Completed Tasks",
    "Review all tasks you have successfully completed."
  );



  if(dom.statisticsSection){

    dom.statisticsSection.hidden =
      true;

  }



  if(dom.dashboardAside){

    dom.dashboardAside.hidden =
      true;

  }



  if(dom.tasksPanel){

    dom.tasksPanel.hidden =
      false;

  }



  updateTaskFilter(
    "completed"
  );

}



/* =========================================
   ROUTER VIEW
========================================= */

function showSelectedView(
  selectedView
){

  updateActiveSidebar(
    selectedView
  );



  switch(selectedView){


    case "dashboard":

      showDashboardView();

      break;



    case "tasks":

      showTasksView();

      break;



    case "calendar":

      showCalendarView();

      break;



    case "completed":

      showCompletedView();

      break;



    default:

      showDashboardView();

  }

}



/* =========================================
   SIDEBAR EVENT
========================================= */

export function setupViewNavigation(){

  if(!dom.sidebarMenu){

    return;

  }



  dom.sidebarMenu.addEventListener(
    "click",
    function(event){


      const selectedMenu =
        event.target.closest(
          "[data-view]"
        );



      if(!selectedMenu){

        return;

      }



      event.preventDefault();



      const selectedView =
        selectedMenu.dataset.view;



      showSelectedView(
        selectedView
      );


    }
  );

}