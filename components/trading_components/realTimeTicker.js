import { useEffect, useState, useRef } from "react"
import { usePageContext } from "@/utils/context"

export default function RealTimeTicker({ rates, symbols }) {
  const { state, dispatch } = usePageContext()
  const [price, setPrice] = useState(null) // State to store the current price and change indicator
  const [time, setTime] = useState() // State to store the last update time
  const socketRef = useRef(null) // Reference to the WebSocket connection

  const wsURL = "wss://mtickers.mtw-testnet.com" // WebSocket URL for real-time data

  // Dispatches updated prices for all symbols to the global state
  const dispatchAllPrices = (e) => {
    const data = JSON.parse(e.data)
    const updatedPrices = {}

    symbols.forEach((symbol) => {
      const symbolData = data[symbol]
      if (symbolData) {
        let price = parseFloat(symbolData.p)
        if (rates[state.preferredCurrency]) {
          price = (price * rates[state.preferredCurrency]).toFixed(2)
        }
        updatedPrices[symbol] = price
      }
    })

    dispatch({ type: "SET_PRICES", payload: updatedPrices })
  }

  // Configures WebSocket events to handle incoming real-time data
  const configWebsocketEvents = () => {
    if (socketRef.current) {
      socketRef.current.close() // Close any existing WebSocket connection
    }

    socketRef.current = new WebSocket(wsURL) // Establish a new WebSocket connection

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data)[state.chosenCrypto]
      if (data === undefined) return

      let p = parseFloat(data.p)
      if (rates[state.preferredCurrency]) {
        p = (p * rates[state.preferredCurrency]).toFixed(2)
      }
      const a = parseFloat(data.c).toFixed(2)
      const col = a <= 0 ? "text-red-500" : "text-green-500"
      const sign = a <= 0 ? "▼" : "▲"
      const change = (
        <span className={`ml-5`}>
          <span className={col}>{sign}</span>
          <b className="ml-1 mr-1">{a}</b>
        </span>
      )

      // Update the price with the change indicator and time
      setPrice(
        <div className="border border-gray-400 p-4 text-center rounded-md">
          {p}
          {change}
        </div>,
      )
      setTime(new Date(data.t).toLocaleString())
      dispatchAllPrices(e) // Dispatch all updated prices to the global state
    }
  }

  // Reconfigure WebSocket events when chosen crypto or preferred currency changes
  useEffect(() => {
    configWebsocketEvents()
  }, [state.chosenCrypto, state.preferredCurrency])

  return (
    <div className="max-w-[300px] mb-4 mx-auto h-[54px] items-center">
      <div className="text-2xl">
        <span>{price}</span>
      </div>
    </div>
  )
}
