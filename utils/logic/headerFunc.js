export const setHidden = (state, setHiddenClass) => {
  if (state.user) {
    setHiddenClass("")
  } else setHiddenClass("hidden")
}

export const initializeTheme = (setDarkMode) => {
  const savedDarkMode = localStorage.getItem("isDarkmode") === "true"
  setDarkMode(savedDarkMode)
  if (savedDarkMode) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

// Toggles between light and dark mode
export const toggleTheme = (setDarkMode, darkMode) => {
  setDarkMode(!darkMode)
  localStorage.setItem("isDarkmode", !darkMode)
  if (!darkMode) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}
