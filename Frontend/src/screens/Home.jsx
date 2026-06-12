import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context.jsx";
import axios from '../config/axios.js'
import {useNavigate} from 'react-router-dom'

const Home = () => {
  const { user } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState([])

  const navigate = useNavigate();

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
  useEffect(()=>{

    axios.get('/project/all')
    .then((res) =>{
      setProject(res.data.projects)
    })
    .catch((err)=>{
      console.log(err); 
    })


  },[projectName])
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden p-6">

  {/* Background Blur Effects */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />

  <div className="relative z-10 max-w-7xl mx-auto">

    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold">Projects</h1>
        <p className="text-zinc-400 mt-2">
          Manage and collaborate on your AI development projects
        </p>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-indigo-500/20"
      >
        <i className="ri-add-line text-xl font-semibold"></i>
        <span>Create Project</span>
      </button>
    </div>

    {/* Projects Grid */}
    {project.length > 0 ? (
      <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {project.map((project) => (
          <div
          onClick={()=>{ 
            navigate(`/project`,{
              state:{project}
            })
          }}
            key={project._id}
            className="group bg-zinc-900/70 backdrop-blur-md border border-zinc-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition">
                  {project.name}
                </h2>

                <p className="text-sm text-zinc-500 mt-2">
                  AI Developer Workspace
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <i className="ri-folder-3-line text-indigo-400 text-2xl"></i>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-sm text-zinc-500 font-semibold">
                <i className="ri-user-line font-bold text-lg"></i> <small className="text-lg">Collaborators:</small> {project.users.length}
              </span>

              <i className="ri-arrow-right-line text-lg text-zinc-400 group-hover:text-indigo-400 transition"></i>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center">
          <i className="ri-folder-open-line text-5xl text-zinc-500"></i>
        </div>

        <h2 className="mt-6 text-2xl font-semibold">
          No Projects Yet
        </h2>

        <p className="text-zinc-500 mt-2 max-w-md">
          Create your first project and start building AI-powered
          applications with your team.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:scale-105 transition"
        >
          Create First Project
        </button>
      </div>
    )}
  </div>

  {/* Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 px-4">

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">

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