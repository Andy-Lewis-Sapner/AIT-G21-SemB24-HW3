import {
  fetchCompetitions,
  fetchData_comp,
  updateData,
  fetchUser,
  fetchParticipants,
} from "../supabaseService"
import supabase from "../supabaseClient"

// Function to fetch the current competition's end time and calculate the time left
export const getCompetition = async (setTimeLeft) => {
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

// Resets the competition by clearing the "Balances" table and restoring user balances
export const resetCompetition = async (
  setError,
  setParticipants,
  setSuccess,
) => {
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

// Handles user registration for the competition
export const handleRegister = async (
  e,
  setLoading,
  setError,
  setSuccess,
  setUserName,
  setParticipants,
  userName,
  state,
) => {
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
    fetchParticipants(setError, setLoading, setParticipants) // Refresh the participants list
  }
}

// Formats the time left into days, hours, minutes, and seconds
export const formatTime = (seconds) => {
  const days = Math.floor(seconds / 86400)
  const hrs = Math.floor(seconds / 3600) - days * 24
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${days.toString().padStart(1, "0")}:${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toFixed(0).toString().padStart(2, "0")}`
}
