import Meta from "@/components/Meta"
import { fetchData, fetchData_comp } from "@/utils/supabaseService"
import Link from "next/link"
import { useEffect } from "react"
import { FaChartLine, FaWallet, FaHeadset } from "react-icons/fa"
import { usePageContext } from "@/utils/context"

export default function Home() {
  const { state } = usePageContext()
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetchData()
    }

    const fetchBalaces = async () => {
      const res = await fetchData_comp()
    }

    fetchUsers()
    fetchBalaces()
  })

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      <Meta title="Home" />
      <main className="flex-grow container mx-auto mt-10 p-6">
        <section className="text-center py-20">
          <h2 className="text-5xl font-bold mb-6 dark:text-gray-100">
            Welcome to Crypto World
          </h2>
          <p className="text-xl mb-4 dark:text-gray-300">
            Your gateway to the latest in cryptocurrency.
          </p>
          <Link
            href={state.user ? "/Trading" : "/Register"}
            className="bg-blue-600 dark:bg-blue-800 text-white px-6 py-3 rounded-lg text-lg"
          >
            Get Started
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md text-center">
            <FaChartLine className="text-blue-500 dark:text-blue-300 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2 dark:text-gray-100">
              Real-Time Charts
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Track cryptocurrency prices and trends in real-time with our
              advanced charting tools.
            </p>
            <button className="bg-blue-500 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Learn More
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md text-center">
            <FaWallet className="text-green-500 dark:text-green-300 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2 dark:text-gray-100">
              Secure Wallet
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Keep your digital assets safe with our secure wallet solutions.
            </p>
            <button className="bg-blue-500 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Learn More
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md text-center">
            <FaHeadset className="text-purple-500 dark:text-purple-300 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2 dark:text-gray-100">
              24/7 Support
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Get assistance any time of the day with our dedicated support
              team.
            </p>
            <button className="bg-blue-500 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Contact Us
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
