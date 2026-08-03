// modal.js -> membuka dan menutup modal

import { dom } from "./dom.js";
import { state } from "./state.js";


export function showTaskTitleError(
  message
) {
  dom.taskTitleError.textContent =
    message;

  dom.taskTitleInput.classList.add(
    "input--error"
  );
}


export function clearTaskTitleError() {
  dom.taskTitleError.textContent = "";

  dom.taskTitleInput.classList.remove(
    "input--error"
  );
}


export function setAddTaskMode() {
  state.editingTaskId = null;

  dom.taskForm.reset();

  dom.taskModalTitle.textContent =
    "Add New Task";

  dom.submitTaskButtonText.textContent =
    "Add Task";

  clearTaskTitleError();
}


export function setEditTaskMode(task) {
  state.editingTaskId =
    task.id;

  dom.taskTitleInput.value =
    task.title;

  dom.taskCategoryInput.value =
    task.category;

  dom.taskPriorityInput.value =
    task.priority;

  dom.taskDueDateInput.value =
    task.dueDate;

  dom.taskStatusInput.value =
    task.status;

  dom.taskDescriptionInput.value =
    task.description || "";

  dom.taskModalTitle.textContent =
    "Edit Task";

  dom.submitTaskButtonText.textContent =
    "Save Changes";

  clearTaskTitleError();
}


export function openTaskModal() {
  dom.taskModal.classList.add(
    "modal--open"
  );

  dom.taskModal.setAttribute(
    "aria-hidden",
    "false"
  );

  dom.taskTitleInput.focus();
}


export function openAddTaskModal(selectedDate = "") {
  setAddTaskMode();

  if (selectedDate &&  dom.taskDueDateInput ) { 
    dom.taskDueDateInput.value = selectedDate;
  }

  openTaskModal();
}


export function openEditTaskModal(task) {
  setEditTaskMode(task);

  openTaskModal();
}


export function closeTaskModal() {
  dom.taskModal.classList.remove(
    "modal--open"
  );

  dom.taskModal.setAttribute(
    "aria-hidden",
    "true"
  );

 
}


export function setupModalEvents() {
  dom.openTaskModalButton.addEventListener(
    "click",
    openAddTaskModal
  );


  if (dom.openQuickTaskModalButton) {
    dom.openQuickTaskModalButton
      .addEventListener(
        "click",
        openAddTaskModal
      );
  }


  dom.closeTaskModalButton
    .addEventListener(
      "click",
      closeTaskModal
    );


  dom.taskModalOverlay.addEventListener(
    "click",
    closeTaskModal
  );


  if (dom.cancelTaskButton) {
    dom.cancelTaskButton.addEventListener(
      "click",
      closeTaskModal
    );
  }


  dom.taskTitleInput.addEventListener(
    "input",
    clearTaskTitleError
  );


  document.addEventListener(
    "keydown",
    function (event) {
      const modalIsOpen =
        dom.taskModal.classList.contains(
          "modal--open"
        );

      if (
        event.key === "Escape" &&
        modalIsOpen
      ) {
        closeTaskModal();
      }
    }
  );
}

