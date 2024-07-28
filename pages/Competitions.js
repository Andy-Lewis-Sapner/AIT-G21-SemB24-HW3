import React, { useEffect, useState } from "react"
import supabase from "@/utils/supabaseClient"
import Meta from "@/components/Meta"

const Competition = () => {
  const [participants, setParticipants] = useState([])
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null) // New state for success message
  const [timeLeft, setTimeLeft] = useState(10) // New state for countdown timer (10 hours in seconds)

  useEffect(() => {
    fetchParticipants()

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          resetCompetition()
          return 36000
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
      .order("balance", { ascending: false })
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
      .eq("user_name", userName)

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
      .insert([{ user_name: userName, balance: 200, type: 1 }])

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
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div>
      <Meta title="Competition" />

      <main className="container mx-auto py-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold">Leaderboard</h2>
          <div className="text-lg">Time Left: {formatTime(timeLeft)}</div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Username</th>
                <th className="py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr
                  key={participant.id}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="py-2 text-center">{participant.user_name}</td>
                  <td className="py-2 text-center">{participant.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 className="text-4xl font-bold mt-10 mb-6 text-center">
          Register for Competition
        </h2>
        <form
          onSubmit={handleRegister}
          className="bg-white p-6 rounded-lg shadow-md mx-auto max-w-md"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg w-full"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {success && (
          <p className="text-green-500 text-center mt-4">{success}</p>
        )}
      </main>
    </div>
  )
}

export default Competition
