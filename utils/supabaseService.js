import supabase from "./supabaseClient"

export const fetchData = async () => {
  const { data, error } = await supabase.from("Users").select("*")

  if (error) {
    console.error("Error fetching data:", error)
    return []
  }
  return data
}

export const fetchUsernamesAndIDs = async () => {
  const { data, error } = await supabase.from("Users").select("id, username")

  if (error) {
    console.error("Error fetching data:", error)
    return []
  }
  return data
}

export const fetchBalancesForUser = async (username) => {
  const { data, error } = await supabase
    .from("Balances")
    .select("*")
    .eq("user_name", username)

  if (error) {
    console.error("Error fetching data:", error)
    return []
  }
  return data
}

export const fetchUser = async (username) => {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("username", username)
    .single()

  if (error) {
    console.error("Error fetching data:", error)
    return null
  }
  return data
}

export const fetchData_comp = async () => {
  const { data, error } = await supabase.from("Balances").select("*")

  if (error) {
    console.error("Error fetching data:", error)
    return []
  }
  return data
}

export const insertData = async (username, usdAmount) => {
  const { data, error } = await supabase
    .from("Users")
    .insert([{ username, USD: parseFloat(usdAmount) }])

  if (error) {
    console.error("Error inserting data:", error)
    return null
  }
  return data
}

export const insertNewUser = async (id, username, password) => {
  const { data, error } = await supabase
    .from("Users")
    .insert([{ id, username, password }])

  if (error) {
    console.error("Error inserting data:", error)
    return null
  }
  return data
}

export const updateData = async (username, newUsdAmount, symbol, newAmount) => {
  let updateError = null
  if (symbol) {
    const { error } = await supabase
      .from("Users")
      .update({ USD: newUsdAmount, [symbol]: newAmount })
      .eq("username", username)
    updateError = error
  } else {
    const { error } = await supabase
      .from("Users")
      .update({ USD: newUsdAmount })
      .eq("username", username)
    updateError = error
  }

  if (updateError) {
    console.error("Error updating data:", updateError)
    return false
  }
  return true
}

export const upsertData = async (username, usdAmount) => {
  // Check if the username already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("Users")
    .select("id, USD")
    .eq("username", username)
    .single()

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching user data:", fetchError)
    return null
  }

  if (existingUser) {
    // User exists, update the USD amount
    const newUsdAmount = existingUser.USD + parseFloat(usdAmount)
    const success = await updateData(existingUser.id, newUsdAmount)
    return success ? { id: existingUser.id, username, USD: newUsdAmount } : null
  } else {
    // User does not exist, insert a new record
    const data = await insertData(username, usdAmount)
    return data ? data[0] : null
  }
}
