import Meta from "@/components/Meta"
import { useState } from "react"
import { useRouter } from "next/router"
import { usePageContext } from "@/utils/context"
import { fetchUser, updateData } from "@/utils/supabaseService"

export default function Deposit() {
  const { state, dispatch } = usePageContext()
  const router = useRouter()
  const [userMessage, setUserMessage] = useState("")
  const [amount, setAmount] = useState(0)

  const handleDeposit = async (e) => {
    e.preventDefault()
    const user = await fetchUser(state.user)
    const deposit = await updateData(
      state.user,
      user.USD + parseFloat(amount),
      null,
      0,
      state.exchangeMode === "Competition" ? "Balances" : "Users",
    )
    if (deposit) router.push("/Trading")
  }

  return (
    <div>
      <Meta title="Deposit" />
      <div className="w-full m-auto py-32 bg-slate-50 dark:bg-gray-800 h-full">
        <h1 className="text-4xl text-center font-bold text-slate-800 dark:text-gray-200 mb-4 pt-4">
          Deposit
        </h1>
        <form
          className="w-1/2 mx-auto flex flex-col justify-between max-w-[500px]"
          onSubmit={handleDeposit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-300 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="text"
              placeholder="Amount"
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="cardNumber"
            >
              Card Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-300 leading-tight focus:outline-none focus:shadow-outline"
              id="cardNumber"
              type="text"
              placeholder="Card Number"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="expiryDate"
            >
              Expiry Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-300 leading-tight focus:outline-none focus:shadow-outline"
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="cvv"
            >
              CVV
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-300 leading-tight focus:outline-none focus:shadow-outline"
              id="cvv"
              type="text"
              placeholder="CVV"
              required
            />
          </div>
          <div className="flex flex-col items-center justify-center pt-2">
            <p className="text-green-500 dark:text-green-400 mb-3">
              {userMessage}
            </p>
            <button
              className="bg-blue-500 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
