import {
  fetchBalancesForUser,
  updateData,
  fetchUser,
} from "@/utils/supabaseService"
import { useEffect, useState } from "react"
import { usePageContext } from "@/utils/context"

export default function BuyTab({ symbols, rates }) {
  const { state, dispatch } = usePageContext()
  const [symbol, setSymbol] = useState("BTC") // State to store the selected cryptocurrency symbol
  const [amount, setAmount] = useState(0) // State to store the amount of cryptocurrency to buy
  const [buyingMessage, setBuyingMessage] = useState("") // State to store the message after buying

  // Handles the selection change for the cryptocurrency symbol
  const handleSelectChange = (e) => {
    setSymbol(e.target.value)
  }

  // Calculates the total cost based on the selected symbol's price and the amount
  const calculateTotalCost = () => {
    const currentPrice = state.prices[symbol]
      ? parseFloat(state.prices[symbol])
      : 0
    const totalCost = amount * currentPrice
    return totalCost
  }

  // Handles the buying process when the buy button is clicked
  const handleBuying = () => {
    setBuyingMessage("")
    if (amount <= 0) {
      setBuyingMessage("Amount must be greater than 0")
      return
    }

    const buy = async () => {
      let res
      if (state.exchangeMode === "Competition") {
        res = await fetchBalancesForUser(state.user) // Fetches balances for competition mode
      } else {
        res = await fetchUser(state.user) // Fetches user data for regular mode
      }

      const totalCost = calculateTotalCost()
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
    buy()
  }

  return (
    <div>
      {/* Dropdown to select the currency to buy */}
      <select
        defaultValue="currency"
        className="w-10/12 rounded-lg mb-2 bg-inherit"
        onChange={handleSelectChange}
      >
        <option value="currency" disabled>
          Select currency to buy
        </option>
        {symbols.map((element, index) => (
          <option key={index} value={element}>
            {element}
          </option>
        ))}
      </select>

      {/* Input field for the amount and display of total cost */}
      <div className="flex flex-row justify-start gap-2">
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          className="rounded-lg bg-inherit w-32"
          onChange={(e) => {
            setAmount(e.target.value)
            setBuyingMessage("")
          }}
        />
        <span className="py-2">{`${(calculateTotalCost() * rates[state.preferredCurrency]).toFixed(2)} (${state.preferredCurrency})`}</span>
        <button
          onClick={handleBuying}
          className="bg-blue-300 hover:bg-blue-400 pb-1 px-3 rounded-2xl"
        >
          Buy
        </button>
      </div>

      {/* Display of buying message */}
      <p className="mt-2">{buyingMessage}</p>
    </div>
  )
}
