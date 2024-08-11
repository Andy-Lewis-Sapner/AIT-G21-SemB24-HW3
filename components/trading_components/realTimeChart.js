import { useEffect, useRef, useState } from "react"
import { Chart } from "chart.js/auto"
import { usePageContext } from "@/utils/context"
import RealTimeTicker from "./realTimeTicker"

export default function RealTimeChart({ rates, symbols }) {
  const { state, dispatch } = usePageContext()
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

  // Formats timestamp into HH:MM:SS format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  // Updates the chart data with the latest price
  const updateChartData = (symbol, price) => {
    setChartData((prevData) => {
      const newData = { ...prevData }

      if (newData.labels.length >= maxPoints) {
        // Shift data left when maxPoints is exceeded
        newData.labels.shift()
        newData.datasets[0].data.shift()
      }

      // Add the new time and price data
      newData.labels.push(formatTime(Date.now()))
      const rate = rates[state.preferredCurrency] || 1
      newData.datasets[0].data.push(price * rate)

      return newData
    })
  }

  // Initializes the Chart.js instance and updates it when chartData changes
  useEffect(() => {
    const ctx = chartRef.current.getContext("2d")

    // Create a gradient for the line
    const gradient = ctx.createLinearGradient(0, 0, 0, 300)
    gradient.addColorStop(0, "rgba(75, 192, 192, 0.5)")
    gradient.addColorStop(1, "rgba(75, 192, 192, 0)")

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "#333", // Darker text color
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            titleColor: "#333",
            bodyColor: "#333",
            titleFont: {
              size: 14,
            },
            bodyFont: {
              size: 12,
            },
            borderColor: "#ddd",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#333", // Darker tick color
              font: {
                size: 12,
              },
            },
            grid: {
              display: false,
            },
          },
          y: {
            ticks: {
              color: "#333", // Darker tick color
              font: {
                size: 12,
              },
            },
            grid: {
              color: "#eee", // Light gray grid lines
            },
          },
        },
        elements: {
          line: {
            tension: 0.3, // Smooth the line curve
            backgroundColor: gradient,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
          },
          point: {
            radius: 3,
            backgroundColor: "rgba(75, 192, 192, 1)",
            hoverRadius: 5,
          },
        },
      },
    })

    return () => {
      chartInstance.current.destroy() // Cleanup on component unmount
    }
  }, [chartData])

  // Establishes a WebSocket connection to receive real-time data
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.close() // Close any existing WebSocket connection
    }

    const wsURL = "wss://mtickers.mtw-testnet.com"
    socketRef.current = new WebSocket(wsURL)

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.hasOwnProperty(state.chosenCrypto)) {
        const price = parseFloat(data[state.chosenCrypto].p)
        updateChartData(state.chosenCrypto, price) // Update chart data with the new price
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close() // Cleanup WebSocket on component unmount
      }
    }
  }, [state.chosenCrypto])

  // Updates the chart when the preferred currency or rates change
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].label = `Price (${state.preferredCurrency})`
      const newData = chartData.datasets[0].data.map((price, index) => {
        const originalPrice = price / rates[state.preferredCurrency]
        return originalPrice * rates[state.preferredCurrency]
      })
      chartInstance.current.data.datasets[0].data = newData
      chartInstance.current.update()
    }
  }, [state.preferredCurrency, rates])

  // Updates the chart when chartData changes
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data = chartData
      chartInstance.current.update()
    }
  }, [chartData])

  // Handles symbol selection changes
  const handleChangeSymbol = (event) => {
    dispatch({ type: "SET_CHOSEN_CRYPTO", payload: event.target.value })
    setChartData({
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
    }) // Reset chart data when symbol changes
  }

  return (
    <div className="max-w-[300px] mt-4 mx-auto pb-10">
      <div className="flex justify-center gap-4 font-semibold pb-2">
        <div className="py-1">Symbol</div>
        <select
          onChange={handleChangeSymbol}
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
