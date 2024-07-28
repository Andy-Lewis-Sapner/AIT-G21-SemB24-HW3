// Component to display individual video information
const VideoCard = ({ video }) => {
  return (
    // Container for each video card with styling
    <div className="bg-white dark:bg-gray-300 p-6 rounded-lg shadow-md">
      {/* Displaying video title */}
      <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
      {/* Container for embedded video with aspect ratio */}
      <div className="relative" style={{ paddingBottom: "56.25%", height: 0 }}>
        {/* Embedded video iframe */}
        <iframe
          src={video.url}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          title={video.title}
        ></iframe>
      </div>
    </div>
  )
}

export default VideoCard
