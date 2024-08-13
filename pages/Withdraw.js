import Meta from "@/components/Meta"
import { useState } from "react"
import { useRouter } from "next/router"
import { usePageContext } from "@/utils/context"
import { handleWithdraw } from "@/utils/logic/depositAndWithdrawFunc"

export default function Withdraw() {
  const { state } = usePageContext() // Access the global state
  const router = useRouter() // Hook for navigation
  const [userMessage, setUserMessage] = useState("") // State to store user feedback messages
  const [amount, setAmount] = useState(0) // State to store the withdrawal amount

  return (
    <div>
      <Meta title="Withdraw" /> {/* Set the page title to "Withdraw" */}
      <div className="w-full m-auto py-32 h-full">
        <h1 className="text-4xl text-center font-bold text-slate-800 dark:text-gray-200 mb-4 pt-4">
          Withdraw
        </h1>
        <form
          className="w-1/2 mx-auto flex flex-col justify-between max-w-[500px]"
          onSubmit={(e) =>
            handleWithdraw(e, amount, setUserMessage, state, router)
          } // Handle the form submission
        >
          {/* Input for withdrawal amount */}
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              className="form-input"
              id="amount"
              type="text"
              placeholder="Amount"
              onChange={(e) => setAmount(Number(e.target.value))} // Convert input to number and update state
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
              className="form-input"
              id="cardNumber"
              type="text"
              placeholder="Card Number"
              required
            />
          </div>

          {/* Input for expiration date */}
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="expiryDate"
            >
              Expiration Date
            </label>
            <input
              className="form-input"
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
              className="form-input"
              id="cvv"
              type="text"
              placeholder="CVV"
              required
            />
          </div>

          {/* Display user feedback messages and withdrawal button */}
          <div className="flex flex-col items-center justify-center pt-2">
            <p
              className={`mb-3 ${
                userMessage.includes("successful")
                  ? "text-green-500 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {userMessage}
            </p>
            <button className="form-button" type="submit">
              Withdraw
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
