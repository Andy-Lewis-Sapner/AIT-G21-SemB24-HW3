import { Chart } from "chart.js/auto"

const wsURL = "wss://mtickers.mtw-testnet.com"

// Formats timestamp into HH:MM:SS format
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")
  return `${hours}:${minutes}:${seconds}`
}

// Updates the chart data with the latest price
const updateChartData = (price, setChartData, maxPoints, rates, state) => {
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

export const createChart = (chartRef, chartData, chartInstance) => {
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
}

export const establishWebSocket = (
  socketRef,
  state,
  setChartData,
  maxPoints,
  rates,
) => {
  if (socketRef.current) {
    socketRef.current.close() // Close any existing WebSocket connection
  }

  socketRef.current = new WebSocket(wsURL)

  socketRef.current.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.hasOwnProperty(state.chosenCrypto)) {
      const price = parseFloat(data[state.chosenCrypto].p)
      updateChartData(price, setChartData, maxPoints, rates, state) // Update chart data with the new price
    }
  }

  return () => {
    if (socketRef.current) {
      socketRef.current.close() // Cleanup WebSocket on component unmount
    }
  }
}

export const updateChartWhenPriceIsChanged = (
  chartInstance,
  chartData,
  state,
  rates,
  previousCurrency,
) => {
  if (chartInstance.current) {
    const previousRate = rates[previousCurrency] || 1
    const newRate = rates[state.preferredCurrency] || 1

    chartInstance.current.data.datasets[0].label = `Price (${state.preferredCurrency})`

    const newData = chartData.datasets[0].data.map((price) => {
      const basePrice = price / previousRate // Convert to base currency
      return basePrice * newRate // Convert to new currency
    })

    chartInstance.current.data.datasets[0].data = newData

    chartInstance.current.update()
  }
}

export const updateChartWhenChartDataIsChanged = (chartInstance, chartData) => {
  if (chartInstance.current) {
    chartInstance.current.data = chartData
    chartInstance.current.update()
  }
}

// Handles symbol selection changes
export const handleChangeSymbol = (event, dispatch, setChartData, state) => {
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

// Dispatches updated prices for all symbols to the global state
export const dispatchAllPrices = (e, dispatch, state, symbols, rates) => {
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
export const configWebsocketEvents = (
  socketRef,
  state,
  setPrice,
  rates,
  dispatch,
  symbols,
) => {
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
      <span className="ml-5">
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
    dispatchAllPrices(e, dispatch, state, symbols, rates) // Dispatch all updated prices to the global state
  }
}
