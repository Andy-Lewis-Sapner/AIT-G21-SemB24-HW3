import {
  fetchBalancesForUser,
  updateData,
  fetchUser,
} from "@/utils/supabaseService"
import { useEffect, useState } from "react"
import { usePageContext } from "@/utils/context"

export default function SellTab({ symbols, rates }) {
  const { state, dispatch } = usePageContext()
  const [symbol, setSymbol] = useState("BTC")
  const [amount, setAmount] = useState(0)
  const [sellingMessage, setSellingMessage] = useState("")

  const handleSelectChange = (e) => {
    setSymbol(e.target.value)
  }

  const calculateTotalCost = () => {
    const currentPrice = state.prices[symbol]
      ? parseFloat(state.prices[symbol])
      : 0
    const totalCost = amount * currentPrice
    return totalCost
  }

  const handleSelling = () => {
    setSellingMessage("")
    const sell = async () => {
      let res
      if (state.exchangeMode === "Competition") {
        res = await fetchBalancesForUser(state.user)
        res = res[0]
      } else {
        res = await fetchUser(state.user)
      }

      const currentSymbolAmount = res[symbol] || 0
      const totalCost = calculateTotalCost()
      if (currentSymbolAmount < calculateTotalCost()) {
        setSellingMessage("Insufficient cryptocurrency balance")
        return
      } else {
        const newUsdAmount = res["USD"] + totalCost
        const newSymbolAmount = currentSymbolAmount - parseFloat(totalCost)

        const success = await updateData(
          state.user,
          newUsdAmount,
          symbol,
          newSymbolAmount,
        )
        if (!success) {
          alert("Error updating data. Please try again.")
          return
        }
        setAmount("")
        setSellingMessage(`Sold ${amount} ${symbol} for ${totalCost} USD`)
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
      <select
        defaultValue="currency"
        className="w-10/12 rounded-lg mb-2 dark:bg-slate-300"
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
      <div className="flex flex-row justify-start gap-2">
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          className="rounded-lg dark:bg-slate-300 w-32"
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
      <p className="mt-2">{sellingMessage}</p>
    </div>
  )
}
