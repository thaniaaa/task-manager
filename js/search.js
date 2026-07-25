import { dom } from "./dom.js";
import { state } from "./state.js";


/* =========================================
   MEMPERBARUI PENCARIAN
========================================= */

function updateSearch(renderTasks) {
  state.searchQuery =
    dom.searchTaskInput.value;

  state.currentPage = 1;

  renderTasks();
}


/* =========================================
   MEMBERSIHKAN PENCARIAN
========================================= */

function clearSearch(renderTasks) {
  dom.searchTaskInput.value = "";

  state.searchQuery = "";

  state.currentPage = 1;

  renderTasks();
}


/* =========================================
   EVENT PENCARIAN
========================================= */

export function setupSearchEvents(
  renderTasks
) {
  if (
    !dom.searchTaskForm ||
    !dom.searchTaskInput
  ) {
    return;
  }


  /*
   * Mencegah form search
   * me-refresh halaman.
   */
  dom.searchTaskForm.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      updateSearch(renderTasks);
    }
  );


  /*
   * Pencarian langsung saat mengetik.
   */
  dom.searchTaskInput.addEventListener(
    "input",
    function () {
      updateSearch(renderTasks);
    }
  );


  /*
   * Tekan Escape ketika input aktif
   * untuk membersihkan pencarian.
   */
  dom.searchTaskInput.addEventListener(
    "keydown",
    function (event) {
      if (event.key !== "Escape") {
        return;
      }

      clearSearch(renderTasks);

      dom.searchTaskInput.blur();
    }
  );


  /*
   * Tekan "/" untuk fokus
   * ke kolom pencarian.
   */
  document.addEventListener(
    "keydown",
    function (event) {
      const activeElement =
        document.activeElement;

      const userIsTyping =
        activeElement instanceof
          HTMLInputElement ||
        activeElement instanceof
          HTMLTextAreaElement ||
        activeElement instanceof
          HTMLSelectElement;


      if (
        event.key !== "/" ||
        userIsTyping ||
        dom.searchTaskForm.hidden
      ) {
        return;
      }


      event.preventDefault();

      dom.searchTaskInput.focus();
    }
  );
}
