import { useEffect, useRef, useState } from "react"
import { Chart } from "chart.js/auto"
import { usePageContext } from "@/utils/context"

export default function RealTimeChart({ rates }) {
  const { state, dispatch } = usePageContext()
  const [symbols, setSymbols] = useState([])
  const [selectedSymbol, setSelectedSymbol] = useState("BTC")
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
  })
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const socketRef = useRef(null)

  const maxPoints = 60
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  const updateChartData = (symbol, price) => {
    const rate = rates[state.preferredCurrency] || 1
    const convertedPrice = (price * rate).toFixed(2)

    setChartData((prevData) => {
      const newData = { ...prevData }
      if (newData.labels.length >= maxPoints) {
        newData.labels = newData.labels
          .slice(15)
          .concat(new Array(15).fill(null))
        newData.datasets[0].data = newData.datasets[0].data
          .slice(15)
          .concat(new Array(15).fill(null))
      }
      newData.labels.push(formatTime(Date.now()))
      newData.datasets[0].data.push(price)
      return newData
    })
  }

  useEffect(() => {
    const fetchSymbols = async () => {
      const listURL = "https://api.mtw-testnet.com/assets/symbols"
      const response = await fetch(listURL)
      const data = await response.json()
      setSymbols(data)
    }

    fetchSymbols()

    const ctx = chartRef.current.getContext("2d")
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            axis: {
              color: "#9AA5A9",
            },
            ticks: {
              color: "#9AA5A9",
              font: {
                size: 10,
              },
            },
            grid: {
              display: false,
              color: "#9AA5A9",
              borderColor: "#9AA5A9",
              borderDash: [3, 3],
            },
          },
          y: {
            axis: {
              color: "#9AA5A9",
            },
            ticks: {
              color: "#9AA5A9",
              font: {
                size: 10,
              },
            },
            grid: {
              display: false,
              color: "#9AA5A9",
              borderColor: "#9AA5A9",
            },
          },
        },
      },
    })

    return () => {
      chartInstance.current.destroy()
    }
  }, [])

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.close()
    }

    const wsURL = "wss://mtickers.mtw-testnet.com"
    socketRef.current = new WebSocket(wsURL)

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.hasOwnProperty(selectedSymbol)) {
        const price = parseFloat(data[selectedSymbol].p)
        updateChartData(selectedSymbol, price)
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [selectedSymbol])

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].label = `Price (${state.preferredCurrency})`
      const newData = chartData.datasets[0].data.map(
        (price) => price * rates[state.preferredCurrency],
      )
      chartInstance.current.data.datasets[0].data = newData
      chartInstance.current.update()
    }
  }, [state.preferredCurrency])

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data = chartData
      chartInstance.current.update()
    }
  }, [chartData])

  const handleChangeSymbol = (event) => {
    setSelectedSymbol(event.target.value)
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
    })
  }

  return (
    <div className="mr-1 w-full ring ring-gray-300 p-4 rounded-lg dark:bg-slate-300">
      <div className="max-w-[560px] mt-4 mx-auto pb-10">
        <div className="text-4xl py-6 text-center">Real time chart</div>
        <div className="flex justify-center gap-4 font-bold pb-2">
          <div className="py-1">Symbol</div>
          <select
            onChange={handleChangeSymbol}
            className="border border-gray-300 rounded-md w-[100px] px-2 py-1 dark:bg-gray-800 dark:text-white"
            value={selectedSymbol}
          >
            {symbols.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>
        <div className="w-[100%] h-[300px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  )
}
