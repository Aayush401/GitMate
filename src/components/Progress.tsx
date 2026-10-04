import React from 'react'

export default function Progress() {
  return (
    <div className="flex justify-center mt-10">
        <div className="radial-progress text-primary" style={{ "--value": 70 } as React.CSSProperties}>
            70%
        </div>
    </div>
  )
}
