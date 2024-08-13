import { useEffect, useState } from "react"
import { usePageContext } from "@/utils/context"
import { useRouter } from "next/router"
import {
  fetchCurrenciesSymbols,
  setHidden,
  fetchBalances,
} from "@/utils/logic/balanceFunc"

export default function Balance({ rates, symbols }) {
  const router = useRouter()
  const { state, dispatch } = usePageContext()
  const [holdings, setHoldings] = useState({})
  const [balance, setBalance] = useState(0)
  const [currencies, setCurrencies] = useState({})
  const [hiddenFunction, setHiddenFunction] = useState("")

  // Fetches the list of currency symbols from a local JSON file
  useEffect(() => {
    fetchCurrenciesSymbols(setCurrencies)
  }, [])

  // Toggles the visibility of certain functions based on the exchange mode
  useEffect(() => {
    setHidden(state, setHiddenFunction)
  }, [state.exchangeMode])

  // Fetches balances whenever the user or exchange mode changes
  useEffect(() => {
    fetchBalances(state, symbols, setHoldings, setBalance)
  }, [state.user, state.exchangeMode])

  // Updates user balance in the context and fetches the latest balances
  useEffect(() => {
    fetchBalances(state, symbols, setHoldings, setBalance)
    // dispatch({ type: "SET_USER_BALANCE", payload: holdings })
  }, [state.user_balance])

  // Renders the component with the user's cryptocurrency holdings and balance
  return (
    <div className="p-4 bg-inherit rounded-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Cryptocurrency Holdings:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-inherit">
          {holdings &&
            Object.entries(holdings).map(([crypto, amount]) => {
              let value = (amount * state.prices[crypto]).toFixed(2)
              return (
                <div
                  key={crypto}
                  className="bg-gray-100 dark:bg-gray-400 p-4 rounded-lg shadow-md"
                >
                  <h4 className="text-lg font-medium">{crypto}</h4>
                  <p className="font-semibold text-sm text-gray-600 dark:text-gray-100">
                    Amount: {amount}
                  </p>
                  <p className="font-semibold text-sm text-gray-600 dark:text-gray-100">
                    Value: {`${value}${currencies[state.preferredCurrency]}`}
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
          className={"deposit-button" + ` ${hiddenFunction}`}
          onClick={() => router.push("/Deposit")}
        >
          Deposit
        </button>
        <button
          className={"withdraw-button" + ` ${hiddenFunction}`}
          onClick={() => router.push("/Withdraw")}
        >
          Withdraw
        </button>
      </div>
    </div>
  )
}
