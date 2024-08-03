import React, { useEffect, useState } from "react"
import supabase from "@/utils/supabaseClient"
import Meta from "@/components/Meta"
import { fetchCompetitions } from "@/utils/supabaseService"
import { usePageContext } from "@/utils/context"

const Competition = () => {
  const { state, dispatch } = usePageContext()
  const [participants, setParticipants] = useState([])
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null) // New state for success message
  const [timeLeft, setTimeLeft] = useState(null) // New state for countdown timer (10 hours in seconds)

  useEffect(() => {
    const getCompetition = async () => {
      const competitionsDates = await fetchCompetitions()
      console.log(competitionsDates)
      if (competitionsDates.length === 0) return
      let currentCompetitionEndTime
      const now = new Date()
      competitionsDates.forEach((competition) => {
        if (
          new Date(competition.endDate) > now &&
          new Date(competition.startDate) < now
        ) {
          currentCompetitionEndTime = new Date(competition.endDate)
        }
      })

      const timeLeft = (currentCompetitionEndTime - now) / 1000
      setTimeLeft(timeLeft)
    }

    getCompetition()
  }, [])

  useEffect(() => {
    fetchParticipants()

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const fetchParticipants = async () => {
    const { data, error } = await supabase
      .from("Balances")
      .select("*")
      .order("USD", { ascending: false })
      .limit(10)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setParticipants(data)
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(null) // Clear previous success message
    setError(null) // Clear previous error message

    const { data: existingUser, error: existingError } = await supabase
      .from("Balances")
      .select("*")
      .eq("username", userName)

    if (existingError) {
      setError(existingError.message)
      setLoading(false)
      return
    }

    if (existingUser.length > 0) {
      setError("User is already registered for the competition.")
      setLoading(false)
      return
    }

    const { data: user, error: userError } = await supabase
      .from("Users")
      .select("*")
      .eq("username", userName)
      .single()

    if (userError || !user) {
      setError("User not found or error fetching user data.")
      setLoading(false)
      return
    }

    if (user !== state.user) {
      setError("Can't register other users.")
      setLoading(false)
      return
    }

    if (user.USD < 200) {
      setError("Insufficient balance to register for the competition.")
      setLoading(false)
      return
    }

    const updatedBalance = user.USD - 200

    const { error: updateError } = await supabase
      .from("Users")
      .update({ USD: updatedBalance })
      .eq("username", userName)

    if (updateError) {
      setError("Error updating user balance.")
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from("Balances")
      .insert([{ username: userName, USD: 200 }])

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setUserName("")
      setSuccess("Registered successfully!")
      fetchParticipants() // Refresh the participants list
    }
  }

  const resetCompetition = async () => {
    const { error } = await supabase.from("Balances").delete().neq("id", 0) // This will delete all rows

    if (error) {
      setError("Error resetting competition.")
    } else {
      setParticipants([])
      setSuccess("Competition reset successfully! New competition started.")
    }
  }

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400)
    const hrs = Math.floor(seconds / 3600) - days * 24
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${days.toString().padStart(1, "0")}:${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toFixed(0).toString().padStart(2, "0")}`
  }

  return (
    <div>
      <Meta title="Competition" />

      <main className="container mx-auto py-20">
        <div className="flex justify-between items-center mb-6">
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
          <table className="min-w-full bg-white dark:bg-gray-800 dark:border dark:border-gray-700">
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
          onSubmit={handleRegister}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mx-auto max-w-md"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-900 dark:border-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white dark:bg-blue-500 dark:text-white px-6 py-3 rounded-lg text-lg w-full"
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
