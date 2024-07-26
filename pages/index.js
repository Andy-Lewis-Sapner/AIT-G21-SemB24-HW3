import React, { useReducer } from "react"
import Meta from "@/components/Meta"

export default function Home() {
  return (
    <div>
      <Meta title="Home" />
      <main>
        <h1 className="text-3xl font-bold underline">Hello, world!</h1>
      </main>
    </div>
  )
}
