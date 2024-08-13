import { useEffect, useRef, useState } from "react"
import { usePageContext } from "@/utils/context"
import RealTimeTicker from "./realTimeTicker"
import {
  createChart,
  establishWebSocket,
  handleChangeSymbol,
  updateChartWhenChartDataIsChanged,
  updateChartWhenPriceIsChanged,
} from "@/utils/logic/realTimeFunc"

export default function RealTimeChart({ rates, symbols }) {
  const { state, dispatch } = usePageContext()
  const previousCurrencyRef = useRef(state.preferredCurrency)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: `Price (${state.preferredCurrency})`,
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  }) // State to store chart data including labels and dataset
  const chartRef = useRef(null) // Reference to the chart DOM element
  const chartInstance = useRef(null) // Reference to the Chart.js instance
  const socketRef = useRef(null) // Reference to the WebSocket connection

  const maxPoints = 60 // Maximum data points to display on the chart

  // Initializes the Chart.js instance and updates it when chartData changes
  useEffect(() => {
    return createChart(chartRef, chartData, chartInstance)
  }, [chartData])

  // Establishes a WebSocket connection to receive real-time data
  useEffect(() => {
    return establishWebSocket(socketRef, state, setChartData, maxPoints, rates)
  }, [state.chosenCrypto])

  // Updates the chart when the preferred currency or rates change
  useEffect(() => {
    updateChartWhenPriceIsChanged(
      chartInstance,
      chartData,
      state,
      rates,
      previousCurrencyRef.current,
    )
    previousCurrencyRef.current = state.preferredCurrency
  }, [state.preferredCurrency, rates])

  // Updates the chart when chartData changes
  useEffect(() => {
    updateChartWhenChartDataIsChanged(chartInstance, chartData)
  }, [chartData])

  return (
    <div className="max-w-[300px] mt-4 mx-auto pb-10">
      <div className="flex justify-center gap-4 font-semibold pb-2">
        <div className="py-1">Symbol</div>
        <select
          onChange={(e) => handleChangeSymbol(e, dispatch, setChartData, state)}
          className="border border-gray-500 rounded-md w-[100px] px-2 py-1 bg-inherit"
          value={state.chosenCrypto}
        >
          {symbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>
      <RealTimeTicker rates={rates} symbols={symbols} />
      <div className="w-[100%] h-[300px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}
