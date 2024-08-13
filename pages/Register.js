import Meta from "@/components/Meta"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import { usePageContext } from "@/utils/context"
import {
  handlePasswordChange,
  handleConfirmPasswordChange,
  handleRegisterPressed,
} from "@/utils/logic/loginAndRegisterFunc"

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
              className="form-input"
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
              className="form-input"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                handlePasswordChange(e, setPassword, setPasswordMessage)
              }
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
              className="form-input"
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                handleConfirmPasswordChange(
                  e,
                  setConfirmPassword,
                  setConfirmPasswordMessage,
                  password,
                )
              }
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
              className="form-button"
              type="button"
              onClick={() =>
                handleRegisterPressed(
                  setUserMessage,
                  setConfirmPasswordMessage,
                  username,
                  password,
                  confirmPassword,
                  passwordMessage,
                  confirmPasswordMessage,
                  dispatch,
                  router,
                )
              }
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
