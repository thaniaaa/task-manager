"use strict";

/* =========================================
   1. MENGAMBIL ELEMEN DOM
========================================= */
const sortTaskButton =
  document.querySelector("#sortTaskButton");

const sortMenu =
  document.querySelector("#sortMenu");

const sortTaskSelect =
  document.querySelector("#sortTaskSelect");

const applySortButton =
  document.querySelector("#applySortButton");

const resetSortButton =
  document.querySelector("#resetSortButton");
const tasksFilterTabs = 
  document.querySelector("#taskfilterTabs")

const totalTasksCount = 
  document.querySelector("#totalTasksCount");

const totalTasksInfo =
  document.querySelector("#totalTasksInfo");

const inProgressTasksCount =
  document.querySelector("#inProgressTasksCount");

const inProgressTasksInfo =
  document.querySelector("#inProgressTasksInfo");

const overdueTasksCount =
  document.querySelector("#overdueTasksCount");

const overdueTasksInfo =
  document.querySelector("#overdueTasksInfo");

const taskEmptyState =
  document.querySelector("#taskEmptyState");

const taskModal =
  document.querySelector("#taskModal");

const openTaskModalButton =
  document.querySelector("#openTaskModalButton");

const openQuickTaskModalButton =
  document.querySelector(
    "#openQuickTaskModalButton"
  );

const closeTaskModalButton =
  document.querySelector(
    "#closeTaskModalButton"
  );

const taskModalOverlay =
  document.querySelector("#taskModalOverlay");

const cancelTaskButton =
  document.querySelector("#cancelTaskButton");

const taskForm =
  document.querySelector("#taskForm");

const taskTitleInput =
  document.querySelector("#taskTitle");

const taskTitleError =
  document.querySelector("#taskTitleError");

const taskCategoryInput =
  document.querySelector("#taskCategory");

const taskPriorityInput =
  document.querySelector("#taskPriority");

const taskDueDateInput =
  document.querySelector("#taskDueDate");

const taskStatusInput =
  document.querySelector("#taskStatus");

const taskDescriptionInput =
  document.querySelector("#taskDescription");

const taskList =
  document.querySelector("#taskList");

const taskCountText =
  document.querySelector("#taskCountText");

const taskPagination =
  document.querySelector("#taskPagination");

const paginationNumbers =
  document.querySelector(
    "#paginationNumbers"
  );

const prevPageButton =
  document.querySelector("#prevPageButton");

const nextPageButton =
  document.querySelector("#nextPageButton");

const filterTaskButton =
  document.querySelector("#filterTaskButton");

const filterMenu =
  document.querySelector("#filterMenu");

const filterCategorySelect =
  document.querySelector(
    "#filterCategorySelect"
  );

const filterPrioritySelect =
  document.querySelector(
    "#filterPrioritySelect"
  );

const applyFilterButton =
  document.querySelector(
    "#applyFilterButton"
  );

const resetFilterButton =
  document.querySelector(
    "#resetFilterButton"
  );


/* =========================================
   2. PENYIMPANAN DATA TASK
========================================= */

const tasks = [];

const tasksPerPage = 6;

let currentPage = 1;

let activeFilter = "all";

let activeSort = "newest";

let selectedCategory = "all";

let selectedPriority = "all";


/* =========================================
   3. FUNGSI MODAL
========================================= */

function openTaskModal() {
  taskModal.classList.add("modal--open");

  taskModal.setAttribute(
    "aria-hidden",
    "false"
  );

  taskTitleInput.focus();
}


function closeTaskModal() {
  taskModal.classList.remove("modal--open");

  taskModal.setAttribute(
    "aria-hidden",
    "true"
  );

  clearTaskTitleError();
}


/* =========================================
   4. FUNGSI PESAN ERROR
========================================= */

function showTaskTitleError(message) {
  taskTitleError.textContent = message;

  taskTitleInput.classList.add(
    "input--error"
  );
}


