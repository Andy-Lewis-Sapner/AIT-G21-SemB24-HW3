import {
  fetchBalancesForUser,
  updateData,
  fetchUser,
} from "@/utils/supabaseService"
import { useState } from "react"
import { usePageContext } from "@/utils/context"
import { calculateTotalCost, handleSelling } from "@/utils/logic/buyAndSellFunc"

export default function SellTab({ symbols, rates }) {
  const { state, dispatch } = usePageContext()
  const [symbol, setSymbol] = useState("BTC") // State to manage the selected cryptocurrency symbol
  const [amount, setAmount] = useState(0) // State to manage the amount of cryptocurrency to sell
  const [sellingMessage, setSellingMessage] = useState("") // State to store the message after selling

  return (
    <div>
      {/* Dropdown to select the cryptocurrency to sell */}
      <select
        defaultValue="currency"
        className="w-10/12 rounded-lg mb-2 bg-inherit"
        onChange={(e) => setSymbol(e.target.value)}
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
        <span className="py-2">
          {`${calculateTotalCost(state, amount, symbol).toFixed(2)} (${state.preferredCurrency})`}
        </span>
        <button
          onClick={() =>
            handleSelling(
              setSellingMessage,
              setAmount,
              state,
              dispatch,
              amount,
              symbol,
            )
          }
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
