import React, { useState } from "react"
import { factsAndJokes } from "@/public/funFactsAndJokes"

export default function CryptoFactsAndJokes() {
  const [factOrJoke, setFactOrJoke] = useState({
    label: "Did you know",
    content:
      "The first cryptocurrency transaction was for two pizzas, costing 10,000 BTC—talk about a pricey pizza!",
  })

  const getRandomFactOrJoke = () => {
    const randomIndex = Math.floor(Math.random() * factsAndJokes.length)
    const selectedFactOrJoke = factsAndJokes[randomIndex]
    const [label, content] = selectedFactOrJoke.split(": ")
    setFactOrJoke({ label, content })
  }

  return (
    <div className="rounded-lg flex flex-col items-center bg-inherit">
      <h1 className="text-2xl font-semibold mb-2">Cryptocurrency Fun Facts</h1>
      {factOrJoke && (
        <p className="border border-gray-500 rounded-md p-1 mb-2">
          <strong>{factOrJoke.label}</strong>: {factOrJoke.content}
        </p>
      )}
      <button
        onClick={getRandomFactOrJoke}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Get a Fun Fact
      </button>
    </div>
  )
}