function clearTaskTitleError() {
  taskTitleError.textContent = "";

  taskTitleInput.classList.remove(
    "input--error"
  );
}


/* =========================================
   5. MEMPERBARUI UI STATUS TASK
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
   * Hapus ikon lama agar tidak bertumpuk.
   */
  taskCheckbox.replaceChildren();

  if (isCompleted) {
    const checkIcon =
      document.createElement("i");

    checkIcon.classList.add(
      "bi",
      "bi-check-lg"
    );

    taskCheckbox.append(checkIcon);

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
   Membbuat fungsi analytic
========================================= */
function updateTaskAnalytics() {
  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(function (task) {
      return task.status === "completed";
    });

  const inProgressTasks =
    tasks.filter(function (task) {
      return task.status === "in-progress";
    });

  const today =
    getTodayDateString();

  const overdueTasks =
    tasks.filter(function (task) {
      const hasDueDate =
        task.dueDate !== "";

      const dueDateHasPassed =
        task.dueDate < today;

      const isNotCompleted =
        task.status !== "completed";

      return (
        hasDueDate &&
        dueDateHasPassed &&
        isNotCompleted
      );
    });


  const completedPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (
            completedTasks.length /
            totalTasks
          ) * 100
        );


  /*
   * Total Tasks
   */
  totalTasksCount.textContent =
    totalTasks;

  totalTasksInfo.textContent =
    totalTasks === 0
      ? "No tasks yet"
      : `${totalTasks} total tasks`;


  /*
   * Completed
   */
  completedTasksCount.textContent =
    completedTasks.length;

  completedTasksInfo.textContent =
    `${completedPercentage}% completed`;


  /*
   * In Progress
   */
  inProgressTasksCount.textContent =
    inProgressTasks.length;

  inProgressTasksInfo.textContent =
    inProgressTasks.length === 0
      ? "No ongoing tasks"
      : `${inProgressTasks.length} ongoing`;


  /*
   * Overdue
   */
  overdueTasksCount.textContent =
    overdueTasks.length;

  overdueTasksInfo.textContent =
    overdueTasks.length === 0
      ? "No overdue tasks"
      : "Needs attention";
}

