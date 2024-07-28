import VideoCard from "./VideoCard"

// Component to list all video information
const VideoList = ({ videos }) => {
  return (
    // Container for the list of video cards
    <div className="grid grid-cols-1 gap-4">
      {videos.map((video) => (
        // Rendering each VideoCard component
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

export default VideoList
