import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

      {/* Neon Orbs */}
      <div className="absolute w-[300px] h-[300px] bg-indigo-500 blur-[120px] opacity-30 rounded-full top-10 left-10"></div>
      <div className="absolute w-[300px] h-[300px] bg-purple-500 blur-[120px] opacity-30 rounded-full bottom-10 right-10"></div>

      {/* Glass Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-2xl text-center shadow-2xl max-w-md">

        <h1 className="text-6xl font-bold text-white">404</h1>

        <p className="text-zinc-400 mt-3">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-block px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:scale-105 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}