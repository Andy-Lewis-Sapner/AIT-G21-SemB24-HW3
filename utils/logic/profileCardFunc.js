import { fetchBalancesForUser } from "../supabaseService"

// Handles the mode switch between "Competition" and "Regular"
export const changeModeButton = (setModeButton, modeButton, dispatch) => {
  setModeButton((prevMode) =>
    prevMode === "Competition" ? "Regular" : "Competition",
  )
  dispatch({ type: "SET_EXCHANGE_MODE", payload: modeButton })
}

export const getBalance = async (dispatch, setHiddenClass, state) => {
  const data = await fetchBalancesForUser(state.user)
  if (Object.keys(data).length > 0) {
    dispatch({ type: "SET_BALANCE", payload: data.USD }) // Update the balance in the global state
    setHiddenClass("") // Show elements if balance data is available
  } else {
    setHiddenClass("hidden") // Hide elements if no balance data is available
  }
}
