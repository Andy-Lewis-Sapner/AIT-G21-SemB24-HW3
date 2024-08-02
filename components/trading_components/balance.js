import { fetchBalancesForUser, fetchUser } from "@/utils/supabaseService"
import { useEffect, useState } from "react"
import { usePageContext } from "@/utils/context"
import { useRouter } from "next/router"

export default function Balance({ rates, symbols }) {
  const { state, dispatch } = usePageContext()
  const [holdings, setHoldings] = useState({})
  const [balance, setBalance] = useState(0)
  const router = useRouter()
  const [currencies, setCurrencies] = useState({})

  useEffect(() => {
    const fetchCurrenciesSymbols = async () => {
      const res = await fetch("./currencies.json")
      const data = await res.json()
      setCurrencies(data)
    }

    fetchCurrenciesSymbols()
  }, [])

  const fetchBalances = async () => {
    let res
    if (state.exchangeMode === "Competition") {
      res = await fetchBalancesForUser(state.user)
    } else {
      res = await fetchUser(state.user)
    }
    const filteredHoldings = Object.entries(res).reduce((acc, [key, value]) => {
      if (symbols.includes(key)) {
        acc[key] = value
      }
      if (key === "USD") {
        setBalance(value)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-inherit">
          {holdings &&
            Object.entries(holdings).map(([crypto, amount]) => {
              const value =
                amount.toFixed(2) *
                state.prices[crypto] *
                rates[state.preferredCurrency]
              return (
                <div
                  key={crypto}
                  className="bg-gray-100 dark:bg-gray-400 p-4 rounded-lg shadow-md"
                >
                  <h4 className="text-lg font-medium">{crypto}</h4>
                  <p className="text-gray-600 dark:text-gray-100">
                    Amount: {amount.toFixed(2) + "\n"}
                    Value:{" "}
                    {`${value.toFixed(2)}${currencies[state.preferredCurrency]}`}
                  </p>
                </div>
              )
            })}
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">
          {`${state.preferredCurrency}`} Balance:
        </h3>
        <p className="text-2xl font-bold">
          {(balance * rates[state.preferredCurrency]).toFixed(2)}
          {currencies[state.preferredCurrency]}
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          onClick={() => router.push("/Deposit")}
        >
          Deposit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
          onClick={() => router.push("/Withdraw")}
        >
          Withdraw
        </button>
      </div>
    </div>
  )
}
