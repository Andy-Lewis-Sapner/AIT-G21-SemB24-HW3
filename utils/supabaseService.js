import supabase from "./supabaseClient"

// Fetch all data from the "Users" table
export const fetchData = async () => {
  const { data, error } = await supabase.from("Users").select("*")

  if (error) {
    console.error("Error fetching data:", error)
    return [] // Return an empty array if there is an error
  }
  return data // Return the fetched data
}

// Fetch only the usernames and IDs from the "Users" table
export const fetchUsernamesAndIDs = async () => {
  const { data, error } = await supabase.from("Users").select("id, username")

  if (error) {
    console.error("Error fetching data:", error)
    return [] // Return an empty array if there is an error
  }
  return data // Return the fetched data
}

// Fetch balance information for a specific user from the "Balances" table
export const fetchBalancesForUser = async (username) => {
  const { data, error } = await supabase
    .from("Balances")
    .select("*")
    .eq("username", username)
    .single() // Expect a single record

  if (error) {
    console.error("Error fetching data:", error)
    return [] // Return an empty array if there is an error
  }
  return data // Return the fetched data
}

// Fetch user information from the "Users" table based on the username
export const fetchUser = async (username) => {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("username", username)
    .single() // Expect a single record

  if (error) {
    console.error("Error fetching data:", error)
    return null // Return null if there is an error
  }
  return data // Return the fetched data
}

// Fetch all data from the "Balances" table
export const fetchData_comp = async () => {
  const { data, error } = await supabase.from("Balances").select("*")

  if (error) {
    console.error("Error fetching data:", error)
    return [] // Return an empty array if there is an error
  }
  return data // Return the fetched data
}

// Insert a new user with an initial USD balance into the "Users" table
export const insertData = async (username, usdAmount) => {
  const { data, error } = await supabase
    .from("Users")
    .insert([{ username, USD: parseFloat(usdAmount) }]) // Ensure USD is stored as a float

  if (error) {
    console.error("Error inserting data:", error)
    return null // Return null if there is an error
  }
  return data // Return the inserted data
}

// Insert a new user with a specified ID, username, and password into the "Users" table
export const insertNewUser = async (id, username, password) => {
  const { data, error } = await supabase
    .from("Users")
    .insert([{ id, username, password }])

  if (error) {
    console.error("Error inserting data:", error)
    return null // Return null if there is an error
  }
  return data // Return the inserted data
}

// Update the USD balance and optionally the cryptocurrency amount for a user in the specified table
export const updateData = async (
  username,
  newUsdAmount,
  symbol,
  newAmount,
  table,
) => {
  let updateError = null

  if (symbol) {
    // Update both USD and the specified cryptocurrency balance
    const { error } = await supabase
      .from(table)
      .update({ USD: newUsdAmount, [symbol]: newAmount })
      .eq("username", username)
    updateError = error
  } else {
    // Update only the USD balance
    const { error } = await supabase
      .from(table)
      .update({ USD: newUsdAmount })
      .eq("username", username)
    updateError = error
  }

  if (updateError) {
    console.error("Error updating data:", updateError)
    return false // Return false if there was an error
  }
  return true // Return true if the update was successful
}

// Fetch all data from the "Competitions" table
export const fetchCompetitions = async () => {
  const { data, error } = await supabase.from("Competitions").select("*")

  if (error) {
    console.error("Error fetching data:", error)
    return [] // Return an empty array if there is an error
  }
  return data // Return the fetched data
}

// Function to fetch the list of participants from the "Balances" table
export const fetchParticipants = async (
  setError,
  setLoading,
  setParticipants,
) => {
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
