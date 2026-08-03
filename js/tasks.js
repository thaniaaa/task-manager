import { dom } from "./dom.js";
import { state } from "./state.js";

import {
  openEditTaskModal,
  closeTaskModal,
  showTaskTitleError,
  clearTaskTitleError,
} from "./modal.js";

import {
  updateTaskAnalytics,
} from "./analytics.js";

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
  updateDashboardWelcome,
} from "./views.js";

import {
  saveTasks,
} from "./storage.js";
 "./modal.js";


/* =========================================
   CLASS KATEGORI
========================================= */

const categoryClassMap = {
  Development:
    "category-badge--development",

  Design:
    "category-badge--design",

  Meeting:
    "category-badge--meeting",

  Marketing:
    "category-badge--marketing",

  Personal:
    "category-badge--personal",

  Work:
    "category-badge--work",
};

// task badge edit

const categoryOptions = [
  {
    value: "Development",
    label: "Development",
  },
  {
    value: "Design",
    label: "Design",
  },
  {
    value: "Meeting",
    label: "Meeting",
  },
  {
    value: "Marketing",
    label: "Marketing",
  },
  {
    value: "Personal",
    label: "Personal",
  },
  {
    value: "Work",
    label: "Work",
  },
];


const statusOptions = [
  {
    value: "todo",
    label: "To Do",
  },
  {
    value: "in-progress",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
];


const priorityOptions = [
  {
    value: "Low",
    label: "Low",
  },
  {
    value: "Medium",
    label: "Medium",
  },
  {
    value: "High",
    label: "High",
  },
];


const statusClassMap = {
  todo:
    "status-badge--todo",

  "in-progress":
    "status-badge--in-progress",

  completed:
    "status-badge--completed",
};


const priorityClassMap = {
  Low:
    "priority-badge--low",

  Medium:
    "priority-badge--medium",

  High:
    "priority-badge--high",
};


/* =========================================
   MEMPERBARUI SELURUH TAMPILAN TASK
========================================= */

function refreshTaskViews() {
  saveTasks(state.tasks);

  updateTaskAnalytics();

  updateDashboardWelcome();

  renderTaskPagination();

  renderCalendar();

  renderUpcomingDeadlines();
}


/* =========================================
   MEMPERBARUI UI STATUS TASK
========================================= */

function updateTaskStatusUI(
  task,
  taskItem,
  taskCheckbox
) {
  const isCompleted =
    task.status === "completed";


  taskItem.classList.toggle(
    "task-item--completed",
    isCompleted
  );


  taskCheckbox.classList.toggle(
    "task-checkbox--checked",
    isCompleted
  );


  /*
   * Hapus ikon sebelumnya supaya
   * tidak bertumpuk.
   */
  taskCheckbox.replaceChildren();


  if (isCompleted) {
    const checkIcon =
      document.createElement("i");

    checkIcon.classList.add(
      "bi",
      "bi-check-lg"
    );

    taskCheckbox.append(
      checkIcon
    );

    taskCheckbox.setAttribute(
      "aria-label",
      "Mark task as incomplete"
    );
  } else {
    taskCheckbox.setAttribute(
      "aria-label",
      "Mark task as complete"
    );
  }
}


/* =========================================
   MEMBUAT ELEMEN TASK
========================================= */

function updateBadgeSelectClass(
  selectElement,
  baseClass,
  classMap
) {
  selectElement.className = "";

  selectElement.classList.add(
    "badge-select",
    baseClass
  );

  const modifierClass =
    classMap[selectElement.value];

  if (modifierClass) {
    selectElement.classList.add(
      modifierClass
    );
  }
}


function createBadgeSelect({
  value,
  options,
  baseClass,
  classMap,
  onChange,
}) {
  const selectElement =
    document.createElement("select");

  selectElement.setAttribute(
    "aria-label",
    `Change ${baseClass}`
  );


  options.forEach(function (optionData) {
    const optionElement =
      document.createElement("option");

    optionElement.value =
      optionData.value;

    optionElement.textContent =
      optionData.label;

    selectElement.append(
      optionElement
    );
  });


  selectElement.value =
    value;


  updateBadgeSelectClass(
    selectElement,
    baseClass,
    classMap
  );


  selectElement.addEventListener(
    "change",
    function () {
      updateBadgeSelectClass(
        selectElement,
        baseClass,
        classMap
      );

      onChange(
        selectElement.value
      );
    }
  );


  return selectElement;
}

export function createTaskElement(task) {
  /*
   * Elemen utama task.
   */
  const taskItem =
    document.createElement("article");

  taskItem.classList.add(
    "task-item"
  );


  /*
   * Dataset digunakan untuk:
   * filter, sort, search, dan edit.
   */
  taskItem.dataset.id =
    task.id;

  taskItem.dataset.title =
    task.title.toLowerCase();

  taskItem.dataset.createdAt =
    task.createdAt ?? task.id;

  taskItem.dataset.status =
    task.status;

  taskItem.dataset.category =
    task.category;

  taskItem.dataset.priority =
    task.priority;

  taskItem.dataset.dueDate =
    task.dueDate;

  taskItem.dataset.description =
    (
      task.description || ""
    ).toLowerCase();

  taskItem.dataset.archived =
    String(Boolean(task.archived));

  taskItem.classList.toggle(
    "task-item--archived",
    Boolean(task.archived)
  );


  /* =====================================
     CHECKBOX DAN JUDUL
  ===================================== */

  const taskMain =
    document.createElement("div");

  taskMain.classList.add(
    "task-item__main"
  );


  const taskCheckbox =
    document.createElement("button");

  taskCheckbox.type = "button";

  taskCheckbox.classList.add(
    "task-checkbox"
  );


  const taskTitle =
    document.createElement("span");

  taskTitle.classList.add(
    "task-item__title"
  );

  taskTitle.textContent =
    task.title;


  /* =====================================
     KATEGORI
  ===================================== */
  const taskCategory =
  createBadgeSelect({
    value:
      task.category,

    options:
      categoryOptions,

    baseClass:
      "category-badge",

    classMap:
      categoryClassMap,

    onChange:
      function (newCategory) {
        task.category =
          newCategory;

        taskItem.dataset.category =
          newCategory;

        refreshTaskViews();
      },
  });

  /* =====================================
     DUE DATE
  ===================================== */

  const taskDate =
    document.createElement("div");

  taskDate.classList.add(
    "task-date"
  );


  const taskDateIcon =
    document.createElement("i");

  taskDateIcon.classList.add(
    "bi",
    "bi-calendar3"
  );


  const taskDateText =
    document.createElement("span");

  taskDateText.textContent =
    task.dueDate
      ? `Due: ${task.dueDate}`
      : "No due date";


  taskDate.append(
    taskDateIcon,
    taskDateText
  );

  /* =====================================
     DESCRIPTION PREVIEW
  ===================================== */

  const taskDescription =
    document.createElement("div");

  taskDescription.classList.add(
    "task-description"
  );


  const descriptionText =
    task.description?.trim() ||
    "No description";


  const descriptionButton =
    document.createElement("button");

  descriptionButton.type = "button";

  descriptionButton.classList.add(
    "task-description__trigger"
  );

  descriptionButton.setAttribute(
    "aria-expanded",
    "false"
  );


  const descriptionTooltipId =
    `task-description-${task.id}`;

  descriptionButton.setAttribute(
    "aria-controls",
    descriptionTooltipId
  );

  descriptionButton.setAttribute(
    "aria-label",
    `View description: ${descriptionText}`
  );


  const descriptionIcon =
    document.createElement("i");

  descriptionIcon.classList.add(
    "bi",
    "bi-card-text"
  );


  const descriptionPreview =
    document.createElement("span");

  descriptionPreview.textContent =
    descriptionText;


  const descriptionTooltip =
    document.createElement("div");

  descriptionTooltip.id =
    descriptionTooltipId;

  descriptionTooltip.classList.add(
    "task-description__tooltip"
  );

  descriptionTooltip.setAttribute(
    "role",
    "tooltip"
  );

  descriptionTooltip.hidden = true;

  descriptionTooltip.textContent =
    descriptionText;


  descriptionButton.append(
    descriptionIcon,
    descriptionPreview
  );

  taskDescription.append(
    descriptionButton,
    descriptionTooltip
  );


  //task status

  /* =====================================
   STATUS
===================================== */
const taskStatus =
  createBadgeSelect({
    value:
      task.status,

    options:
      statusOptions,

    baseClass:
      "status-badge",

    classMap:
      statusClassMap,

    onChange:
      function (newStatus) {
        task.status =
          newStatus;

        taskItem.dataset.status =
          newStatus;

        updateTaskStatusUI(
          task,
          taskItem,
          taskCheckbox
        );

        refreshTaskViews();
      },
  });

  /* =====================================
     PRIORITY
  ===================================== */
const taskPriority =
  createBadgeSelect({
    value:
      task.priority,

    options:
      priorityOptions,

    baseClass:
      "priority-badge",

    classMap:
      priorityClassMap,

    onChange:
      function (newPriority) {
        task.priority =
          newPriority;

        taskItem.dataset.priority =
          newPriority;

        refreshTaskViews();
      },
  });

  /* =====================================
     ACTION BUTTONS
  ===================================== */

  const taskActions =
    document.createElement("div");

  taskActions.classList.add(
    "task-actions"
  );


  /*
   * Tombol Edit.
   */
  const editButton =
    document.createElement("button");

  editButton.type = "button";

  editButton.classList.add(
    "task-action",
    "task-action--edit"
  );

  editButton.setAttribute(
    "aria-label",
    "Edit task"
  );

  editButton.innerHTML =
    '<i class="bi bi-pencil"></i>';


  /*
   * Tombol Delete.
   */
  const deleteButton =
    document.createElement("button");

  deleteButton.type = "button";

  deleteButton.classList.add(
    "task-action",
    "task-action--delete"
  );

  deleteButton.setAttribute(
    "aria-label",
    "Delete task"
  );

  deleteButton.innerHTML =
    '<i class="bi bi-trash3"></i>';


  /*
   * Tombol Archive / Restore.
   */
  const archiveButton =
    document.createElement("button");

  archiveButton.type = "button";

  archiveButton.classList.add(
    "task-action",
    "task-action--archive"
  );

  const taskIsArchived =
    Boolean(task.archived);

  archiveButton.setAttribute(
    "aria-label",
    taskIsArchived
      ? "Restore task from archive"
      : "Archive task"
  );

  archiveButton.setAttribute(
    "title",
    taskIsArchived
      ? "Restore task"
      : "Archive task"
  );

  archiveButton.innerHTML =
    taskIsArchived
      ? '<i class="bi bi-arrow-counterclockwise"></i>'
      : '<i class="bi bi-archive"></i>';

  archiveButton.classList.toggle(
    "task-action--restore",
    taskIsArchived
  );


  /* =====================================
     STATUS AWAL
  ===================================== */

  updateTaskStatusUI(
    task,
    taskItem,
    taskCheckbox
  );


  /* =====================================
     EVENT CHECKBOX
  ===================================== */
taskCheckbox.addEventListener(
  "click",
  function () {
    task.status =
      task.status === "completed"
        ? "todo"
        : "completed";


    taskItem.dataset.status =
      task.status;


    taskStatus.value =
      task.status;


    updateBadgeSelectClass(
      taskStatus,
      "status-badge",
      statusClassMap
    );


    updateTaskStatusUI(
      task,
      taskItem,
      taskCheckbox
    );


    refreshTaskViews();
  }
);

  /* =====================================
     EVENT EDIT
  ===================================== */

  editButton.addEventListener(
    "click",
    function () {
      openEditTaskModal(task);
    }
  );


  /* =====================================
     EVENT DELETE
  ===================================== */

  deleteButton.addEventListener(
    "click",
    function () {
      const taskIndex =
        state.tasks.findIndex(
          function (item) {
            return (
              item.id === task.id
            );
          }
        );


      if (taskIndex !== -1) {
        state.tasks.splice(
          taskIndex,
          1
        );
      }


      taskItem.remove();


      refreshTaskViews();
    }
  );


  archiveButton.addEventListener(
    "click",
    function () {
      task.archived =
        !Boolean(task.archived);

      taskItem.dataset.archived =
        String(task.archived);

      taskItem.classList.toggle(
        "task-item--archived",
        task.archived
      );

      archiveButton.classList.toggle(
        "task-action--restore",
        task.archived
      );

      archiveButton.setAttribute(
        "aria-label",
        task.archived
          ? "Restore task from archive"
          : "Archive task"
      );

      archiveButton.setAttribute(
        "title",
        task.archived
          ? "Restore task"
          : "Archive task"
      );

      archiveButton.innerHTML =
        task.archived
          ? '<i class="bi bi-arrow-counterclockwise"></i>'
          : '<i class="bi bi-archive"></i>';

      refreshTaskViews();
    }
  );


  /* =====================================
     MENYUSUN ELEMEN
  ===================================== */

  taskMain.append(
    taskCheckbox,
    taskTitle
  );


  taskActions.append(
    archiveButton,
    editButton,
    deleteButton
  );


  taskItem.append(
    taskMain,
    taskCategory,
    taskStatus,
    taskPriority,
    taskDate,
    taskDescription,
    taskActions
  );


  return taskItem;
}


/* =========================================
   MEMBACA NILAI FORM
========================================= */

function getTaskFormValues() {
  return {
    title:
      dom.taskTitleInput
        .value
        .trim(),

    category:
      dom.taskCategoryInput.value,

    priority:
      dom.taskPriorityInput.value,

    dueDate:
      dom.taskDueDateInput.value,

    status:
      dom.taskStatusInput.value,

    description:
      dom.taskDescriptionInput
        .value
        .trim(),
  };
}


/* =========================================
   MEMPERBARUI TASK LAMA
========================================= */

function updateExistingTask(
  taskFormData
) {
  const editedTask =
    state.tasks.find(
      function (task) {
        return (
          task.id ===
          state.editingTaskId
        );
      }
    );


  if (!editedTask) {
    console.error(
      "Task yang diedit tidak ditemukan."
    );

    return false;
  }


  /*
   * Perbarui data object lama.
   */
  editedTask.title =
    taskFormData.title;

  editedTask.category =
    taskFormData.category;

  editedTask.priority =
    taskFormData.priority;

  editedTask.dueDate =
    taskFormData.dueDate;

  editedTask.status =
    taskFormData.status;

  editedTask.description =
    taskFormData.description;


  /*
   * Cari elemen lama.
   */
  const oldTaskElement =
    dom.taskList.querySelector(
      `[data-id="${editedTask.id}"]`
    );


  /*
   * Buat elemen baru berdasarkan
   * data yang sudah diperbarui.
   */
  const updatedTaskElement =
    createTaskElement(
      editedTask
    );


  if (oldTaskElement) {
    oldTaskElement.replaceWith(
      updatedTaskElement
    );
  }


  console.log(
    "Task berhasil diperbarui:",
    editedTask
  );


  return true;
}


/* =========================================
   MEMBUAT TASK BARU
========================================= */

function createNewTask(
  taskFormData
) {
  const createdAt =
    Date.now();


  const newTask = {
    id: createdAt,

    createdAt,

    title:
      taskFormData.title,

    category:
      taskFormData.category,

    priority:
      taskFormData.priority,

    dueDate:
      taskFormData.dueDate,

    status:
      taskFormData.status,

    description:
      taskFormData.description,

    archived: false,
  };


  state.tasks.push(
    newTask
  );


  const taskElement =
    createTaskElement(
      newTask
    );


  dom.taskList.prepend(
    taskElement
  );


  state.currentPage = 1;


  console.log(
    "Task baru:",
    newTask
  );
}


/* =========================================
   MENANGANI SUBMIT FORM
========================================= */

export function handleTaskFormSubmit(
  event
) {
  event.preventDefault();


  const taskFormData =
    getTaskFormValues();


  /*
   * Validasi judul.
   */
  if (taskFormData.title === "") {
    showTaskTitleError(
      "Task title is required."
    );

    dom.taskTitleInput.focus();

    return;
  }


  clearTaskTitleError();


  /*
   * Mode Edit.
   */
  if (state.editingTaskId !== null) {
    const updateWasSuccessful =
      updateExistingTask(
        taskFormData
      );


    if (!updateWasSuccessful) {
      return;
    }
  } else {
    /*
     * Mode Add.
     */
    createNewTask(
      taskFormData
    );
  }


  /*
   * Perbarui seluruh tampilan.
   */
  refreshTaskViews();


  /*
   * Bersihkan form dan tutup modal.
   */
  dom.taskForm.reset();

  console.log("BEFORE CLOSE MODAL");

  closeTaskModal();

  console.log("AFTER CLOSE MODAL")
}


/* =========================================
   EVENT FORM TASK
========================================= */

export function setupTaskEvents() {
  dom.taskForm.addEventListener(
    "submit",
    handleTaskFormSubmit
  );

  /*
   * Satu event terdelegasi untuk seluruh
   * tooltip deskripsi task.
   */
  document.addEventListener(
    "click",
    function (event) {
      const selectedDescription =
        event.target.closest(
          ".task-description"
        );

      const selectedTrigger =
        event.target.closest(
          ".task-description__trigger"
        );

      document
        .querySelectorAll(
          ".task-description__trigger[aria-expanded='true']"
        )
        .forEach(function (trigger) {
          if (
            trigger.parentElement ===
            selectedDescription
          ) {
            return;
          }

          trigger.setAttribute(
            "aria-expanded",
            "false"
          );

          const tooltip =
            trigger.parentElement
              ?.querySelector(
                ".task-description__tooltip"
              );

          if (tooltip) {
            tooltip.hidden = true;
          }
        });

      if (!selectedTrigger) {
        return;
      }

      const tooltip =
        selectedTrigger.parentElement
          ?.querySelector(
            ".task-description__tooltip"
          );

      if (!tooltip) {
        return;
      }

      const shouldOpen =
        selectedTrigger.getAttribute(
          "aria-expanded"
        ) !== "true";

      selectedTrigger.setAttribute(
        "aria-expanded",
        String(shouldOpen)
      );

      tooltip.hidden =
        !shouldOpen;
    }
  );

  document.addEventListener(
    "keydown",
    function (event) {
      if (event.key !== "Escape") {
        return;
      }

      document
        .querySelectorAll(
          ".task-description__trigger[aria-expanded='true']"
        )
        .forEach(function (trigger) {
          trigger.setAttribute(
            "aria-expanded",
            "false"
          );

          const tooltip =
            trigger.parentElement
              ?.querySelector(
                ".task-description__tooltip"
              );

          if (tooltip) {
            tooltip.hidden = true;
          }
        });
    }
  );
}
