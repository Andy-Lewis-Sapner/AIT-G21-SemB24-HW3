import {
  fetchBalancesForUser,
  updateData,
  fetchUser,
} from "@/utils/supabaseService"
import { useEffect, useState } from "react"
import { usePageContext } from "@/utils/context"

export default function SellTab({ symbols, rates }) {
  const { state, dispatch } = usePageContext()
  const [symbol, setSymbol] = useState("BTC") // State to manage the selected cryptocurrency symbol
  const [amount, setAmount] = useState(0) // State to manage the amount of cryptocurrency to sell
  const [sellingMessage, setSellingMessage] = useState("") // State to store the message after selling

  // Handles the change of the selected cryptocurrency symbol
  const handleSelectChange = (e) => {
    setSymbol(e.target.value)
  }

  // Calculates the total cost/value based on the selected symbol's price and the amount to sell
  const calculateTotalCost = () => {
    const currentPrice = state.prices[symbol]
      ? parseFloat(state.prices[symbol])
      : 0
    const totalCost = amount * currentPrice
    return totalCost
  }

  // Handles the selling process when the sell button is clicked
  const handleSelling = () => {
    setSellingMessage("")
    if (amount <= 0) {
      setSellingMessage("Amount must be greater than 0")
      return
    }

    const sell = async () => {
      let res
      if (state.exchangeMode === "Competition") {
        res = await fetchBalancesForUser(state.user) // Fetches balances for competition mode
      } else {
        res = await fetchUser(state.user) // Fetches user data for regular mode
      }

      const currentSymbolAmount = res[symbol] || 0
      const currentSymbolValue = currentSymbolAmount * state.prices[symbol]
      const totalCost = calculateTotalCost()

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
    sell()
  }

  return (
    <div>
      {/* Dropdown to select the cryptocurrency to sell */}
      <select
        defaultValue="currency"
        className="w-10/12 rounded-lg mb-2 bg-inherit"
        onChange={handleSelectChange}
      >
        <option value="currency" disabled>
          Select currency to sell
        </option>
        {symbols.map((element, index) => (
          <option key={index} value={element}>
            {element}
          </option>
        ))}
      </select>

      {/* Input field for the amount and display of total value */}
      <div className="flex flex-row justify-start gap-2">
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          className="rounded-lg bg-inherit w-32"
          onChange={(e) => {
            setAmount(e.target.value)
            setSellingMessage("")
          }}
        />
        <span className="py-2">{`${(calculateTotalCost() * rates[state.preferredCurrency]).toFixed(2)} (${state.preferredCurrency})`}</span>
        <button
          onClick={handleSelling}
          className="bg-blue-300 hover:bg-blue-400 pb-1 px-3 rounded-2xl"
        >
          Sell
        </button>
      </div>

      {/* Display of selling message */}
      <p className="mt-2">{sellingMessage}</p>
    </div>
  )
}
