import Meta from "@/components/Meta"
import { useState } from "react"
import { usePageContext } from "@/utils/context"
import { useRouter } from "next/router"
import Link from "next/link"
import { checkUserExists } from "@/utils/logic/loginAndRegisterFunc"

export default function Login() {
  const router = useRouter()
  const { state, dispatch } = usePageContext() // Access the global state and dispatch function
  const [username, setUsername] = useState("") // State to manage the entered username
  const [password, setPassword] = useState("") // State to manage the entered password
  const [userMessage, setUserMessage] = useState("") // State to manage the user feedback message

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
              className="form-input"
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
              className="form-input"
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
              className="form-button"
              type="button"
              onClick={(e) =>
                checkUserExists(
                  setUserMessage,
                  dispatch,
                  username,
                  password,
                  router,
                )
              } // Handle login when the button is clicked
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
