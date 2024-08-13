import {
  fetchData,
  fetchUsernamesAndIDs,
  insertNewUser,
} from "../supabaseService"

// Function to handle the login process when the login button is pressed
export const checkUserExists = async (
  setUserMessage,
  dispatch,
  username,
  password,
  router,
) => {
  const res = await fetchData() // Fetch user data from the database
  const user = Object.entries(res).find(([key, value]) => {
    return value.username === username && value.password === password // Check if the entered username and password match any user
  })
  if (user) {
    setUserMessage("") // Clear any previous error message
    dispatch({
      type: "SET_USER",
      payload: user[1].username, // Set the logged-in user in the global state
    })
    router.push("/Trading") // Redirect to the Trading page upon successful login
  } else {
    setUserMessage("Invalid username or password") // Show error message if credentials are invalid
  }
}

/**
 * Handles the change event of the password input field.
 *
 * @param {Event} e - The change event object.
 * @return {void} This function does not return anything.
 */
export const handlePasswordChange = (e, setPassword, setPasswordMessage) => {
  const newPassword = e.target.value
  setPassword(newPassword)
  if (newPassword.length < 5) {
    setPasswordMessage("Password must be at least 5 characters long.")
  } else {
    setPasswordMessage("")
  }
}

/**
 * Handles the change event of the confirm password input field.
 *
 * @param {Event} e - The change event object.
 * @return {void} This function does not return anything.
 */
export const handleConfirmPasswordChange = (
  e,
  setConfirmPassword,
  setConfirmPasswordMessage,
  password,
) => {
  const newConfirmPassword = e.target.value
  setConfirmPassword(newConfirmPassword)
  if (newConfirmPassword !== password) {
    setConfirmPasswordMessage("Passwords do not match.")
  } else {
    setConfirmPasswordMessage("")
  }
}

export const handleRegisterPressed = (
  setUserMessage,
  setConfirmPasswordMessage,
  username,
  password,
  confirmPassword,
  passwordMessage,
  confirmPasswordMessage,
  dispatch,
  router,
) => {
  setUserMessage("")
  if (username.length === 0) {
    setUserMessage("Please enter a username")
    return
  }
  if (passwordMessage !== "" || confirmPasswordMessage !== "") {
    setUserMessage("Please fix the errors above")
    return
  }
  if (!password || !confirmPassword) {
    setUserMessage("Please enter a password")
    return
  }
  if (password !== confirmPassword) {
    setUserMessage("Passwords do not match")
    return
  }
  setConfirmPasswordMessage("")

  addUser(setConfirmPasswordMessage, dispatch, router, username, password)
}

const addUser = async (
  setConfirmPasswordMessage,
  dispatch,
  router,
  username,
  password,
) => {
  const data = await fetchUsernamesAndIDs()
  const max_id = Math.max(...data.map((user) => user.id))
  const usernames = data.map((user) => user.username)
  const usernameFromDB = usernames.find((user) => user === username)
  if (usernameFromDB) {
    setConfirmPasswordMessage("Username already exists")
    return
  }
  await insertNewUser(max_id + 1, username, password)
  dispatch({ type: "SET_USER", payload: username })
  router.push("/Trading")
}
