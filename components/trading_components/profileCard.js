import { usePageContext } from "@/utils/context"
import React, { useState } from "react"

export default function ProfileCard({ rates }) {
  const { state, dispatch } = usePageContext()
  const [modeButton, setModeButton] = useState("Competition Mode")

  const changeModeButton = () => {
    setModeButton((prevMode) =>
      prevMode === "Competition Mode" ? "Regular Mode" : "Competition Mode",
    )
  }

  const handleSelectChange = (e) => {
    dispatch({ type: "SET_PREFERED_CURRENCY", payload: e.target.value })
  }

  return (
    <div className="flex justify-between ring rounded-lg ring-gray-300 p-4 rounde-lg">
      <div className="flex justify-start">
        <img
          src="https://picsum.photos/200"
          className="h-10 w-10 rounded-full"
        />
        <div className="ml-2 mt-2 font-semibold">Name ({modeButton})</div>
      </div>
      <div className="flex flex-row gap-4">
        <button className="text-blue-500" onClick={changeModeButton}>
          {"Switch to " + modeButton}
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
