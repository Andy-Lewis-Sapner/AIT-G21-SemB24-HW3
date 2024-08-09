import Meta from "@/components/Meta"
import { useState } from "react"
import { useRouter } from "next/router"
import { usePageContext } from "@/utils/context"
import { fetchUser, updateData } from "@/utils/supabaseService"

export default function Deposit() {
  const { state, dispatch } = usePageContext()
  const router = useRouter()
  const [userMessage, setUserMessage] = useState("") // State to store messages for the user (e.g., errors)
  const [amount, setAmount] = useState(0) // State to store the amount to be deposited

  // Handles the deposit process when the form is submitted
  const handleDeposit = async (e) => {
    e.preventDefault()

    // Validation checks for the deposit amount
    if (isNaN(amount)) {
      setUserMessage("Amount must be a number")
      return
    } else if (amount <= 0) {
      setUserMessage("Amount must be greater than 0")
      return
    }

    // Fetch the current user data
    const user = await fetchUser(state.user)

    // Update the user balance with the deposited amount
    const deposit = await updateData(
      state.user,
      user.USD + parseFloat(amount),
      null,
      0,
      state.exchangeMode === "Competition" ? "Balances" : "Users",
    )

    // Provide feedback based on the success or failure of the withdrawal
    if (deposit) {
      setUserMessage("Deposit successful")
      router.push("/Trading") // Redirect to the Trading page
    } else {
      setUserMessage("Deposit failed")
    }
  }

  return (
    <div>
      <Meta title="Deposit" /> {/* Meta component to set the page title */}
      <div className="w-full m-auto py-32 bg-slate-50 dark:bg-gray-800 h-full">
        <h1 className="text-4xl text-center font-bold text-slate-800 dark:text-gray-200 mb-4 pt-4">
          Deposit
        </h1>

        {/* Deposit form */}
        <form
          className="w-1/2 mx-auto flex flex-col justify-between max-w-[500px]"
          onSubmit={handleDeposit}
        >
          {/* Input for deposit amount */}
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

          {/* Input for card number */}
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

          {/* Input for expiry date */}
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

          {/* Input for CVV */}
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

          {/* Deposit button and message display */}
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
