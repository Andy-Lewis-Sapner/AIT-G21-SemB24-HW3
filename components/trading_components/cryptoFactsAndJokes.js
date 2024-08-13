import React, { useState } from "react"
import { getRandomFactOrJoke } from "@/utils/logic/factsFunc"

export default function CryptoFactsAndJokes() {
  // State to store the current fact or joke displayed
  const [factOrJoke, setFactOrJoke] = useState({
    label: "Did you know",
    content:
      "The first cryptocurrency transaction was for two pizzas, costing 10,000 BTC—talk about a pricey pizza!",
  })

  return (
    <div className="rounded-lg flex flex-col items-center bg-inherit">
      <h1 className="text-2xl font-semibold mb-2">Cryptocurrency Fun Facts</h1>
      {/* Display the current fact or joke */}
      {factOrJoke && (
        <p className="border border-gray-500 rounded-md p-1 mb-2">
          <strong>{factOrJoke.label}</strong>: {factOrJoke.content}
        </p>
      )}
      {/* Button to get a new random fact or joke */}
      <button
        onClick={() => getRandomFactOrJoke(setFactOrJoke)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Get a Fun Fact
      </button>
    </div>
  )
}
