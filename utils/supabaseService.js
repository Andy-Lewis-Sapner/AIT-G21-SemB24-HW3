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
    .eq("username", username)
    .single()

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

export const updateData = async (
  username,
  newUsdAmount,
  symbol,
  newAmount,
  table,
) => {
  let updateError = null
  if (symbol) {
    const { error } = await supabase
      .from(table)
      .update({ USD: newUsdAmount, [symbol]: newAmount })
      .eq("username", username)
    updateError = error
  } else {
    const { error } = await supabase
      .from(table)
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

export const fetchCompetitions = async () => {
  const { data, error } = await supabase.from("Competitions").select("*")

  if (error) {
    console.error("Error fetching data:", error)
    return []
  }
  return data
}
