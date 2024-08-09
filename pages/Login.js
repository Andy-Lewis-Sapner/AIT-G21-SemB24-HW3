import Meta from "@/components/Meta"
import { fetchData } from "@/utils/supabaseService"
import { useState } from "react"
import { usePageContext } from "@/utils/context"
import { useRouter } from "next/router"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const { state, dispatch } = usePageContext() // Access the global state and dispatch function
  const [username, setUsername] = useState("") // State to manage the entered username
  const [password, setPassword] = useState("") // State to manage the entered password
  const [userMessage, setUserMessage] = useState("") // State to manage the user feedback message

  // Function to handle the login process when the login button is pressed
  const handleLoginPressed = (e) => {
    const checkUserExists = async () => {
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

    checkUserExists() // Execute the user existence check
  }

  return (
    <div>
      <Meta title="Login" /> {/* Set the page title to "Login" */}
      <div className="w-full m-auto py-32 h-full">
        <h1 className="text-4xl text-center font-bold text-slate-800 dark:text-gray-100 mb-4 pt-4">
          Login
        </h1>
        <form className="w-1/2 mx-auto flex flex-col justify-between max-w-[500px]">
          {/* Username Input */}
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
              onChange={(e) => setUsername(e.target.value)} // Update username state on change
              required
            />
          </div>

          {/* Password Input */}
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
              onChange={(e) => setPassword(e.target.value)} // Update password state on change
              required
            />
          </div>

          {/* Login Button and User Message */}
          <div className="flex flex-col items-center justify-center pt-2">
            <p className="text-red-500 dark:text-red-400 mb-3">{userMessage}</p>{" "}
            {/* Display error message */}
            <p className="mb-3 dark:text-gray-300">
              Don&apos;t have an account? Press here to{" "}
              <Link
                href="/Register"
                className="text-blue-500 dark:text-blue-300"
              >
                Register
              </Link>
            </p>
            <button
              className="bg-blue-500 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleLoginPressed} // Handle login when the button is clicked
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
