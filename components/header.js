import { useRouter } from "next/router";
export default function Header() {
  const router = useRouter();
  const handleClick = (text) => {
    router.push("/" + text);
  };
  return (
    <div className="bg-blue-100 dark:bg-blue-900 text-black dark:text-white p-3">
      <div className="max-w-[1000px] w-full mx-auto flex justify-between">
        <button className="block sm:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1.5em"
            viewBox="0 0 448 512"
          >
            <path
              fill="#ffffff"
              d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
            />
          </svg>
          <svg
            className="hidden"
            xmlns="http://www.w3.org/2000/svg"
            height="1.5em"
            viewBox="0 0 384 512"
          >
            <path
              fill="#ffffff"
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            />
          </svg>
        </button>
        <div
          className="absolute top-[56px] left-0 bg-blue-300 p-3 hidden w-full"
          id="ddMenu"
        >
          <button
            className="block py-1 px-2"
            onClick={() => handleClick("Trading")}
          >
            Trading
          </button>
          <button
            className="block py-1 px-2"
            onClick={() => handleClick("Competitions")}
          >
            Competitions
          </button>
          <button
            className="block py-1 px-2"
            onClick={() => handleClick("Tutorial")}
          >
            Tutorial
          </button>
        </div>
        <div className="justify-start gap-2 hidden sm:flex">
          <button
            className="hover:bg-blue-200 rounded-lg px-2"
            onClick={() => handleClick("Trading")}
          >
            Trading
          </button>
          <button
            className="hover:bg-blue-200 rounded-lg px-2"
            onClick={() => handleClick("Competitions")}
          >
            Competitions
          </button>
          <button
            className="hover:bg-blue-200 rounded-lg px-2"
            onClick={() => handleClick("Tutorial")}
          >
            Tutorial
          </button>
        </div>
        <div className="justify-end gap-4 hidden sm:flex">
          <button className="bg-blue-300 hover:bg-blue-400 active:bg-blue-500 rounded-lg py-1 px-2">
            Login
          </button>
          <button className="bg-blue-200 hover:bg-blue-300 active:bg-blue-400 rounded-lg py-1 px-2">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