/* =========================================
   Fungsi tanggal hari ini
========================================= */
function getTodayDateString() {
  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      today.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/* =========================================
   6. MEMBUAT ELEMEN TASK
========================================= */

function createTaskElement(task) {
  /*
   * Pembungkus utama.
   */
  const taskItem =
    document.createElement("article");

  taskItem.classList.add("task-item");

  taskItem.dataset.id = task.id;

  taskItem.dataset.title =
  task.title.toLowerCase();

taskItem.dataset.createdAt =
  task.id;

  taskItem.dataset.status =
  task.status;

taskItem.dataset.category =
  task.category;

taskItem.dataset.priority =
  task.priority;

taskItem.dataset.dueDate =
  task.dueDate;


  taskItem.dataset.status =
  task.status;

  taskItem.dataset.priority =
  task.priority;

  taskItem.dataset.dueDate =
  task.dueDate;

  /*
   * Bagian checkbox dan judul.
   */
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

  taskTitle.textContent = task.title;


  /*
   * Bagian kategori.
   */
  const taskCategory =
    document.createElement("span");

  taskCategory.classList.add(
    "category-badge"
  );

  taskCategory.textContent =
    task.category || "Uncategorized";


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


  const categoryClass =
    categoryClassMap[task.category];

  if (categoryClass) {
    taskCategory.classList.add(
      categoryClass
    );
  }


  /*
   * Bagian due date.
   */
  const taskDate =
    document.createElement("div");

  taskDate.classList.add("task-date");


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


  /*
   * Bagian priority.
   */
  const taskPriority =
    document.createElement("span");

  taskPriority.classList.add(
    "priority-badge"
  );

  taskPriority.textContent =
    task.priority || "No priority";


  if (task.priority === "High") {
    taskPriority.classList.add(
      "priority-badge--high"
    );
  }

  if (task.priority === "Medium") {
    taskPriority.classList.add(
      "priority-badge--medium"
    );
  }

  if (task.priority === "Low") {
    taskPriority.classList.add(
      "priority-badge--low"
    );
  }


  /*
   * Bagian tombol action.
   */
  const taskActions =
    document.createElement("div");

  taskActions.classList.add(
    "task-actions"
  );


  /*
   * Tombol delete.
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
   * Tampilkan status awal.
   */
  updateTaskStatusUI(
    task,
    taskItem,
    taskCheckbox
  );


  /*
   * Event checkbox.
   */
  taskCheckbox.addEventListener(
    "click",
    function () {
      if (task.status === "completed") {
        task.status = "todo";
      } else {
        task.status = "completed";
      }

    taskItem.dataset.status =
    task.status;

      updateTaskStatusUI(
        task,
        taskItem,
        taskCheckbox
      );

      updateTaskAnalytics();
      renderTaskPagination();

      console.log(
        "Status terbaru:",
        task.status
      );
    }
  );


  /*
   * Event delete.
   */
  deleteButton.addEventListener(
    "click",
    function () {
      const taskIndex =
        tasks.findIndex(
          function (item) {
            return item.id === task.id;
          }
        );

      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
      }

     //menjalankan insight setelah tasks dihapus
     updateTaskAnalytics();

      taskItem.remove();

      /*
       * Perbarui jumlah dan pagination
       * setelah task dihapus.
       */
      renderTaskPagination();

      console.log(
        "Semua task setelah dihapus:",
        tasks
      );
    }
  );


  /*
   * Menyusun child element.
   */
  taskMain.append(
    taskCheckbox,
    taskTitle
  );

  taskActions.append(
    deleteButton
  );

  taskItem.append(
    taskMain,
    taskCategory,
    taskDate,
    taskPriority,
    taskActions
  );

  return taskItem;
}


