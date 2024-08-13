import { fetchUser, updateData } from "../supabaseService"

// Handles the deposit process when the form is submitted
export const handleDeposit = async (
  e,
  amount,
  setUserMessage,
  state,
  router,
) => {
  e.preventDefault()

  // Validation checks for the deposit amount
  if (isNaN(amount)) {
    setUserMessage("Amount must be a number")
    return
  } else if (amount <= 0) {
    setUserMessage("Amount must be greater than 0")
    return
  }

  // Fetch the current user data
  const user = await fetchUser(state.user)

  // Update the user balance with the deposited amount
  const deposit = await updateData(
    state.user,
    user.USD + parseFloat(amount),
    null,
    0,
    state.exchangeMode === "Competition" ? "Balances" : "Users",
  )

  // Provide feedback based on the success or failure of the withdrawal
  if (deposit) {
    setUserMessage("Deposit successful")
    router.push("/Trading") // Redirect to the Trading page
  } else {
    setUserMessage("Deposit failed")
  }
}

// Handle the withdrawal process when the form is submitted
export const handleWithdraw = async (
  e,
  amount,
  setUserMessage,
  state,
  router,
) => {
  e.preventDefault()

  // Validate the withdrawal amount
  if (isNaN(amount)) {
    setUserMessage("Amount must be a number")
    return
  } else if (amount <= 0) {
    setUserMessage("Amount must be greater than 0")
    return
  }

  // Fetch the user's current balance
  const user = await fetchUser(state.user)

  // Check if the user has sufficient balance for the withdrawal
  if (amount > user.USD) {
    setUserMessage("Insufficient balance")
  } else {
    // Update the user's balance after withdrawal
    const withdraw = await updateData(
      state.user,
      user.USD - amount,
      null,
      0,
      state.exchangeMode === "Competition" ? "Balances" : "Users",
    )

    // Provide feedback based on the success or failure of the withdrawal
    if (withdraw) {
      setUserMessage("Withdrawal successful")
      router.push("/Trading") // Redirect to the Trading page
    } else {
      setUserMessage("Withdrawal failed")
    }
  }
}
