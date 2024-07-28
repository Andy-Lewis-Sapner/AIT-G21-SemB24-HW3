import Meta from "@/components/Meta"
import { fetchData } from "@/utils/supabaseService"
import { useState } from "react"
import { usePageContext } from "@/utils/context"
import { useRouter } from "next/router"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const { state, dispatch } = usePageContext()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [userMessage, setUserMessage] = useState("")

  const handleLoginPressed = (e) => {
    const checkUserExists = async () => {
      const res = await fetchData()
      const user = Object.entries(res).find(([key, value]) => {
        return value.username === username && value.password === password
      })
      if (user) {
        setUserMessage("")
        dispatch({
          type: "SET_USER",
          payload: user[1].username,
        })
        router.push("/Trading")
      } else {
        setUserMessage("Invalid username or password")
      }
    }

    checkUserExists()
  }

  return (
    <div>
      <Meta title="Login" />
      <div className="w-full m-auto py-32 bg-slate-50 dark:bg-gray-800 h-full">
        <h1 className="text-4xl text-center font-bold text-slate-800 dark:text-gray-100 mb-4 pt-4">
          Login
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center justify-center pt-2">
            <p className="text-red-500 dark:text-red-400 mb-3">{userMessage}</p>
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
              onClick={handleLoginPressed}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
