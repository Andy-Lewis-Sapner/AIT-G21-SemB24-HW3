import Meta from "@/components/Meta"

export default function Tutorial() {
  const tutorials = [
    {
      img: "https://img.youtube.com/vi/i5OZQQWj5-I/0.jpg",
      title: "Tutorial 1",
      summary: "This video covers the basics of trading.",
      link: "https://www.youtube.com/watch?v=i5OZQQWj5-I&pp=ygURYmFzaWNzIG9mIHRyYWRpbmc%3D",
    },
    {
      img: "https://img.youtube.com/vi/2h5ryPi6ZYo/0.jpg",
      title: "Tutorial 2",
      summary: "This video goes over advanced trading strategies.",
      link: "https://www.youtube.com/watch?v=2h5ryPi6ZYo&pp=ygUrdmlkZW8gZ29lcyBvdmVyIGFkdmFuY2VkIHRyYWRpbmcgc3RyYXRlZ2llcw%3D%3D",
    },
    {
      img: "https://img.youtube.com/vi/s8wC6U7QJmQ/0.jpg",
      title: "Tutorial 3",
      summary: "This video explains risk management in trading.",
      link: "https://www.youtube.com/watch?v=s8wC6U7QJmQ&pp=ygUpdmlkZW8gZXhwbGFpbnMgcmlzayBtYW5hZ2VtZW50IGluIHRyYWRpbmc%3D",
    },
  ]

  return (
    <div>
      <Meta title="Tutorial" />
      <div className="max-w-[1000px] w-full mx-auto my-4">
        <div className="p-4 h-auto flex flex-col items-center">
          <h2 className="text-2xl mb-4 text-black">Tutorial Videos</h2>
          <div className="space-y-4">
            {tutorials
              .map(
                (tutorial) => `
                    <div class="flex items-center bg-white p-4 rounded-lg shadow dark:bg-gray-800 dark:text-white">
                        <img src="{tutorial.img}" alt="{tutorial.title}" class="w-32 h-20 rounded-lg mr-4">
                        <div>
                            <h3 class="text-lg font-semibold"><a href="{tutorial.link}" target="_blank">${tutorial.title}</a></h3>
                            <p class="text-sm">{tutorial.summary}</p>
                        </div>
                    </div>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  )
}
