import Meta from "@/components/Meta"
import { useState } from "react"
import { useRouter } from "next/router"
import { usePageContext } from "@/utils/context"
import { handleDeposit } from "@/utils/logic/depositAndWithdrawFunc"

export default function Deposit() {
  const { state, dispatch } = usePageContext()
  const router = useRouter()
  const [userMessage, setUserMessage] = useState("") // State to store messages for the user (e.g., errors)
  const [amount, setAmount] = useState(0) // State to store the amount to be deposited

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
          onSubmit={(e) =>
            handleDeposit(e, amount, setUserMessage, state, router)
          }
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
              className="form-input"
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
              className="form-input"
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

          {/* Deposit button and message display */}
          <div className="flex flex-col items-center justify-center pt-2">
            <p className="text-green-500 dark:text-green-400 mb-3">
              {userMessage}
            </p>
            <button className="form-button" type="submit">
              Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
