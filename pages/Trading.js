import Meta from "@/components/Meta"
import ProfileCard from "@/components/trading_components/profileCard"
import RealTimeChart from "@/components/trading_components/realTimeChart"
import Tabs from "@/components/tabs"
import BuyTab from "@/components/trading_components/buyTab"
import SellTab from "@/components/trading_components/sellTab"
import Balance from "@/components/trading_components/balance"
import CryptoFactsAndJokes from "@/components/trading_components/cryptoFactsAndJokes"

export async function getServerSideProps() {
  try {
    let res = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    let data = await res.json()
    const rates = data.rates

    let listURL = "https://api.mtw-testnet.com/assets/symbols"
    res = await fetch(listURL)
    data = await res.json()
    const symbols1 = data

    listURL = "https://mtickers.mtw-testnet.com/symbols"
    res = await fetch(listURL)
    data = await res.json()
    const symbols2 = data

    const symbols = symbols1.filter((symbol) => symbols2.includes(symbol))

    return {
      props: {
        rates: rates || {},
        symbols: symbols || {},
      },
    }
  } catch (error) {
    console.error("Failed to fetch exchange rates or symbols:", error.message)
    return {
      props: {
        rates: {},
        symbols: {},
      },
    }
  }
}

export default function Trading({ rates, symbols }) {
  //fetch("https://api.exchangerate-api.com/v4/latest/USD")
  //fetch("https://api.coinpaprika.com/v1/tickers")

  const tabs = [
    {
      label: "Buy",
      content: <BuyTab symbols={symbols} rates={rates} />,
    },
    {
      label: "Sell",
      content: <SellTab symbols={symbols} rates={rates} />,
    },
  ]

  return (
    <div>
      <Meta title="Trading" />
      <div className="max-w-[1000px] w-full mx-auto my-4">
        <ProfileCard rates={rates} />
        <div className="flex flex-row justify-between mt-4">
          <div className="w-1/2 flex flex-col justify-between">
            <div className="mr-3 h-full ring ring-gray-300 p-4 rounded-lg dark:bg-slate-300">
              <h6 className="text-2xl font-semibold">Balances</h6>
              <Balance rates={rates} symbols={symbols} />
            </div>
            <div className="mr-3 mt-3 ring ring-gray-300 p-4 rounded-lg dark:bg-slate-300">
              <CryptoFactsAndJokes />
            </div>
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="w-full mb-2 ring ring-gray-300 p-4 rounded-lg dark:bg-slate-300">
              <div className="text-2xl font-semibold">Real Time Data</div>
              <RealTimeChart rates={rates} symbols={symbols} />
            </div>
            <div className="w-full mt-1 ring ring-gray-300 p-4 rounded-lg dark:bg-slate-300">
              <h6 className="text-xl font-semibold mb-2">Buy and Sell</h6>
              <Tabs tabs={tabs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