/* =========================================
   7. PAGINATION TASK
========================================= */
function renderTaskPagination() {
  /*
   * Ambil seluruh task dari DOM.
   */
  const allTaskItems =
    Array.from(
      taskList.querySelectorAll(
        ".task-item"
      )
    );


  /*
   * Ambil task yang sesuai
   * dengan filter aktif.
   */
  // const taskItems =
  //   getFilteredTaskItems(
  //     allTaskItems
  //   );

  const filteredTaskItems =
  getFilteredTaskItems(
    allTaskItems
  );

const taskItems =
  getSortedTaskItems(
    filteredTaskItems
  );

taskItems.forEach(
  function (taskItem) {
    taskList.append(taskItem);
  }
);
  const totalTasks =
    taskItems.length;

  const totalPages =
    Math.ceil(
      totalTasks / tasksPerPage
    );


  /*
   * Sembunyikan seluruh task dahulu.
   *
   * Setelah itu, hanya task yang sesuai
   * filter dan halaman aktif yang
   * akan ditampilkan kembali.
   */
  allTaskItems.forEach(
    function (taskItem) {
      taskItem.classList.add(
        "task-item--hidden"
      );
    }
  );


  /*
   * Empty state muncul ketika hasil
   * filter tidak menemukan task.
   */
  taskEmptyState.hidden =
    totalTasks > 0;


  /*
   * Kondisi hasil filter kosong.
   */
  if (totalTasks === 0) {
    currentPage = 1;

    taskCountText.textContent =
      "Showing 0–0 of 0 tasks";

    taskPagination.hidden = true;

    taskPagination.style.display =
      "none";

    paginationNumbers.replaceChildren();

    prevPageButton.disabled = true;
    nextPageButton.disabled = true;

    return;
  }


  /*
   * Pastikan halaman aktif masih valid.
   */
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  if (currentPage < 1) {
    currentPage = 1;
  }


  /*
   * Tentukan index task pada
   * halaman yang sedang aktif.
   */
  const startIndex =
    (currentPage - 1) * tasksPerPage;

  const endIndex =
    startIndex + tasksPerPage;


  /*
   * Tampilkan task yang sesuai filter
   * dan berada pada halaman aktif.
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
   * Perbarui tulisan jumlah task.
   */
  const firstTaskNumber =
    startIndex + 1;

  const lastTaskNumber =
    Math.min(
      endIndex,
      totalTasks
    );

  taskCountText.textContent =
    `Showing ${firstTaskNumber}–${lastTaskNumber} of ${totalTasks} tasks`;


  /*
   * Hapus nomor halaman sebelumnya.
   */
  paginationNumbers.replaceChildren();


  /*
   * Buat nomor halaman berdasarkan
   * jumlah hasil filter.
   */
  for (
    let pageNumber = 1;
    pageNumber <= totalPages;
    pageNumber++
  ) {
    const pageButton =
      document.createElement("button");

    pageButton.type = "button";

    pageButton.classList.add(
      "pagination__button"
    );

    pageButton.textContent =
      pageNumber;


    if (pageNumber === currentPage) {
      pageButton.classList.add(
        "pagination__button--active"
      );

      pageButton.setAttribute(
        "aria-current",
        "page"
      );
    }


    pageButton.addEventListener(
      "click",
      function () {
        currentPage = pageNumber;

        renderTaskPagination();
      }
    );


    paginationNumbers.append(
      pageButton
    );
  }


  /*
   * Pagination muncul hanya ketika
   * hasil filter lebih dari satu halaman.
   */
  if (totalPages > 1) {
    taskPagination.hidden = false;

    taskPagination.style.display =
      "flex";
  } else {
    taskPagination.hidden = true;

    taskPagination.style.display =
      "none";
  }


  /*
   * Atur tombol Previous dan Next.
   */
  prevPageButton.disabled =
    currentPage === 1;

  nextPageButton.disabled =
    currentPage === totalPages;
}
//fungsi sort

function getSortedTaskItems(taskItems) {
  const sortedTaskItems =
    [...taskItems];

  const priorityOrder = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  sortedTaskItems.sort(
    function (taskA, taskB) {
      const titleA =
        taskA.dataset.title;

      const titleB =
        taskB.dataset.title;

      const createdAtA =
        Number(
          taskA.dataset.createdAt
        );

      const createdAtB =
        Number(
          taskB.dataset.createdAt
        );

      const dueDateA =
        taskA.dataset.dueDate;

      const dueDateB =
        taskB.dataset.dueDate;

      const priorityA =
        priorityOrder[
          taskA.dataset.priority
        ] || 0;

      const priorityB =
        priorityOrder[
          taskB.dataset.priority
        ] || 0;


      if (activeSort === "newest") {
        return createdAtB - createdAtA;
      }


      if (activeSort === "oldest") {
        return createdAtA - createdAtB;
      }


      if (activeSort === "title-asc") {
        return titleA.localeCompare(titleB);
      }


      if (activeSort === "title-desc") {
        return titleB.localeCompare(titleA);
      }


      if (activeSort === "due-asc") {
        if (!dueDateA && !dueDateB) {
          return 0;
        }

        if (!dueDateA) {
          return 1;
        }

        if (!dueDateB) {
          return -1;
        }

        return dueDateA.localeCompare(
          dueDateB
        );
      }


      if (activeSort === "due-desc") {
        if (!dueDateA && !dueDateB) {
          return 0;
        }

        if (!dueDateA) {
          return 1;
        }

        if (!dueDateB) {
          return -1;
        }

        return dueDateB.localeCompare(
          dueDateA
        );
      }


      if (
        activeSort ===
        "priority-high"
      ) {
        return priorityB - priorityA;
      }


      if (
        activeSort ===
        "priority-low"
      ) {
        return priorityA - priorityB;
      }


      return 0;
    }
  );

  return sortedTaskItems;
}

