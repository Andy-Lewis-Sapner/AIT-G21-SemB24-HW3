import Image from "next/image"

// Component to display individual cryptocurrency information
const CryptoCard = ({ crypto }) => {
  return (
    // Container for each crypto card with styling
    <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
      {/* Displaying crypto image */}
      <Image
        src={crypto.image}
        alt={crypto.name}
        width={48}
        height={48}
        className="w-12 h-12 rounded-md mr-4 mt-1"
      />
      <div>
        {/* Displaying crypto name */}
        <h2 className="text-2xl font-bold mb-2">{crypto.name}</h2>
        {/* Displaying crypto summary */}
        <p className="text-gray-700 mb-2">{crypto.summary}</p>
      </div>
    </div>
  )
}

export default CryptoCard
