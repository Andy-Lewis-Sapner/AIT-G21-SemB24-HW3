export const initialState = {
  preferredCurrency: "USD",
  chosenCrypto: "BTC",
  exchangeMode: "Regular",
  user: typeof window !== "undefined" ? localStorage.getItem("user") : null,
  user_balance: undefined,
  prices: {},
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
