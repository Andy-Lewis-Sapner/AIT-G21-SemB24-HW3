import React, { useEffect, useState } from "react"
import CryptoList from "./CryptoList" // Import CryptoList component
import VideoList from "./VideoList" // Import VideoList component
import { fetchCryptos } from "@/utils/logic/tutorialsFunc"

// Component to fetch and display cryptocurrency data along with tutorial videos
const Tutorials = ({ symbols }) => {
  const [cryptos, setCryptos] = useState([]) // State to store cryptocurrency data
  const [loading, setLoading] = useState(true) // State to manage loading state
  const [error, setError] = useState(null) // State to manage error state

  // Fetch cryptocurrency data on component mount
  useEffect(() => {
    fetchCryptos(setCryptos, setLoading, setError, symbols) // Call the fetch function
  }, []) // Empty dependency array to run once on mount

  // Loading state rendering
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  }

  // Error state rendering
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">{error}</div>
    )
  }

  // List of tutorial videos
  const tutorialVideos = [
    {
      id: 1,
      title: "Introduction to Cryptocurrency",
      url: "https://www.youtube.com/embed/1YyAzVmP9xQ",
    },
    {
      id: 2,
      title: "How to Trade Bitcoin",
      url: "https://www.youtube.com/embed/7NrIH748PiY",
    },
    {
      id: 3,
      title: "Understanding Blockchain",
      url: "https://www.youtube.com/embed/rYQgy8QDEBI",
    },
    {
      id: 4,
      title: "Introduction to DeFi",
      url: "https://www.youtube.com/embed/17QRFlml4pA",
    },
    {
      id: 5,
      title: "Crypto Trading Strategies",
      url: "https://www.youtube.com/embed/Hqi482m2rig",
    },
  ]

  // Main content rendering
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 dark:text-gray-200">
        Learn and Earn with Cryptocurrency
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <h2 className="text-3xl font-bold mb-4 dark:text-gray-200">
            Cryptocurrency Explanations
          </h2>
          {/* Rendering the list of cryptocurrency cards */}
          <CryptoList cryptos={cryptos} />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4 dark:text-gray-200">
            Tutorial Videos
          </h2>
          {/* Rendering the list of video cards */}
          <VideoList videos={tutorialVideos} />
        </div>
      </div>
    </div>
  )
}

export default Tutorials
