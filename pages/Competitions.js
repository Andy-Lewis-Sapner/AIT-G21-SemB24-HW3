import React, { useEffect, useState } from "react"
import Meta from "@/components/Meta"
import { fetchParticipants } from "@/utils/supabaseService"
import { usePageContext } from "@/utils/context"
import {
  getCompetition,
  handleRegister,
  formatTime,
  resetCompetition,
} from "@/utils/logic/competitionsFunc"

const Competition = () => {
  const { state, dispatch } = usePageContext()
  const [participants, setParticipants] = useState([]) // State to store the list of participants
  const [userName, setUserName] = useState("") // State to store the user's name input
  const [loading, setLoading] = useState(true) // State to manage loading state
  const [error, setError] = useState(null) // State to store error messages
  const [success, setSuccess] = useState(null) // State to store success messages
  const [timeLeft, setTimeLeft] = useState(null) // State to store the countdown timer in seconds

  // Initial fetch for competition data
  useEffect(() => {
    getCompetition(setTimeLeft)
  }, [])

  // Fetch participants and start a countdown timer
  useEffect(() => {
    fetchParticipants(setError, setLoading, setParticipants)

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          resetCompetition(setError, setParticipants, setSuccess)
          getCompetition(setTimeLeft)
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <Meta title="Competition" />

      <main className="container mx-auto py-20 max-w-[90%]">
        <div className="flex justify-between items-center mb-6 gap-8">
          <h2 className="text-4xl font-bold dark:text-white">Leaderboard</h2>
          <div className="text-lg dark:text-gray-300">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>
        {loading ? (
          <p className="dark:text-gray-300">Loading...</p>
        ) : error ? (
          <p className="dark:text-red-500">Error: {error}</p>
        ) : (
          <table className="competitions-table">
            <thead>
              <tr>
                <th className="py-2 dark:text-white">Username</th>
                <th className="py-2 dark:text-white">Balance</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr
                  key={participant.id}
                  className={
                    index % 2 === 0
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "dark:bg-gray-800"
                  }
                >
                  <td className="py-2 text-center dark:text-gray-300">
                    {participant.username}
                  </td>
                  <td className="py-2 text-center dark:text-gray-300">
                    {participant.USD.toFixed(2) + "$"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 className="text-4xl font-bold mt-10 mb-6 text-center dark:text-white">
          Register for Competition
        </h2>
        <form
          onSubmit={(e) =>
            handleRegister(
              e,
              setLoading,
              setError,
              setSuccess,
              setUserName,
              setParticipants,
              userName,
              state,
            )
          }
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mx-auto max-w-md"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
              htmlFor="username"
            >
              Please insert your username to register:
            </label>
            <input
              id="username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="register-to-competition-input"
              required
            />
            <div className="block text-gray-700 dark:text-gray-300 text-sm font-bold mt-2">
              You must have $200 USD in your account to register.
            </div>
          </div>
          <button
            type="submit"
            className="competition-register-button"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {success && (
          <p className="text-green-500 dark:text-green-400 text-center mt-4">
            {success}
          </p>
        )}
      </main>
    </div>
  )
}

export default Competition
