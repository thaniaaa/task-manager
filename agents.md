# ZIPZIP PROJECT ENGINEERING CONTEXT

Version: 1.0

## Purpose
This file is the engineering context for Codex when refactoring and debugging ZIPZIP Task Manager.

## Project
ZIPZIP Task Manager is a frontend web application built with:

- HTML5
- CSS3
- Vanilla JavaScript ES Modules

Main features:

- Dashboard
- Task CRUD
- Search
- Filter
- Sorting
- Pagination
- Calendar
- Completed Tasks
- Theme switching

## Core Rule

This is an existing working project.

Do not rewrite from zero.

Prioritize:
1. Stability
2. Maintainability
3. Small incremental changes

Never rename existing IDs/classes without approval.

## Current Status

Completed:

- HTML structure cleanup
- DOM mapping
- Sidebar navigation
- Dashboard view
- My Tasks view
- Calendar view
- Completed view
- Modal task creation
- CRUD task operations
- Search
- Filter
- Calendar rendering

Current work:
- CSS cleanup
- View layout stabilization
- Refactoring safely

## File Responsibility

### dom.js
Only handles DOM selectors.

No business logic.

### state.js
Stores global application state:

- tasks
- activeFilter
- searchKeyword
- currentPage
- itemsPerPage
- editingTaskId
- calendarYear
- calendarMonth

### views.js
Handles:

- Sidebar navigation
- View switching
- Page title
- Element visibility

Views:

- dashboard
- tasks
- calendar
- completed

### calendar.js
Handles:

- Calendar generation
- Month navigation
- Today highlight
- Task markers

### modal.js
Handles:

- Open modal
- Close modal
- Create mode
- Edit mode

### tasks.js
Handles:

- Create
- Update
- Delete
- Complete

## Important IDs

Do not rename:

Layout:
- dashboardLayout
- dashboardContent
- dashboardAside
- welcomeSection
- statisticsSection
- tasksPanel
- taskList

Calendar:
- calendarWidget
- calendarDays
- calendarMonthLabel
- calendarFullView
- calendarPageDays
- calendarPageMonthLabel

Modal:
- taskModal
- taskForm
- taskTitle
- taskCategory
- taskPriority
- taskDueDate
- taskStatus
- taskDescription
- submitTaskButton
- cancelTaskButton

Search:
- searchTaskForm
- searchTaskInput

## Important Classes

Do not rename:

- dashboard-layout
- dashboard-layout--single
- dashboard-layout--calendar
- dashboard-content
- dashboard-aside
- welcome-section
- statistics-grid
- stat-card
- tasks-panel
- tasks-panel--full
- task-toolbar
- filter-tabs
- filter-tab
- calendar-widget
- calendar-days
- calendar-day
- modal
- modal__dialog

## View Rules

Dashboard:
Show:
- welcomeSection
- statisticsSection
- tasksPanel
- dashboardAside

Hide:
- calendarFullView


My Tasks:
Show:
- welcomeSection
- tasksPanel

Hide:
- statisticsSection
- dashboardAside
- calendarFullView


Calendar:
Show:
- calendarFullView

Hide:
- statisticsSection
- tasksPanel
- dashboardAside


Completed:
Show:
- welcomeSection
- tasksPanel

Filter:
completed

## Debugging Workflow

Always check:

HTML
↓
DOM selector
↓
State
↓
View controller
↓
Renderer
↓
CSS

Do not immediately modify CSS before verifying logic.

## Known Bugs History

Modal null errors:
Cause:
Missing HTML IDs.

Calendar layout issues:
Cause:
CSS conflicts, not calendar logic.

My Tasks showing calendar:
Cause:
View visibility handling.

## CSS Rules

Remove:

- duplicate selectors
- conflicting overrides
- unused styles

Keep:

- Existing class names
- Existing UI identity
- Existing components

## Acceptance Test

Before finishing changes verify:

Navigation:
- Dashboard
- My Tasks
- Calendar
- Completed

Tasks:
- Create
- Edit
- Delete
- Complete

Search:
- Works

Filter:
- All
- Today
- In Progress
- Completed
- High Priority

Calendar:
- Change month
- Today highlight
- Task marker

Modal:
- Open
- Close
- Submit

## Final Instruction

Treat ZIPZIP as an existing production codebase.

Make minimal safe changes.
Do not break working features.
