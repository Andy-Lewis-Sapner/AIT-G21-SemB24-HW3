import CryptoCard from "./CryptoCard"

// Component to list all cryptocurrency information
const CryptoList = ({ cryptos }) => {
  return (
    // Container for the list of crypto cards
    <div className="grid grid-cols-1 gap-4">
      {cryptos.map((crypto) => (
        // Rendering each CryptoCard component
        <CryptoCard key={crypto.id} crypto={crypto} />
      ))}
    </div>
  )
}

export default CryptoList
