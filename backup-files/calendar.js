import { dom } from "./dom.js";
import { state } from "./state.js";

import {
  formatDateToString,
  getTodayDateString,
} from "./date.js";


/* =========================================
   MENGUBAH BULAN
========================================= */

function changeCalendarMonth(
  monthDifference
) {
  const newDate =
    new Date(
      state.calendarYear,
      state.calendarMonth +
        monthDifference,
      1
    );

  state.calendarYear =
    newDate.getFullYear();

  state.calendarMonth =
    newDate.getMonth();

  renderCalendar();
}


/* =========================================
   MEMERIKSA TASK PADA TANGGAL
========================================= */

function dateHasTask(dateString) {
  return state.tasks.some(
    function (task) {
      return (
        task.dueDate === dateString &&
        task.status !== "completed"
      );
    }
  );
}


/* =========================================
   MERENDER CALENDAR
========================================= */

export function renderCalendar() {
  const year =
    state.calendarYear;

  const month =
    state.calendarMonth;


  /*
   * Menampilkan nama bulan.
   */
  const calendarDate =
    new Date(year, month, 1);

    const monthLabel =
new Intl.DateTimeFormat(
  "en-US",
  {
    month:"long",
    year:"numeric",
  }
).format(calendarDate);


if(dom.calendarMonthLabel){

 dom.calendarMonthLabel.textContent =
 monthLabel;

}


if(dom.calendarFullMonthLabel){

 dom.calendarFullMonthLabel.textContent =
 monthLabel;

}


  /*
   * Hari pertama bulan.
   */
  const firstDayOfMonth =
    new Date(year, month, 1);


  /*
   * JavaScript:
   * Minggu = 0
   * Senin  = 1
   *
   * Tampilan kita dimulai dari Senin,
   * sehingga index perlu disesuaikan.
   */
  const firstDayIndex =
    (
      firstDayOfMonth.getDay() + 6
    ) % 7;


  /*
   * Menentukan tanggal pertama
   * yang ditampilkan pada calendar.
   */
  const calendarStartDate =
    new Date(
      year,
      month,
      1 - firstDayIndex
    );


  const todayString =
    getTodayDateString();



 if(dom.calendarDays){
    dom.calendarDays.replaceChildren();
}


if(dom.calendarFullDays){
    dom.calendarFullDays.replaceChildren();
}


  /*
   * Menampilkan 6 minggu × 7 hari.
   */
  const daysInMonth =
  new Date(
    year,
    month + 1,
    0
  ).getDate();


const totalDays =
  firstDayIndex + daysInMonth;



for (
  let index = 0;
  index < totalDays;
  index++
)
   {
    const cellDate =
      new Date(calendarStartDate);

    cellDate.setDate(
      calendarStartDate.getDate() +
        index
    );


    const dateString =
      formatDateToString(cellDate);


    const calendarDay =
      document.createElement("button");

    calendarDay.type = "button";

    calendarDay.classList.add(
      "calendar-day"
    );

    calendarDay.textContent =
      cellDate.getDate();

    calendarDay.dataset.date =
      dateString;

    calendarDay.setAttribute(
      "aria-label",
      dateString
    );


    /*
     * Tanggal dari bulan sebelum
     * atau sesudah.
     */
    const isOutsideCurrentMonth =
      cellDate.getMonth() !== month;

    if (isOutsideCurrentMonth) {
      calendarDay.classList.add(
        "calendar-day--muted"
      );
    }


    /*
     * Tanggal hari ini.
     */
    if (
      dateString === todayString
    ) {
      calendarDay.classList.add(
        "calendar-day--active"
      );
    }


    /*
     * Penanda tanggal memiliki task.
     */
    if (dateHasTask(dateString)) {
      calendarDay.classList.add(
        "calendar-day--has-task"
      );
    }

if(dom.calendarDays){

  dom.calendarDays.append(
    calendarDay.cloneNode(true)
  );

}


if(dom.calendarFullDays){

  dom.calendarFullDays.append(
    calendarDay
  );

}
  }
}


/* =========================================
   EVENT CALENDAR
========================================= */

export function setupCalendarEvents() {
  dom.previousMonthButton
    .addEventListener(
      "click",
      function () {
        changeCalendarMonth(-1);
      }
    );


  dom.nextMonthButton
    .addEventListener(
      "click",
      function () {
        changeCalendarMonth(1);
      }
    );
}