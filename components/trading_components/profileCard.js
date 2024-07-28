import { usePageContext } from "@/utils/context"
import { fetchBalancesForUser } from "@/utils/supabaseService"
import Image from "next/image"
import React, { useEffect, useState } from "react"

export default function ProfileCard({ rates }) {
  const { state, dispatch } = usePageContext()
  const [modeButton, setModeButton] = useState("Competition")
  const [hiddenClass, setHiddenClass] = useState("")

  const changeModeButton = () => {
    setModeButton((prevMode) =>
      prevMode === "Competition" ? "Regular" : "Competition",
    )
    dispatch({ type: "SET_EXCHANGE_MODE", payload: modeButton })
  }

  const handleSelectChange = (e) => {
    dispatch({ type: "SET_PREFERED_CURRENCY", payload: e.target.value })
  }

  useEffect(() => {
    const getBalance = async () => {
      const data = await fetchBalancesForUser(state.user)
      console.log(data)
      if (Object.keys(data).length > 0) {
        dispatch({ type: "SET_BALANCE", payload: data[0].balance })
        setHiddenClass("")
      } else {
        setHiddenClass("hidden")
      }
    }

    getBalance()
  }, [state.exchangeMode, state.user, dispatch])

  return (
    <div className="flex justify-between ring rounded-lg ring-gray-300 p-4 rounde-lg">
      <div className="flex justify-start">
        <Image
          src="https://picsum.photos/200"
          className="h-10 w-10 rounded-full"
          alt="Profile"
        />
        <div className="ml-2 mt-2 font-semibold">
          {state.user} ({state.exchangeMode + " Mode"})
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <button
          className={"text-blue-500 " + hiddenClass}
          onClick={changeModeButton}
        >
          {"Switch to " + modeButton + " Mode"}
        </button>
        <select
          className="rounded-lg"
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
