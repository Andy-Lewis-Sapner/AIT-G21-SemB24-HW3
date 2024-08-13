import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { usePageContext } from "@/utils/context"
import Link from "next/link"
import {
  initializeTheme,
  setHidden,
  toggleTheme,
} from "@/utils/logic/headerFunc"

export default function Header() {
  const { state, dispatch } = usePageContext()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false) // State to manage the mobile menu visibility
  const [hiddenClass, setHiddenClass] = useState(state.user ? "hidden" : "") // State to manage visibility of login/register buttons
  const [darkMode, setDarkMode] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  ) // State to manage dark mode

  // Updates the visibility of login/register buttons based on user authentication status
  useEffect(() => {
    setHidden(state, setHiddenClass)
  }, [state.user])

  // Initializes the theme based on saved preference in localStorage
  useEffect(() => {
    initializeTheme(setDarkMode)
  }, [])

  return (
    <header className="bg-blue-100 dark:bg-blue-900 text-black dark:text-white p-3">
      <div className="max-w-[1000px] w-full mx-auto flex justify-between items-center">
        {/* Logo or Home Button */}
        <Link href="/" className="flex items-center">
          <svg
            fill={darkMode ? "#ffffff" : "#000000"}
            width="25px"
            height="25px"
            viewBox="0 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG content for logo or home icon */}
            <path d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h16q2.464 0 4.224-1.76t1.76-4.224v-4h2.016q0.8 0 1.408-0.576t0.576-1.44v-8q0-0.832-0.576-1.408t-1.408-0.576h-2.016v-4q0-2.496-1.76-4.256t-4.224-1.76h-16q-2.496 0-4.256 1.76t-1.76 4.256v20zM4 26.016v-20q0-0.832 0.576-1.408t1.44-0.608h16q0.8 0 1.408 0.608t0.576 1.408v4h-5.984q-0.832 0-1.44 0.576t-0.576 1.408v8q0 0.832 0.576 1.44t1.44 0.576h1.984v1.984h2.016v-1.984h1.984v4q0 0.832-0.576 1.408t-1.408 0.576h-16q-0.832 0-1.44-0.576t-0.576-1.408zM6.016 24q0 0.832 0.576 1.44t1.408 0.576v-2.016h-1.984zM6.016 22.016h1.984v-2.016h-1.984v2.016zM6.016 18.016h1.984v-2.016h-1.984v2.016zM6.016 14.016h1.984v-2.016h-1.984v2.016zM6.016 10.016h1.984v-2.016h-1.984v2.016zM8 8h2.016v-1.984h-2.016v1.984zM10.016 26.016h1.984v-2.016h-1.984v2.016zM12 8h2.016v-1.984h-2.016v1.984zM14.016 26.016h1.984v-2.016h-1.984v2.016zM16 8h2.016v-1.984h-2.016v1.984zM18.016 26.016h1.984v-2.016h-1.984v2.016zM18.016 20v-8h12v8h-12zM20 16q0 0.832 0.576 1.44t1.44 0.576 1.408-0.576 0.576-1.44-0.576-1.408-1.408-0.576-1.44 0.576-0.576 1.408zM20 8h2.016q0-0.832-0.608-1.408t-1.408-0.576v1.984z"></path>
          </svg>
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button
          className="block sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {/* Hamburger icon for opening menu */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1.5em"
            viewBox="0 0 448 512"
            className={menuOpen ? "hidden" : ""}
          >
            <path
              fill={darkMode ? "#ffffff" : "#000000"}
              d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
            />
          </svg>
          {/* Close icon for closing menu */}
          <svg
            className={menuOpen ? "" : "hidden"}
            xmlns="http://www.w3.org/2000/svg"
            height="1.5em"
            viewBox="0 0 384 512"
          >
            <path
              fill={darkMode ? "#ffffff" : "#000000"}
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            />
          </svg>
        </button>

        {/* Mobile Menu Content */}
        <div
          className={`absolute top-[56px] left-0 bg-blue-300 p-3 w-full ${menuOpen ? "block" : "hidden"}`}
        >
          {/* Menu Items */}
          <Link
            className={"block py-1 px-2 " + hiddenClass}
            href="/Trading"
            onClick={() => setMenuOpen(false)}
          >
            Trading
          </Link>
          <Link
            className={"block py-1 px-2 " + hiddenClass}
            href="/Competitions"
            onClick={() => setMenuOpen(false)}
          >
            Competitions
          </Link>
          <Link
            className={"block py-1 px-2 " + hiddenClass}
            href="/Tutorial"
            onClick={() => setMenuOpen(false)}
          >
            Tutorial
          </Link>

          {/* Authentication Buttons */}
          <div className="pt-3 flex flex-col">
            <Link
              className={`login-register-buttons ${state.user ? "hidden" : ""}`}
              href="/Login"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              className={`login-register-buttons ${state.user ? "hidden" : ""}`}
              href="/Register"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
            <button
              className={`logout-button ${state.user ? "" : "hidden"}`}
              onClick={() => {
                dispatch({ type: "SET_USER", payload: undefined })
                dispatch({ type: "SET_USER_BALANCE", payload: undefined })
                dispatch({ type: "SET_USER_COMPETITIONS", payload: undefined })
                dispatch({ type: "SET_EXCHANGE_MODE", payload: "Regular" })
                router.push("/")
                setMenuOpen(false)
              }}
            >
              Log Out
            </button>

            {/* Dark Mode Toggle */}
            <div className="flex items-center pt-2">
              <button
                className="w-12 h-6 rounded-full bg-white flex items-center transition duration-300 focus:outline-none shadow"
                onClick={() => toggleTheme(setDarkMode, darkMode)}
              >
                <div
                  id="switch-toggle"
                  className={`w-6 h-6 relative rounded-full transition duration-500 transform p-1 text-white ${
                    darkMode
                      ? "bg-gray-700 translate-x-full"
                      : "bg-yellow-500 -translate-x-1"
                  }`}
                >
                  {darkMode ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Menu Items */}
        <div className="hidden sm:flex justify-start gap-2">
          <Link
            className={
              "hover:bg-blue-200 rounded-lg px-2 dark:hover:bg-blue-800 " +
              hiddenClass
            }
            href="/Trading"
          >
            Trading
          </Link>
          <Link
            className={
              "hover:bg-blue-200 rounded-lg px-2 dark:hover:bg-blue-800 " +
              hiddenClass
            }
            href="/Competitions"
          >
            Competitions
          </Link>
          <Link
            className={
              "hover:bg-blue-200 rounded-lg px-2 dark:hover:bg-blue-800 " +
              hiddenClass
            }
            href="/Tutorial"
          >
            Tutorial
          </Link>
        </div>

        {/* Desktop Authentication Buttons and Dark Mode Toggle */}
        <div className="hidden sm:flex justify-end gap-4 items-center">
          <Link
            className={`bg-blue-200 hover:bg-blue-300 active:bg-blue-400 dark:bg-gray-500 dark:hover:bg-gray-600 dark:active:bg-gray-700 rounded-lg py-1 px-2 ${hiddenClass === "hidden" ? "" : "hidden"}`}
            href="/Login"
          >
            Login
          </Link>
          <Link
            className={`bg-blue-300 hover:bg-blue-300 active:bg-blue-400 dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-800 rounded-lg py-1 px-2 ${hiddenClass === "hidden" ? "" : "hidden"}`}
            href="/Register"
          >
            Register
          </Link>
          <button
            className={`bg-blue-200 hover:bg-blue-300 active:bg-blue-400 dark:bg-gray-500 dark:hover:bg-gray-600 dark:active:bg-gray-700 rounded-lg py-1 px-2 ${hiddenClass}`}
            onClick={() => {
              dispatch({ type: "SET_USER", payload: undefined })
              dispatch({ type: "SET_USER_BALANCE", payload: undefined })
              dispatch({ type: "SET_USER_COMPETITIONS", payload: undefined })
              dispatch({ type: "SET_EXCHANGE_MODE", payload: "Regular" })
              router.push("/")
            }}
          >
            Log Out
          </button>
          <div className="flex items-center">
            <button
              className="w-12 h-6 rounded-full bg-white flex items-center transition duration-300 focus:outline-none shadow"
              onClick={() => toggleTheme(setDarkMode, darkMode)}
            >
              <div
                id="switch-toggle"
                className={`w-6 h-6 relative rounded-full transition duration-500 transform p-1 text-white ${
                  darkMode
                    ? "bg-gray-700 translate-x-full"
                    : "bg-yellow-500 -translate-x-1"
                }`}
              >
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
