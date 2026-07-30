import { dom } from "./dom.js";
import { state } from "./state.js";


import {
  openAddTaskModal
} from "./modal.js";

import {
  formatDateForDisplay,
  formatDateToString,
  getTodayDateString,
} from "./date.js";


function getTasksForDate(
  dateString
) {
  return state.tasks.filter(
    function (task) {
      return (
        task.dueDate ===
        dateString
      );
    }
  );
}


function dateHasTask(
  dateString
) {
  return (
    getTasksForDate(
      dateString
    ).length > 0
  );
}


function updateCalendarLabel() {
  const activeMonth =
    new Date(
      state.calendarYear,
      state.calendarMonth,
      1
    );

  const label =
    new Intl.DateTimeFormat(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    ).format(activeMonth);

  if (dom.calendarMonthLabel) {
    dom.calendarMonthLabel.textContent =
      label;
  }

  if (dom.calendarFullMonthLabel) {
    dom.calendarFullMonthLabel.textContent =
      label;
  }
}


function changeCalendarMonth(
  monthDifference
) {
  const newMonth =
    new Date(
      state.calendarYear,
      state.calendarMonth +
        monthDifference,
      1
    );

  state.calendarYear =
    newMonth.getFullYear();

  state.calendarMonth =
    newMonth.getMonth();

  state.selectedCalendarDate = "";

  renderCalendar();
  
}

function selectCalendarDate(date) {

  const dateString =
    formatDateToString(date);


  state.calendarYear =
    date.getFullYear();

  state.calendarMonth =
    date.getMonth();


  state.selectedCalendarDate =
    state.selectedCalendarDate === dateString
      ? ""
      : dateString;


  renderCalendar();
}


function createCalendarDay(
  date
) {
  const dateString =
    formatDateToString(date);

  const isToday =
    dateString ===
    getTodayDateString();

  const isSelected =
    dateString ===
    state.selectedCalendarDate;

  const isOutsideMonth =
    date.getMonth() !==
      state.calendarMonth ||
    date.getFullYear() !==
      state.calendarYear;

  const tasksForDate =
    getTasksForDate(dateString);

  const button =
    document.createElement(
      "button"
    );

  button.type = "button";
  button.classList.add(
    "calendar-day"
  );

  button.textContent =
    date.getDate();

  button.dataset.date =
    dateString;

  button.setAttribute(
    "aria-label",
    tasksForDate.length > 0
      ? `${formatDateForDisplay(
          dateString
        )}, ${tasksForDate.length} task${
          tasksForDate.length === 1
            ? ""
            : "s"
        } due`
      : formatDateForDisplay(
          dateString
        )
  );

  button.setAttribute(
    "aria-pressed",
    String(isSelected)
  );

  button.classList.toggle(
    "calendar-day--muted",
    isOutsideMonth
  );

  button.classList.toggle(
    "calendar-day--active",
    isToday
  );

  button.classList.toggle(
    "calendar-day--selected",
    isSelected
  );

  button.classList.toggle(
    "calendar-day--has-task",
    dateHasTask(dateString)
  );

  button.addEventListener(
    "click",
    function () {
      selectCalendarDate(date);
    }
  );

  return button;
}


function generateCalendarDays() {
  const firstDay =
    new Date(
      state.calendarYear,
      state.calendarMonth,
      1
    );

  const firstDayIndex =
    (
      firstDay.getDay() + 6
    ) % 7;

  const startDate =
    new Date(
      state.calendarYear,
      state.calendarMonth,
      1 - firstDayIndex
    );

  const daysInMonth =
    new Date(
      state.calendarYear,
      state.calendarMonth + 1,
      0
    ).getDate();

  const totalDays =
    Math.ceil(
      (
        firstDayIndex +
        daysInMonth
      ) / 7
    ) * 7;

  const days = [];

  for (
    let index = 0;
    index < totalDays;
    index++
  ) {
    const date =
      new Date(startDate);

    date.setDate(
      startDate.getDate() +
        index
    );

    days.push(
      createCalendarDay(date)
    );
  }

  return days;
}

function createDateTaskElement(task) {

  const item =
    document.createElement(
      "article"
    );


  item.classList.add(
    "calendar-date-task"
  );


  const content =
    document.createElement(
      "div"
    );


  const title =
    document.createElement(
      "strong"
    );


  title.textContent =
    task.title;


  const meta =
    document.createElement(
      "span"
    );


  meta.textContent =
    `${task.category || "Uncategorized"} · ${
      task.priority || "No priority"
    }`;


  content.append(
    title,
    meta
  );


  const status =
    document.createElement(
      "span"
    );


  status.classList.add(
    "calendar-date-task__status"
  );


  status.textContent =
    task.status === "completed"
      ? "Completed"
      : task.status === "in-progress"
        ? "In Progress"
        : "To Do";


  item.append(
    content,
    status
  );


  return item;
}

