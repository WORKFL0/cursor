'use client'

import { useState } from 'react'

export function TestClientInteraction() {
  const [count, setCount] = useState(0)
  const [hovered, setHovered] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded z-[9999] flex flex-col gap-4">
      <button
        onClick={() => {
          console.log('Button clicked!', count)
          setCount(count + 1)
        }}
        className="bg-white text-black px-4 py-2 rounded"
      >
        Test Click: {count}
      </button>

      <div
        className="relative"
        onMouseEnter={() => {
          console.log('Mouse entered!')
          setHovered(true)
        }}
        onMouseLeave={() => {
          console.log('Mouse left!')
          setHovered(false)
        }}
      >
        <div className="bg-blue-500 p-4 rounded">
          Hover Test: {hovered ? 'HOVERED' : 'NOT HOVERED'}
        </div>
      </div>
    </div>
  )
}
