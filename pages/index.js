import Meta from "@/components/Meta"
import { fetchData, fetchData_comp } from "@/utils/supabaseService"
import Link from "next/link"
import { useEffect } from "react"
import { FaChartLine, FaWallet, FaHeadset } from "react-icons/fa"

export default function Home() {
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetchData()
      console.log(res)
    }

    const fetchBalaces = async () => {
      const res = await fetchData_comp()
      console.log(JSON.stringify(res, null, 2))
    }

    fetchUsers()
    fetchBalaces()
  })

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Meta title="Home" />
      <main className="flex-grow container mx-auto mt-10 p-6">
        <section className="bg-gray-100 text-center py-20">
          <h2 className="text-5xl font-bold mb-6">Welcome to Crypto World</h2>
          <p className="text-xl mb-4">
            Your gateway to the latest in cryptocurrency.
          </p>
          <Link
            href="/Register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
          >
            Get Started
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <FaChartLine className="text-blue-500 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Real-Time Charts</h3>
            <p className="text-gray-700 mb-4">
              Track cryptocurrency prices and trends in real-time with our
              advanced charting tools.
            </p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Learn More
            </button>
          </div>

          <div className="bg-white p-6 rounded shadow-md text-center">
            <FaWallet className="text-green-500 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Secure Wallet</h3>
            <p className="text-gray-700 mb-4">
              Keep your digital assets safe with our secure wallet solutions.
            </p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Learn More
            </button>
          </div>

          <div className="bg-white p-6 rounded shadow-md text-center">
            <FaHeadset className="text-purple-500 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">24/7 Support</h3>
            <p className="text-gray-700 mb-4">
              Get assistance any time of the day with our dedicated support
              team.
            </p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Contact Us
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
