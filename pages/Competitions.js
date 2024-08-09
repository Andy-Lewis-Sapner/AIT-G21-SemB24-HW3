import React, { useEffect, useState } from "react"
import supabase from "@/utils/supabaseClient"
import Meta from "@/components/Meta"
import {
  fetchCompetitions,
  fetchData_comp,
  fetchUser,
  updateData,
} from "@/utils/supabaseService"
import { usePageContext } from "@/utils/context"

const Competition = () => {
  const { state, dispatch } = usePageContext()
  const [participants, setParticipants] = useState([]) // State to store the list of participants
  const [userName, setUserName] = useState("") // State to store the user's name input
  const [loading, setLoading] = useState(true) // State to manage loading state
  const [error, setError] = useState(null) // State to store error messages
  const [success, setSuccess] = useState(null) // State to store success messages
  const [timeLeft, setTimeLeft] = useState(null) // State to store the countdown timer in seconds

  // Function to fetch the current competition's end time and calculate the time left
  const getCompetition = async () => {
    const competitionsDates = await fetchCompetitions()
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

  // Initial fetch for competition data
  useEffect(() => {
    getCompetition()
  }, [])

  // Fetch participants and start a countdown timer
  useEffect(() => {
    fetchParticipants()

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          resetCompetition()
          getCompetition()
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Function to fetch the list of participants from the "Balances" table
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

  // Handles user registration for the competition
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(null) // Clear previous success message
    setError(null) // Clear previous error message

    // Check if user is already registered
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

    // Fetch user data from "Users" table
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

    // Prevent users from registering other users
    if (userName !== state.user) {
      setError("Can't register other users.")
      setLoading(false)
      return
    }

    // Check if user has sufficient balance to register
    if (user.USD < 200) {
      setError("Insufficient balance to register for the competition.")
      setLoading(false)
      return
    }

    const updatedBalance = user.USD - 200

    // Update the user's balance in the "Users" table
    const { error: updateError } = await supabase
      .from("Users")
      .update({ USD: updatedBalance })
      .eq("username", userName)

    if (updateError) {
      setError("Error updating user balance.")
      setLoading(false)
      return
    }

    // Insert user into the "Balances" table for the competition
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

  // Resets the competition by clearing the "Balances" table and restoring user balances
  const resetCompetition = async () => {
    const balances = await fetchData_comp()
    balances.forEach(async (balance) => {
      const user = await fetchUser(balance.username)
      if (!user) return
      const updatedBalance = user.USD + balance.USD
      await updateData(balance.username, updatedBalance, null, 0, "Users")
    })
    const { error } = await supabase.from("Balances").delete().neq("id", 0) // This will delete all rows

    if (error) {
      setError("Error resetting competition.")
    } else {
      setParticipants([])
      setSuccess("Competition reset successfully! New competition started.")
    }
  }

  // Formats the time left into days, hours, minutes, and seconds
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

      <main className="container mx-auto py-20 max-w-[90%]">
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-900 dark:border-gray-700"
              required
            />
            <div className="block text-gray-700 dark:text-gray-300 text-sm font-bold mt-2">
              You must have $200 USD in your account to register.
            </div>
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
