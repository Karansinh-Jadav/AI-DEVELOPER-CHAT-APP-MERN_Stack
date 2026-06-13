import { Link } from "react-router-dom";

export default function NotLoggedIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

      {/* Neon Orbs */}
      <div className="absolute w-[300px] h-[300px] bg-indigo-500 blur-[120px] opacity-30 rounded-full top-20 left-20"></div>
      <div className="absolute w-[300px] h-[300px] bg-purple-500 blur-[120px] opacity-30 rounded-full bottom-20 right-20"></div>

      {/* Glass Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-2xl text-center shadow-2xl max-w-md">

        <h2 className="text-3xl font-semibold text-white">
          You are not logged in
        </h2>

        <p className="text-zinc-400 mt-3">
          Please login to access this feature or continue using the app.
        </p>

        <div className="mt-6 flex gap-3 justify-center">

          <Link
            to="/login"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 transition"
          >
            Login
          </Link>

          <Link
            to="/"
            className="px-5 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
          >
            Home
          </Link>

        </div>
      </div>
    </div>
  );
}