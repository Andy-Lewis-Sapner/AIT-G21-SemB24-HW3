import Meta from "@/components/Meta"
import React, { useContext, useEffect } from "react"
import ProfileCard from "@/components/trading_components/profileCard"
import RealTimeChart from "@/components/trading_components/realTimeChart"

export async function getServerSideProps() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD")

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()

    return {
      props: {
        rates: data.rates || {},
      },
    }
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error.message)
    return {
      props: {
        rates: {},
      },
    }
  }
}

export default function Trading({ rates }) {
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [exchangeRatesResponse, cryptoPricesResponse] = await Promise.all(
  //         [
  //           axios.get("https://api.exchangerate-api.com/v4/latest/USD"),
  //           axios.get("https://api.coinpaprika.com/v1/tickers"),
  //         ],
  //       )
  //     } catch (error) {
  //       console.error("Error fetching data:", error)
  //     }
  //   }

  //   fetchData()
  // }, [])

  return (
    <div>
      <Meta title="Trading" />
      <div className="max-w-[1000px] w-full mx-auto my-4">
        <ProfileCard rates={rates} />
        <div className="flex flex-row justify-between mt-4">
          <RealTimeChart rates={rates} />
        </div>
      </div>
    </div>
  )
}
