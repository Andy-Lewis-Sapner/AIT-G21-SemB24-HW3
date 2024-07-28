import Meta from "@/components/Meta" // Import Meta component
import Tutorials from "@/components/tutorial_components/Tutorials" // Import Tutorials component

// Main Tutorial component for the tutorial page
export default function Tutorial() {
  return (
    // Main container for the tutorial page
    <div>
      {/* Meta component to set page title */}
      <Meta title="Tutorial" />
      {/* Main content container */}
      <div className="max-w-[1000px] w-full mx-auto my-4">
        {/* Tutorials component to render additional tutorial videos and cryptocurrency data */}
        <Tutorials />
      </div>
    </div>
  )
}
