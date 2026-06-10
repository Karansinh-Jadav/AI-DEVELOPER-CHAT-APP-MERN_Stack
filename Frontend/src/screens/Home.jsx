import React, { useContext, useState } from "react";
import { UserContext } from "../context/user.context.jsx";
import axios from '../config/axios.js'

const Home = () => {
  const { user } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  function createProject(e) {
    e.preventDefault();

    axios.post('/project/create',{
      name:projectName,
    })
    .then((res)=>{
      console.log(res);
      
    })
    .catch((err)=>{
      console.log(err); 
    })
    // API call here

    setProjectName("");
    setIsModalOpen(false);
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden p-6">

  {/* Background Blur Effects */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />

  <div className="relative z-10">
    <button
      onClick={() => setIsModalOpen(true)}
      className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-indigo-500/20"
    >
      <i className="ri-add-line text-xl font-semibold"></i>
      <span>Create Project</span>
    </button>
  </div>
        {/* Modal */}
{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 px-4">

    {/* Background Glow */}
    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />

    <div className="relative z-10 w-full max-w-md">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Create Project
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Give your new project a name
            </p>
          </div>

          <button
            onClick={() => {
              setIsModalOpen(false);
              setProjectName("");
            }}
            className="text-zinc-400 hover:text-white transition"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={createProject} className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Project Name
            </label>

            <input
              type="text"
              placeholder="My Awesome Project"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setProjectName("");
              }}
              className="px-5 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-indigo-500/20"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
</main>
  
  );
};

export default Home;