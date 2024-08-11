import Meta from "@/components/Meta"
import { fetchUsernamesAndIDs, insertNewUser } from "@/utils/supabaseService"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import { usePageContext } from "@/utils/context"

/**
 * Register function is a React component that renders a form for user registration.
 * It uses React hooks to manage state for username, password, and confirmPassword.
 * It also handles password validation and displays error messages if necessary.
 *
 * @return {JSX.Element} A JSX element containing the registration form.
 */
export default function Register() {
  const router = useRouter()
  const { state, dispatch } = usePageContext()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("")
  const [userMessage, setUserMessage] = useState("")

  /**
   * Handles the change event of the password input field.
   *
   * @param {Event} e - The change event object.
   * @return {void} This function does not return anything.
   */
  const handlePasswordChange = (e) => {
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
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value
    setConfirmPassword(newConfirmPassword)
    if (newConfirmPassword !== password) {
      setConfirmPasswordMessage("Passwords do not match.")
    } else {
      setConfirmPasswordMessage("")
    }
  }

  const handleRegisterPressed = (e) => {
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
    const addUser = async () => {
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
    addUser()
  }

  return (
    <div>
      <Meta title="Register" />
      <div className="w-full m-auto py-32 h-full">
        <h1 className="text-4xl text-center font-bold text-slate-800 dark:text-gray-100 mb-4 pt-4">
          Register
        </h1>
        <form className="w-1/2 mx-auto flex flex-col justify-between max-w-[500px]">
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 dark:bg-gray-300 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 dark:bg-gray-300 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {passwordMessage && (
              <p className="text-red-500 dark:text-red-400 text-xs italic pt-1">
                {passwordMessage}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 dark:bg-gray-300 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            {confirmPasswordMessage && (
              <p className="text-red-500 dark:text-red-400 text-xs italic pt-1">
                {confirmPasswordMessage}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center justify-center pt-2">
            <p className="mb-3 dark:text-gray-300">
              Already have an account? Press here to{" "}
              <Link href="/Login" className="text-blue-500 dark:text-blue-300">
                Login
              </Link>
            </p>
            <button
              className="bg-blue-500 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleRegisterPressed}
            >
              Register
            </button>
            <p className="text-red-500 dark:text-red-400 text-xs italic pt-1">
              {userMessage}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
