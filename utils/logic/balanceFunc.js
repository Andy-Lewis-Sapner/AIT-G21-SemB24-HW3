import { fetchBalancesForUser, fetchUser } from "../supabaseService"

// Fetches the list of currency symbols from a local JSON file
export const fetchCurrenciesSymbols = async (setCurrencies) => {
  const res = await fetch("./currencies.json")
  const data = await res.json()
  setCurrencies(data)
}

export const setHidden = (state, setHiddenFunction) => {
  if (state.exchangeMode === "Competition") {
    setHiddenFunction("hidden")
  } else {
    setHiddenFunction("")
  }
}

// Fetches the user's balances or holdings based on the exchange mode
export const fetchBalances = async (
  state,
  symbols,
  setHoldings,
  setBalance,
) => {
  let res
  if (state.exchangeMode === "Competition") {
    res = await fetchBalancesForUser(state.user)
  } else {
    res = await fetchUser(state.user)
  }

  // Filters holdings to only include symbols provided, sets balance for USD
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
