import axios from "axios"
export const fetchCryptos = async (
  setCryptos,
  setLoading,
  setError,
  symbols,
) => {
  try {
    const response = await axios.get("https://api.mtw-testnet.com/assets/all") // API call to fetch data
    const cryptoData = response.data
    // Formatting the fetched data
    let formattedData
    if (symbols) {
      formattedData = Object.keys(cryptoData)
        .filter((key) => symbols.includes(key))
        .map((key) => ({
          ...cryptoData[key],
          id: key,
        }))
    } else {
      formattedData = Object.keys(cryptoData).map((key) => ({
        ...cryptoData[key],
        id: key,
      }))
    }
    setCryptos(formattedData) // Setting the formatted data to state
    setLoading(false) // Setting loading to false after data is fetched
  } catch (err) {
    console.error("Error fetching data:", err.message) // Logging error in console
    setError("Failed to fetch data. Please try again later.") // Setting error state
    setLoading(false) // Setting loading to false on error
  }
}
