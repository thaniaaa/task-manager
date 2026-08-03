const today =
  new Date();


export const state = {
  tasks: [],

  tasksPerPage: 6,

  currentPage: 1,

  activeFilter: "all",

  activeSort: "newest",

  searchQuery: "",

  activeView: "dashboard",

  selectedCategory: "all",

  selectedPriority: "all",

  editingTaskId: null,

  calendarYear:
    today.getFullYear(),

  calendarMonth:
    today.getMonth(),

  selectedCalendarDate: "",


};
