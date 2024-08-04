import Meta from "@/components/Meta" // Import Meta component
import Tutorials from "@/components/tutorial_components/Tutorials" // Import Tutorials component

export async function getServerSideProps() {
  let listURL = "https://api.mtw-testnet.com/assets/symbols"
  let res = await fetch(listURL)
  let data = await res.json()
  const symbols1 = data

  listURL = "https://mtickers.mtw-testnet.com/symbols"
  res = await fetch(listURL)
  data = await res.json()
  const symbols2 = data

  const symbols = symbols1.filter((symbol) => symbols2.includes(symbol))

  return {
    props: {
      symbols: symbols || {},
    },
  }
}

// Main Tutorial component for the tutorial page
export default function Tutorial({ symbols }) {
  return (
    // Main container for the tutorial page
    <div>
      {/* Meta component to set page title */}
      <Meta title="Tutorial" />
      {/* Main content container */}
      <div className="max-w-[1000px] w-full mx-auto my-4">
        {/* Tutorials component to render additional tutorial videos and cryptocurrency data */}
        <Tutorials symbols={symbols} />
      </div>
    </div>
  )
}
