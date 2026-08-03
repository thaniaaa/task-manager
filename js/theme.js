import { dom } from "./dom.js";


const themeStorageKey =
  "zipzip-theme";


function readSavedTheme() {
  try {
    return localStorage.getItem(
      themeStorageKey
    );
  } catch {
    return null;
  }
}


function saveTheme(theme) {
  try {
    localStorage.setItem(
      themeStorageKey,
      theme
    );
  } catch {
    /*
     * The theme still works when
     * storage is unavailable.
     */
  }
}


function updateThemeButton(
  isDarkTheme
) {
  if (!dom.themeToggleButton) {
    return;
  }

  dom.themeToggleButton.setAttribute(
    "aria-pressed",
    String(isDarkTheme)
  );

  dom.themeToggleButton.setAttribute(
    "aria-label",
    isDarkTheme
      ? "Switch to light theme"
      : "Switch to dark theme"
  );

  if (dom.themeToggleIcon) {
    dom.themeToggleIcon.className =
      isDarkTheme
        ? "bi bi-moon-stars"
        : "bi bi-sun";
  }

  if (dom.themeToggleText) {
    dom.themeToggleText.textContent =
      isDarkTheme
        ? "Dark"
        : "Light";
  }
}


function applyTheme(theme) {
  const isDarkTheme =
    theme === "dark";

  document.body.classList.toggle(
    "dark-theme",
    isDarkTheme
  );

  document.documentElement.classList.remove(
    "dark-theme-preload"
  );

  updateThemeButton(
    isDarkTheme
  );
}


export function setupTheme() {
  if (!dom.themeToggleButton) {
    return;
  }

  const savedTheme =
    readSavedTheme();

  applyTheme(
    savedTheme === "dark"
      ? "dark"
      : "light"
  );

  dom.themeToggleButton.addEventListener(
    "click",
    function () {
      const nextTheme =
        document.body.classList.contains(
          "dark-theme"
        )
          ? "light"
          : "dark";

      applyTheme(nextTheme);
      saveTheme(nextTheme);
    }
  );
}
