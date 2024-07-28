import { useEffect, useState, useRef } from "react"
import { usePageContext } from "@/utils/context"

export default function RealTimeTicker({ rates, symbols }) {
  const { state, dispatch } = usePageContext()
  const [price, setPrice] = useState(null)
  const [time, setTime] = useState()
  const socketRef = useRef(null)

  const wsURL = "wss://mtickers.mtw-testnet.com"

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

  const configWebsocketEvents = () => {
    if (socketRef.current) {
      socketRef.current.close()
    }

    socketRef.current = new WebSocket(wsURL)

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

      setPrice(
        <div className="border border-gray-400 p-4 text-center rounded-md">
          {p}
          {change}
        </div>,
      )
      setTime(new Date(data.t).toLocaleString())
      dispatchAllPrices(e)
    }
  }

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
