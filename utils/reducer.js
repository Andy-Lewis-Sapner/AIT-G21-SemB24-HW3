export const initialState = {
  preferredCurrency: "USD",
}

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PREFERED_CURRENCY":
      return {
        ...state,
        preferredCurrency: action.payload,
      }
    default:
      return state
  }
}