function createAddTaskButton(
  dateString
) {

  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";


  button.classList.add(
    "primary-button",
    "calendar-add-task-button"
  );


  button.innerHTML =
    `
    <i class="bi bi-plus"></i>
    Add Task
    `;


  button.addEventListener(
    "click",
    function () {

      //tutup popup detail calendar
      state.selectedCalendarDate = "";

      //refresh calendar agar pop up hilang
      renderCalendar();

      // buka modal task
      openAddTaskModal(
        dateString
      );

    }
  );


  return button;

 
}


function renderDateDetails(
  container,
  daysContainer
) {

  if (!container) {
    return;
  }


  const selectedDate =
    state.selectedCalendarDate;


  container.replaceChildren();


  container.hidden =
    selectedDate === "";


  if (selectedDate === "") {
    return;
  }



  const heading =
    document.createElement("h3");


  heading.textContent =
    `Tasks due ${formatDateForDisplay(
      selectedDate
    )}`;



  const header =
    document.createElement("div");


  header.classList.add(
    "calendar-date-details__header"
  );



  const closeButton =
    document.createElement("button");


  closeButton.type =
    "button";


  closeButton.classList.add(
    "calendar-date-details__close"
  );


  closeButton.innerHTML =
    '<i class="bi bi-x-lg"></i>';



  closeButton.addEventListener(
    "click",
    function () {

      state.selectedCalendarDate = "";

      renderCalendar();

    }
  );


  header.append(
    heading,
    closeButton
  );



  const tasks =
    getTasksForDate(
      selectedDate
    );



  /*
    Jika tanggal belum memiliki task
  */
if (tasks.length === 0) {


  const emptyMessage =
    document.createElement(
      "p"
    );


  emptyMessage.textContent =
    "No tasks for this date";


  container.append(
    header,
    emptyMessage,
    createAddTaskButton(
      selectedDate
    )
  );


  positionDateDetails(
    container,
    daysContainer
  );


  return;

}



  /*
    Jika tanggal memiliki task
  */

  container.append(
    header
  );


  tasks.forEach(
    function(task){

      container.append(
        createDateTaskElement(task)
      );
    }
  );

  //tombol hanya sekali
  container.append(
    createAddTaskButton(
      selectedDate
    )
  );


  positionDateDetails(
    container,
    daysContainer
  );

}

function positionDateDetails(
  container,
  daysContainer
) {
  const selectedDay =
    daysContainer?.querySelector(
      `[data-date="${state.selectedCalendarDate}"]`
    );

  const calendar =
    container.closest(
      ".calendar-widget, .calendar-large"
    );

  if (
    !selectedDay ||
    !calendar ||
    calendar.offsetParent === null
  ) {
    return;
  }

  const calendarRect =
    calendar.getBoundingClientRect();

  const dayRect =
    selectedDay.getBoundingClientRect();

  const popupWidth =
    Math.min(
      320,
      calendarRect.width - 32
    );

  const idealLeft =
    dayRect.left -
    calendarRect.left +
    dayRect.width / 2 -
    popupWidth / 2;

  const maximumLeft =
    calendarRect.width -
    popupWidth -
    16;

  const left =
    Math.max(
      16,
      Math.min(
        idealLeft,
        maximumLeft
      )
    );

  container.style.width =
    `${popupWidth}px`;

  container.style.left =
    `${left}px`;

  const popupHeight =
    container.offsetHeight;

  const positionBelow =
    dayRect.bottom -
    calendarRect.top +
    8;

  const positionAbove =
    dayRect.top -
    calendarRect.top -
    popupHeight -
    8;

  const hasSpaceBelow =
    positionBelow +
      popupHeight <=
    calendarRect.height - 16;

  const top =
    hasSpaceBelow
      ? positionBelow
      : Math.max(
          16,
          positionAbove
        );

  container.style.top =
    `${top}px`;
}


function renderCalendarDays(
  container
) {
  if (!container) {
    return;
  }

  container.replaceChildren(
    ...generateCalendarDays()
  );
}


export function renderMiniCalendar() {
  renderCalendarDays(
    dom.calendarDays
  );

  renderDateDetails(
    dom.calendarDateDetails,
    dom.calendarDays
  );
}


export function renderFullCalendar() {
  renderCalendarDays(
    dom.calendarFullDays
  );

  renderDateDetails(
    dom.calendarFullDateDetails,
    dom.calendarFullDays
  );
}


export function renderCalendar() {
  updateCalendarLabel();
  renderMiniCalendar();
  renderFullCalendar();
}


export function setupCalendarEvents() {
  dom.previousMonthButton
    ?.addEventListener(
      "click",
      function () {
        changeCalendarMonth(-1);
      }
    );

  dom.nextMonthButton
    ?.addEventListener(
      "click",
      function () {
        changeCalendarMonth(1);
      }
    );

  dom.calendarFullPreviousButton
    ?.addEventListener(
      "click",
      function () {
        changeCalendarMonth(-1);
      }
    );

  dom.calendarFullNextButton
    ?.addEventListener(
      "click",
      function () {
        changeCalendarMonth(1);
      }
    );
}
