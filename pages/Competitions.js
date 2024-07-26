import Meta from "@/components/Meta"

export default function Competitions() {
  return (
    <div>
      <Meta title="Competitions" />
      <div className="max-w-[1000px] w-full mx-auto my-4">
        <div className="flex flex-col items-center text-black">
          <div className="text-3xl font-bold pb-3">
            Time left until next competition:
          </div>
          <div id="timer" class="text-4xl pb-4"></div>
          <img
            src="./resurce/tradingcomp.jpeg"
            alt="Trading Competition Image"
            className="h-[250px] mb-8 rounded border-solid border-blue-300 border-4"
          />
          <button className="bg-blue-300 hover:bg-blue-400 p-2 rounded-2xl mb-4">
            Register to competition
          </button>
        </div>
      </div>
    </div>
  )
}
