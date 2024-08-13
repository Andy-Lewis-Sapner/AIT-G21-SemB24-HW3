import { useEffect, useState, useRef } from "react"
import { usePageContext } from "@/utils/context"
import { configWebsocketEvents } from "@/utils/logic/realTimeFunc"

export default function RealTimeTicker({ rates, symbols }) {
  const { state, dispatch } = usePageContext()
  const [price, setPrice] = useState(null) // State to store the current price and change indicator
  const socketRef = useRef(null) // Reference to the WebSocket connection

  // Reconfigure WebSocket events when chosen crypto or preferred currency changes
  useEffect(() => {
    configWebsocketEvents(socketRef, state, setPrice, rates, dispatch, symbols)
  }, [state.chosenCrypto, state.preferredCurrency])

  return (
    <div className="max-w-[300px] mb-4 mx-auto h-[54px] items-center">
      <div className="text-2xl">
        <span>{price}</span>
      </div>
    </div>
  )
}
