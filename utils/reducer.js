export const initialState = {
  preferredCurrency: "USD", // Default currency for transactions and display
  chosenCrypto: "BTC", // Default cryptocurrency selected
  exchangeMode: "Regular", // Mode of the exchange, could be 'Regular' or 'Competition'
  user: typeof window !== "undefined" ? localStorage.getItem("user") : null, // Retrieve the user from localStorage if available
  user_balance: undefined, // User's balance, will be set later
  prices: {}, // Object to hold current prices of cryptocurrencies
}

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PREFERED_CURRENCY":
      return {
        ...state,
        preferredCurrency: action.payload,
      }
    case "SET_CHOSEN_CRYPTO":
      return {
        ...state,
        chosenCrypto: action.payload,
      }
    case "SET_EXCHANGE_MODE":
      return {
        ...state,
        exchangeMode: action.payload,
      }
    case "SET_USER":
      if (action.payload) localStorage.setItem("user", action.payload)
      else localStorage.removeItem("user")
      return {
        ...state,
        user: action.payload,
      }
    case "SET_USER_BALANCE":
      return {
        ...state,
        user_balance: action.payload,
      }
    case "SET_USER_COMPETITIONS":
      return {
        ...state,
        user_competitions: action.payload,
      }
    case "SET_PRICES":
      return {
        ...state,
        prices: action.payload,
      }
    default:
      return state
  }
}
