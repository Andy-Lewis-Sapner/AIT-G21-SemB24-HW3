import { useState } from "react"

export default function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0].label) // State to track the currently active tab

  return (
    <div className="w-full">
      {/* Tab headers */}
      <div className="flex border-b border-gray-300 dark:border-gray-600">
        {tabs.map((tab) => (
          <button
            key={tab.label} // Unique key for each tab
            className={`px-4 py-2 text-lg font-medium ${
              activeTab === tab.label
                ? "border-b-2 border-blue-500 text-blue-500 dark:text-blue-400 bg-inherit"
                : "text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
            }`} // Conditional styling based on active tab
            onClick={() => setActiveTab(tab.label)} // Set active tab on click
          >
            {tab.label} {/* Display the label of the tab */}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4 bg-inherit">
        {tabs.map((tab) =>
          tab.label === activeTab ? (
            <div key={tab.label}>{tab.content}</div> // Display content of the active tab
          ) : null,
        )}
      </div>
    </div>
  )
}
