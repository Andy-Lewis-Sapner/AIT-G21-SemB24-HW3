import { fetchBalancesForUser, fetchUser, updateData } from "../supabaseService"

// Calculates the total cost based on the selected symbol's price and the amount
export const calculateTotalCost = (state, amount, symbol) => {
  const currentPrice = state.prices[symbol]
    ? parseFloat(state.prices[symbol])
    : 0
  const totalCost = (parseFloat(amount) || 0) * currentPrice
  return totalCost
}

const buy = async (
  setBuyingMessage,
  setAmount,
  state,
  dispatch,
  amount,
  symbol,
) => {
  let res
  if (state.exchangeMode === "Competition") {
    res = await fetchBalancesForUser(state.user) // Fetches balances for competition mode
  } else {
    res = await fetchUser(state.user) // Fetches user data for regular mode
  }

  const totalCost = calculateTotalCost(state, amount, symbol)
  if (res["USD"] < totalCost) {
    setBuyingMessage("Insufficient funds") // Checks if the user has enough USD to buy
    return
  } else {
    const newUsdAmount = res["USD"] - totalCost // Calculates the new USD balance
    const newSymbolAmount = (res[symbol] || 0) + parseFloat(amount) // Updates the amount of the selected cryptocurrency

    // Updates the user data in the database
    const success = await updateData(
      state.user,
      newUsdAmount,
      symbol,
      newSymbolAmount,
      state.exchangeMode === "Regular" ? "Users" : "Balances",
    )

    if (!success) {
      alert("Error updating data. Please try again.") // Alerts the user if there's an error in updating the data
      return
    }

    setAmount(0) // Resets the amount input
    setBuyingMessage(
      `Bought ${amount} ${symbol} for ${totalCost.toFixed(2)} USD`,
    ) // Displays a success message after buying

    // Updates the user balance in the global state
    dispatch({
      type: "SET_USER_BALANCE",
      payload: { ...state.user_balance, [symbol]: newSymbolAmount },
    })
  }
}

// Handles the buying process when the buy button is clicked
export const handleBuying = (
  setBuyingMessage,
  setAmount,
  state,
  dispatch,
  amount,
  symbol,
) => {
  setBuyingMessage("")
  if (amount <= 0) {
    setBuyingMessage("Amount must be greater than 0")
    return
  }
  buy(setBuyingMessage, setAmount, state, dispatch, amount, symbol)
}

const sell = async (
  setSellingMessage,
  setAmount,
  state,
  dispatch,
  amount,
  symbol,
) => {
  let res
  if (state.exchangeMode === "Competition") {
    res = await fetchBalancesForUser(state.user) // Fetches balances for competition mode
  } else {
    res = await fetchUser(state.user) // Fetches user data for regular mode
  }

  const currentSymbolAmount = res[symbol] || 0
  const currentSymbolValue = currentSymbolAmount * state.prices[symbol]
  const totalCost = calculateTotalCost(state, amount, symbol)

  // Check if the user has enough of the selected cryptocurrency to sell
  if (currentSymbolValue < totalCost) {
    setSellingMessage("Insufficient cryptocurrency balance")
    return
  } else {
    // Calculate new balances after selling
    const newUsdAmount = res["USD"] + totalCost
    const newSymbolAmount = currentSymbolAmount - amount

    // Update the user data in the database
    const success = await updateData(
      state.user,
      newUsdAmount,
      symbol,
      newSymbolAmount,
      state.exchangeMode === "Regular" ? "Users" : "Balances",
    )

    if (!success) {
      alert("Error updating data. Please try again.") // Alerts the user if there's an error in updating the data
      return
    }

    // Reset the amount input and display a success message after selling
    setAmount(0)
    setSellingMessage(
      `Sold ${amount} ${symbol} for ${totalCost.toFixed(2)} USD`,
    )

    // Update the user balance in the global state
    dispatch({
      type: "SET_USER_BALANCE",
      payload: { ...state.user_balance, [symbol]: newSymbolAmount },
    })
  }
}

// Handles the selling process when the sell button is clicked
export const handleSelling = (
  setSellingMessage,
  setAmount,
  state,
  dispatch,
  amount,
  symbol,
) => {
  setSellingMessage("")
  if (amount <= 0) {
    setSellingMessage("Amount must be greater than 0")
    return
  }
  sell(setSellingMessage, setAmount, state, dispatch, amount, symbol)
}
