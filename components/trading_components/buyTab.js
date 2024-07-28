import {
  fetchBalancesForUser,
  updateData,
  fetchUser,
} from "@/utils/supabaseService"
import { useEffect, useState } from "react"
import { usePageContext } from "@/utils/context"
export default function BuyTab({ symbols, rates }) {
  const { state, dispatch } = usePageContext()
  const [symbol, setSymbol] = useState("BTC")
  const [amount, setAmount] = useState(0)
  const [buyingMessage, setBuyingMessage] = useState("")

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

  const handleBuying = () => {
    setBuyingMessage("")
    const buy = async () => {
      let res
      if (state.exchangeMode === "Competition") {
        res = await fetchBalancesForUser(state.user)
        res = res[0]
      } else {
        res = await fetchUser(state.user)
      }
      const totalCost = calculateTotalCost()
      if (res["USD"] < totalCost) {
        setBuyingMessage("Insufficient funds")
        return
      } else {
        const newUsdAmount = res["USD"] - totalCost
        const newSymbolAmount =
          (res[symbol] || 0) + parseFloat(amount) * state.prices[symbol]
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
        setBuyingMessage(`Bought ${amount} ${symbol} for ${totalCost} USD`)
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
      <select
        defaultValue="currency"
        className="w-10/12 rounded-lg mb-2 dark:bg-slate-300"
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
      <div className="flex flex-row justify-start gap-2">
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          className="rounded-lg dark:bg-slate-300 w-32"
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
      <p className="mt-2">{buyingMessage}</p>
    </div>
  )
}
