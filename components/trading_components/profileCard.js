import { usePageContext } from "@/utils/context"
import { fetchBalancesForUser } from "@/utils/supabaseService"
import Image from "next/image"
import React, { useEffect, useState } from "react"

export default function ProfileCard({ rates }) {
  const { state, dispatch } = usePageContext()
  const [modeButton, setModeButton] = useState(
    state.exchangeMode === "Competition" ? "Regular" : "Competition",
  ) // State to manage the text on the mode switch button
  const [hiddenClass, setHiddenClass] = useState("") // State to manage the visibility of certain elements

  // Set the preferred currency to USD on component mount
  useEffect(() => {
    dispatch({ type: "SET_PREFERED_CURRENCY", payload: "USD" })
  }, [dispatch])

  // Handles the mode switch between "Competition" and "Regular"
  const changeModeButton = () => {
    setModeButton((prevMode) =>
      prevMode === "Competition" ? "Regular" : "Competition",
    )
    dispatch({ type: "SET_EXCHANGE_MODE", payload: modeButton })
  }

  // Handles changes to the preferred currency selection
  const handleSelectChange = (e) => {
    dispatch({ type: "SET_PREFERED_CURRENCY", payload: e.target.value })
  }

  // Fetches user balance and updates the component state based on the balance
  useEffect(() => {
    const getBalance = async () => {
      const data = await fetchBalancesForUser(state.user)
      if (Object.keys(data).length > 0) {
        dispatch({ type: "SET_BALANCE", payload: data.USD }) // Update the balance in the global state
        setHiddenClass("") // Show elements if balance data is available
      } else {
        setHiddenClass("hidden") // Hide elements if no balance data is available
      }
    }

    getBalance()
  }, [state.exchangeMode, state.user, dispatch])

  return (
    <div className="flex justify-between ring rounded-lg ring-gray-300 p-4 rounde-lg dark:bg-slate-300 dark:ring-gray-600">
      {/* User profile picture and display name with exchange mode */}
      <div className="flex justify-start">
        <Image
          src="https://picsum.photos/40"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full"
          alt="Profile"
        />
        <div className="ml-2 mt-2 font-semibold">
          {state.user} ({state.exchangeMode + " Mode"})
        </div>
      </div>
      {/* Mode switch button and currency selection dropdown */}
      <div className="flex flex-row gap-4">
        <button
          className={"text-blue-500 " + hiddenClass}
          onClick={changeModeButton}
        >
          {"Switch to " + modeButton + " Mode"}
        </button>
        <select
          className="rounded-lg bg-inherit"
          onChange={handleSelectChange}
          value={state.preferedCurrency}
        >
          {rates && Object.keys(rates).length > 0 ? (
            Object.keys(rates).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))
          ) : (
            <option value="">No rates available</option>
          )}
        </select>
      </div>
    </div>
  )
}