/* =========================================
   8. MENANGANI SUBMIT FORM
========================================= */

function handleTaskFormSubmit(event) {
  event.preventDefault();


  /*
   * Membaca nilai input.
   */
  const taskTitle =
    taskTitleInput.value.trim();

  const taskCategory =
    taskCategoryInput.value;

  const taskPriority =
    taskPriorityInput.value;

  const taskDueDate =
    taskDueDateInput.value;

  const taskStatus =
    taskStatusInput.value;

  const taskDescription =
    taskDescriptionInput.value.trim();


  /*
   * Validasi judul.
   */
  if (taskTitle === "") {
    showTaskTitleError(
      "Task title is required."
    );

    taskTitleInput.focus();

    return;
  }

  clearTaskTitleError();


  /*
   * Membuat object task baru.
   */
  const newTask = {
    id: Date.now(),
    title: taskTitle,
    category: taskCategory,
    priority: taskPriority,
    dueDate: taskDueDate,
    status: taskStatus,
    description: taskDescription,
  };


  /*
   * Menyimpan data ke array.
   */
  tasks.push(newTask);


  //mengupdate tasks setelah ditambahkan
  updateTaskAnalytics();


  /*
   * Membuat element DOM.
   */
  const taskElement =
    createTaskElement(newTask);


  /*
   * Menampilkan task terbaru di atas.
   */
  taskList.prepend(taskElement);


  /*
   * Kembali ke halaman pertama supaya
   * task baru langsung terlihat.
   */
  currentPage = 1;


  /*
   * Perbarui empty state, jumlah task,
   * serta pagination.
   */
  renderTaskPagination();


  /*
   * Kosongkan form dan tutup modal.
   */
  taskForm.reset();

  closeTaskModal();


  console.log(
    "Task baru:",
    newTask
  );

  console.log(
    "Semua task:",
    tasks
  );
}

/* =========================================
   fungsi filter
========================================= */
function getFilteredTaskItems(
  allTaskItems
) {
  const today =
    getTodayDateString();

  return allTaskItems.filter(
    function (taskItem) {
      const taskStatus =
        taskItem.dataset.status;

      const taskCategory =
        taskItem.dataset.category;

      const taskPriority =
        taskItem.dataset.priority;

      const taskDueDate =
        taskItem.dataset.dueDate;


      /*
       * Filter dari tab.
       */
      let matchesTabFilter = true;

      if (activeFilter === "today") {
        matchesTabFilter =
          taskDueDate === today;
      }

      if (
        activeFilter ===
        "in-progress"
      ) {
        matchesTabFilter =
          taskStatus === "in-progress";
      }

      if (
        activeFilter ===
        "completed"
      ) {
        matchesTabFilter =
          taskStatus === "completed";
      }

      if (activeFilter === "high") {
        matchesTabFilter =
          taskPriority === "High";
      }


      /*
       * Filter kategori.
       */
      const matchesCategory =
        selectedCategory === "all" ||
        taskCategory === selectedCategory;


      /*
       * Filter priority.
       */
      const matchesPriority =
        selectedPriority === "all" ||
        taskPriority === selectedPriority;


      return (
        matchesTabFilter &&
        matchesCategory &&
        matchesPriority
      );
    }
  );
}

/* =========================================
   9. EVENT LISTENER
========================================= */

openTaskModalButton.addEventListener(
  "click",
  openTaskModal
);


if (openQuickTaskModalButton) {
  openQuickTaskModalButton.addEventListener(
    "click",
    openTaskModal
  );
}


closeTaskModalButton.addEventListener(
  "click",
  closeTaskModal
);


taskModalOverlay.addEventListener(
  "click",
  closeTaskModal
);


if (cancelTaskButton) {
  cancelTaskButton.addEventListener(
    "click",
    closeTaskModal
  );
}


taskForm.addEventListener(
  "submit",
  handleTaskFormSubmit
);


