import React from 'react'

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">

      {/* Glow Orbs */}
      <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl animate-pulse" />

      {/* Glass Card */}
      <div className="relative flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 px-10 py-8 backdrop-blur-xl">

        {/* Spinner */}
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin" />

          <div className="absolute inset-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_0_30px_rgba(99,102,241,0.8)]" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">
            DevPilot AI
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Loading...
          </p>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce"></span>
          <span
            className="h-2 w-2 rounded-full bg-purple-500 animate-bounce"
            style={{ animationDelay: '0.15s' }}
          ></span>
          <span
            className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce"
            style={{ animationDelay: '0.3s' }}
          ></span>
        </div>

      </div>
    </div>
  )
}

export default Loading