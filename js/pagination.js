import { dom } from "./dom.js";
import { state } from "./state.js";

import {
  getFilteredTaskItems,
  getSortedTaskItems,
} from "./filters.js";


/* =========================================
   MENAMPILKAN / MENYEMBUNYIKAN PAGINATION
========================================= */

function setPaginationVisibility(isVisible) {
  dom.taskPagination.hidden =
    !isVisible;

  dom.taskPagination.style.display =
    isVisible
      ? "flex"
      : "none";
}


/* =========================================
   SCROLL KE TASK LIST
========================================= */

function scrollToTaskList() {
  dom.taskList.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}


/* =========================================
   MENGHITUNG HASIL TASK SETELAH FILTER
========================================= */

function getFilteredTaskCount() {
  const allTaskItems =
    Array.from(
      dom.taskList.querySelectorAll(
        ".task-item"
      )
    );

  const filteredTaskItems =
    getFilteredTaskItems(
      allTaskItems
    );

  return filteredTaskItems.length;
}


/* =========================================
   MERENDER PAGINATION
========================================= */

export function renderTaskPagination() {
  /*
   * Mengambil seluruh task dari DOM.
   */
  const allTaskItems =
    Array.from(
      dom.taskList.querySelectorAll(
        ".task-item"
      )
    );

  const currentViewTaskItems =
    allTaskItems.filter(
      function (taskItem) {
        const taskIsArchived =
          taskItem.dataset.archived ===
            "true";

        return state.activeView ===
          "archive"
          ? taskIsArchived
          : !taskIsArchived;
      }
    );


  /*
   * Memfilter task.
   */
  const filteredTaskItems =
    getFilteredTaskItems(
      allTaskItems
    );


  /*
   * Mengurutkan hasil filter.
   */
  const taskItems =
    getSortedTaskItems(
      filteredTaskItems
    );


  /*
   * Memindahkan elemen DOM sesuai
   * hasil pengurutan.
   *
   * append tidak menggandakan elemen.
   */
  taskItems.forEach(
    function (taskItem) {
      dom.taskList.append(taskItem);
    }
  );


  const totalTasks =
    taskItems.length;

  const totalPages =
    Math.ceil(
      totalTasks /
      state.tasksPerPage
    );


  /*
   * Sembunyikan seluruh task dahulu.
   */
  allTaskItems.forEach(
    function (taskItem) {
      taskItem.classList.add(
        "task-item--hidden"
      );
    }
  );


  /*
   * Empty state.
   */
  dom.taskEmptyState.hidden =
    totalTasks > 0;

  /*
   * Quick Add hanya ditampilkan jika
   * aplikasi benar-benar belum memiliki task.
   * Hasil filter/search kosong tidak menampilkannya.
   */
  if (dom.quickAddSection) {
    dom.quickAddSection.hidden =
      state.activeView === "archive" ||
      currentViewTaskItems.length > 0;
  }


  const emptyTitle =
    dom.taskEmptyState?.querySelector(
      "h3"
    );

  const emptyDescription =
    dom.taskEmptyState?.querySelector(
      "p"
    );


  /*
   * Ketika tidak ada task yang tampil.
   */
  if (totalTasks === 0) {
    state.currentPage = 1;


    /*
     * Bedakan antara:
     * belum ada task dan filter kosong.
     */
    if (
      currentViewTaskItems.length === 0
    ) {
      if (emptyTitle) {
        emptyTitle.textContent =
          state.activeView === "archive"
            ? "Archive is empty"
            : "No tasks yet";
      }

      if (emptyDescription) {
        emptyDescription.textContent =
          state.activeView === "archive"
            ? "Archived tasks will appear here."
            : "Create your first task using the New Task button.";
      }
    } else {
      if (emptyTitle) {
        emptyTitle.textContent =
          "No matching tasks";
      }

      if (emptyDescription) {
        emptyDescription.textContent =
          "No tasks match the selected filter.";
      }
    }


    dom.taskCountText.textContent =
      "Showing 0–0 of 0 tasks";


    setPaginationVisibility(false);


    dom.paginationNumbers
      .replaceChildren();


    dom.prevPageButton.disabled =
      true;

    dom.nextPageButton.disabled =
      true;


    return;
  }


  /*
   * Pastikan halaman aktif valid.
   */
  if (
    state.currentPage >
    totalPages
  ) {
    state.currentPage =
      totalPages;
  }


  if (state.currentPage < 1) {
    state.currentPage = 1;
  }


  /*
   * Menghitung batas task
   * pada halaman aktif.
   */
  const startIndex =
    (
      state.currentPage - 1
    ) * state.tasksPerPage;


  const endIndex =
    startIndex +
    state.tasksPerPage;


  /*
   * Menampilkan task halaman aktif.
   */
  taskItems.forEach(
    function (taskItem, index) {
      const shouldShow =
        index >= startIndex &&
        index < endIndex;


      taskItem.classList.toggle(
        "task-item--hidden",
        !shouldShow
      );
    }
  );


  /*
   * Memperbarui tulisan jumlah task.
   */
  const firstTaskNumber =
    startIndex + 1;


  const lastTaskNumber =
    Math.min(
      endIndex,
      totalTasks
    );


  dom.taskCountText.textContent =
    `Showing ${firstTaskNumber}–${lastTaskNumber} of ${totalTasks} tasks`;


  /*
   * Hapus tombol halaman lama.
   */
  dom.paginationNumbers
    .replaceChildren();


  /*
   * Membuat tombol angka halaman.
   */
  for (
    let pageNumber = 1;
    pageNumber <= totalPages;
    pageNumber++
  ) {
    const pageButton =
      document.createElement(
        "button"
      );


    pageButton.type = "button";


    pageButton.classList.add(
      "pagination__button"
    );


    pageButton.textContent =
      pageNumber;


    /*
     * Tandai halaman aktif.
     */
    if (
      pageNumber ===
      state.currentPage
    ) {
      pageButton.classList.add(
        "pagination__button--active"
      );


      pageButton.setAttribute(
        "aria-current",
        "page"
      );
    }


    /*
     * Event nomor halaman.
     */
    pageButton.addEventListener(
      "click",
      function () {
        state.currentPage =
          pageNumber;


        renderTaskPagination();


        scrollToTaskList();
      }
    );


    dom.paginationNumbers.append(
      pageButton
    );
  }


  /*
   * Pagination hanya muncul jika
   * jumlah halaman lebih dari satu.
   */
  setPaginationVisibility(
    totalPages > 1
  );


  /*
   * Mengatur tombol Previous dan Next.
   */
  dom.prevPageButton.disabled =
    state.currentPage === 1;


  dom.nextPageButton.disabled =
    state.currentPage === totalPages;
}


/* =========================================
   EVENT PREVIOUS DAN NEXT
========================================= */

export function setupPaginationEvents() {
  /*
   * Tombol Previous.
   */
  dom.prevPageButton.addEventListener(
    "click",
    function () {
      if (state.currentPage <= 1) {
        return;
      }


      state.currentPage--;


      renderTaskPagination();


      scrollToTaskList();
    }
  );


  /*
   * Tombol Next.
   */
  dom.nextPageButton.addEventListener(
    "click",
    function () {
      const totalTasks =
        getFilteredTaskCount();


      const totalPages =
        Math.ceil(
          totalTasks /
          state.tasksPerPage
        );


      if (
        state.currentPage >=
        totalPages
      ) {
        return;
      }


      state.currentPage++;


      renderTaskPagination();


      scrollToTaskList();
    }
  );
}