taskTitleInput.addEventListener(
  "input",
  clearTaskTitleError
);


/*
 * Tombol previous.
 */
prevPageButton.addEventListener(
  "click",
  function () {
    if (currentPage <= 1) {
      return;
    }

    currentPage--;

    renderTaskPagination();

    taskList.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
);


/*
 * Tombol next.
 */nextPageButton.addEventListener(
  "click",
  function () {
    const totalTasks =
      taskList.querySelectorAll(
        ".task-item"
      ).length;

    const totalPages =
      Math.ceil(
        totalTasks / tasksPerPage
      );

    if (currentPage >= totalPages) {
      return;
    }

    currentPage++;

    renderTaskPagination();

    taskList.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
);


/*
 * Tutup modal dengan tombol Escape.
 */
document.addEventListener(
  "keydown",
  function (event) {
    const modalIsOpen =
      taskModal.classList.contains(
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

taskFilterTabs.addEventListener(
  "click",
  function (event) {
    const filterButton =
      event.target.closest(
        ".filter-tab"
      );

    if (!filterButton) {
      return;
    }


    const filterButtons =
      taskFilterTabs.querySelectorAll(
        ".filter-tab"
      );

    filterButtons.forEach(
      function (button) {
        button.classList.remove(
          "filter-tab--active"
        );
      }
    );


    filterButton.classList.add(
      "filter-tab--active"
    );


    activeFilter =
      filterButton.dataset.filter;

    currentPage = 1;

    renderTaskPagination();

    console.log(
      "Filter aktif:",
      activeFilter
    );
  }
);

filterTaskButton.addEventListener(
  "click",
  function () {
    const filterIsOpen =
      !filterMenu.hidden;

    filterMenu.hidden =
      filterIsOpen;

    filterTaskButton.setAttribute(
      "aria-expanded",
      String(!filterIsOpen)
    );
  }
);

applyFilterButton.addEventListener(
  "click",
  function () {
    selectedCategory =
      filterCategorySelect.value;

    selectedPriority =
      filterPrioritySelect.value;

    currentPage = 1;

    renderTaskPagination();

    filterMenu.hidden = true;

    filterTaskButton.setAttribute(
      "aria-expanded",
      "false"
    );
  }
);

resetFilterButton.addEventListener(
  "click",
  function () {
    selectedCategory = "all";
    selectedPriority = "all";

    filterCategorySelect.value =
      "all";

    filterPrioritySelect.value =
      "all";

    currentPage = 1;

    renderTaskPagination();

    filterMenu.hidden = true;

    filterTaskButton.setAttribute(
      "aria-expanded",
      "false"
    );
  }
);

sortTaskButton.addEventListener(
  "click",
  function () {
    const sortIsOpen =
      !sortMenu.hidden;

    sortMenu.hidden =
      sortIsOpen;

    sortTaskButton.setAttribute(
      "aria-expanded",
      String(!sortIsOpen)
    );

    /*
     * Tutup menu filter ketika
     * menu sort dibuka.
     */
    if (!sortIsOpen) {
      filterMenu.hidden = true;

      filterTaskButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  }
);

// tombol apply
applySortButton.addEventListener(
  "click",
  function () {
    activeSort =
      sortTaskSelect.value;

    currentPage = 1;

    renderTaskPagination();

    sortMenu.hidden = true;

    sortTaskButton.setAttribute(
      "aria-expanded",
      "false"
    );
  }
);

//tombol sort

resetSortButton.addEventListener(
  "click",
  function () {
    activeSort = "newest";

    sortTaskSelect.value =
      "newest";

    currentPage = 1;

    renderTaskPagination();

    sortMenu.hidden = true;

    sortTaskButton.setAttribute(
      "aria-expanded",
      "false"
    );
  }
);

/* =========================================
   10. TAMPILAN AWAL
========================================= */
updateTaskAnalytics(); //menjalankan inisight saat halaman pertama dibuka
renderTaskPagination();