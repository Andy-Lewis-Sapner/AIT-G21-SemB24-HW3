import { fetchBalancesForUser, fetchUser } from "@/utils/supabaseService"
import { useEffect, useState } from "react"
import { usePageContext } from "@/utils/context"

export default function Balance({ rates, symbols }) {
  const { state, dispatch } = usePageContext()
  const [holdings, setHoldings] = useState({})
  const [usdBalance, setUsdBalance] = useState(0)

  const fetchBalances = async () => {
    let res
    if (state.exchangeMode === "Competition") {
      res = await fetchBalancesForUser(state.user)
      res = res[0]
    } else {
      res = await fetchUser(state.user)
    }
    const filteredHoldings = Object.entries(res).reduce((acc, [key, value]) => {
      if (symbols.includes(key)) {
        acc[key] = value
      }
      if (key === "USD" || key === "balance") {
        setUsdBalance(value)
      }
      return acc
    }, {})
    setHoldings(filteredHoldings)
  }

  useEffect(() => {
    fetchBalances()
  }, [state.user, state.exchangeMode])

  useEffect(() => {
    fetchBalances()
    dispatch({ type: "SET_USER_BALANCE", payload: holdings })
  }, [state.user_balance])

  return (
    <div className="p-4 bg-inherit rounded-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Cryptocurrency Holdings:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {holdings &&
            Object.entries(holdings).map(([crypto, amount]) => {
              const usdValue = amount.toFixed(2)
              return (
                <div
                  key={crypto}
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <h4 className="text-lg font-medium">{crypto}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Value: ${usdValue}
                  </p>
                </div>
              )
            })}
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">USD Balance:</h3>
        <p className="text-2xl font-bold">${usdBalance.toFixed(2)}</p>
      </div>
    </div>
  )
}
