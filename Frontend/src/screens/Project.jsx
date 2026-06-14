import React, { useEffect, useState, useContext, useRef } from 'react'
import { data, useLocation } from 'react-router-dom'
import axios from '../config/axios.js'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket.js'
import { UserContext } from '../context/user.context'

const Project = () => {
    const location = useLocation();
    const [isMembersOpen, setIsMembersOpen] = useState(false);
    const [isAddCollaboratorOpen, setIsAddCollaboratorOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [project, setProject] = useState(location.state.project);
    const [message, setMessage] = useState('')
    const { user } = useContext(UserContext);

    const [users, setUsers] = useState([]);

    const messageBox = React.createRef();

    const handleUserSelect = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(
                selectedUsers.filter(userId => userId !== id)
            );
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };
    useEffect(() => {
        initializeSocket(project._id);

        receiveMessage('project-message', data => {
            appendIncomingMessage(data)
        })
        axios.get('/users/all')
            .then(res => {
                setUsers(res.data.allUsers)
            })
            .catch((err) => {
                console.log(err);
            })
        axios.get(`/project/get-project/${location.state.project._id}`)
            .then(res => {
                setProject(res.data.project)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [search]);

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(
            debouncedSearch.toLowerCase()
        ) &&
        !project.users?.some(
            pUser => pUser._id === user._id
        )
    );

    function addCollaborators() {
        axios.put('/project/add-user', {
            projectId: project._id,
            users: Array.from(selectedUsers)
        }).then(res => {
            setProject(res.data.project); // if backend returns updated project

            setSelectedUsers([]);
            setIsAddCollaboratorOpen(false);
        })
            .catch((err) => {
                console.log(err);

            })
    }
    function sendMsg() {
        appendOutgoingMessage(message)

        sendMessage('project-message', {
            message,
            sender: user.email,
        })
        setMessage("")
    }
    function appendIncomingMessage(messageObject) {
        const messageBox = document.querySelector('.message-box')

        const message = document.createElement('div')
        message.classList.add("max-w-[85%]")
        message.innerHTML = `
        <p class="text-xs text-zinc-500 mb-1 ml-2">
                            ${messageObject.sender}
                        </p>

                        <div class="bg-zinc-800 rounded-2xl p-3">
                            <p class="wrap-break-word text-sm">
                                ${messageObject.message}
                            </p>
                        </div>
        `
        messageBox.appendChild(message)
        scrollToBottom();
    }
    function appendOutgoingMessage(message) {
        const messageBox = document.querySelector('.message-box')

        const newMessage = document.createElement('div')
        newMessage.classList.add("max-w-[85%]", "ml-auto")
        newMessage.innerHTML = `
        <p class="text-xs text-zinc-500 mb-1 ml-2">
                            ${user.email}
                        </p>

                        <div class="wrap-break-word bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-3">
                            <p class="text-sm">
                                ${message}
                            </p>
                        </div>
        `
        messageBox.appendChild(newMessage)
        scrollToBottom();
    }
    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }

    return (

        <main className="h-screen bg-black text-white relative overflow-hidden flex">

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />


            {/* Overlay */}
            <div
                onClick={() => {
                    setIsMembersOpen(false);
                    setIsAddCollaboratorOpen(false);
                }}
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300
    ${isMembersOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            />

            {/* Collaborators Drawer */}
            <div
                className={`fixed left-0 top-0 h-screen w-[29.5%]
    bg-zinc-900/80 backdrop-blur-xl border-r border-zinc-800 z-50 shadow-2xl
    transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
    ${isMembersOpen
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-full opacity-0"
                    }`}
            >

                <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-5">
                    <h2 className="font-semibold text-lg">
                        Collaborators
                    </h2>

                    <button
                        onClick={() => setIsMembersOpen(false)}
                        className="w-9 h-9 rounded-lg hover:bg-zinc-800 flex items-center justify-center"
                    >
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>
                <div className="p-4">

                    <button
                        onClick={() => setIsAddCollaboratorOpen(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
    bg-linear-to-r from-indigo-600 to-purple-600
    hover:opacity-90 transition"
                    >
                        <i className="ri-user-add-line"></i>
                        <span>Add Collaborator</span>
                    </button>

                </div>

                <div className="p-4 space-y-3">

                    {project.users && project.users.map(user => {
                        return (
                            <div key={user._id || user} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
                                <div className="w-11 h-11 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                                    <i className="ri-user-3-fill text-white"></i>
                                </div>

                                <div className='max-w-[75%]'>
                                    <p className="text-sm font-medium text-white overflow-hidden">
                                        {user.email}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        Collaborator
                                    </p>
                                </div>
                            </div>
                        )

                    })}


                </div>
            </div>
            {/* Chat Section */}
            <div className="max-[450px]:w-full relative z-10 w-[30%] border-r border-zinc-800 flex flex-col bg-zinc-950/50 backdrop-blur-md">

                {/* Header */}
                <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-5">

                    <div>
                        <h2 className="font-semibold">
                            {project?.name}
                        </h2>

                        <p className="text-xs text-zinc-500">
                            AI Developer Workspace
                        </p>
                    </div>

                    <button
                        onClick={() => setIsMembersOpen(true)}
                        className="w-10 h-10 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 flex items-center justify-center transition"
                    >
                        <i className="ri-team-line text-xl"></i>
                    </button>

                </div>

                {/* Messages */}
                <div
                    ref={messageBox}
                    className="message-box flex-1 overflow-y-auto p-4 space-y-4">


                </div>

                {/* Input */}
                <div className="p-4 border-t border-zinc-800">

                    <div className="flex gap-2 overflow-hidden">

                        <input
                            value={message}
                            type="text"
                            onChange={(e) => { setMessage(e.target.value) }}
                            onKeyDown={(e) => {
                                
                                
                                if (message.trim() != ''  && e.key === 'Enter') {
                                    sendMsg();
                                }
                            }}
                            placeholder="Ask AI or chat..."
                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                        />

                        <button
                            onClick={()=>{
                                if(message.trim()!=""){
                                    sendMsg()
                                }
                            }}
                            className="w-12 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center hover:opacity-90"
                        >
                            <i className="ri-send-plane-fill text-xl"></i>
                        </button>

                    </div>

                </div>

            </div>

            {/* AI Workspace */}
            <div className="workSpace max-[450px]:hidden relative z-10 w-[70%] flex items-center justify-center">

                <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />

                <div className="text-center">

                    <div className="w-24 h-24 mx-auto rounded-3xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
                        <i className="ri-code-box-line text-5xl text-indigo-400"></i>
                    </div>

                    <h2 className="text-3xl font-bold mt-6">
                        AI Workspace
                    </h2>

                    <p className="text-zinc-500 mt-3 max-w-md">
                        Generated code, files, previews, terminal output,
                        and AI artifacts will appear here.
                    </p>

                </div>

            </div>
            {/* Add Collaborator Modal */}
            <div
                className={`fixed inset-0 z-[60] flex items-center justify-center
  transition-all duration-300
  ${isAddCollaboratorOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
            >
                {/* Overlay */}
                <div
                    onClick={() => setIsAddCollaboratorOpen(false)}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                />

                {/* Modal */}
                <div className="relative w-full max-w-2xl mx-4 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Add Collaborators
                            </h2>
                            <p className="text-zinc-500 text-sm mt-1">
                                Select users to add to this project
                            </p>
                        </div>

                        <button
                            onClick={() => setIsAddCollaboratorOpen(false)}
                            className="w-10 h-10 rounded-xl hover:bg-zinc-800 flex items-center justify-center"
                        >
                            <i className="ri-close-line text-xl"></i>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-6 border-b border-zinc-800">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                        />
                    </div>


                    {/* Users */}
                    <div className="max-h-[400px] overflow-y-auto p-6 space-y-3">

                        {filteredUsers?.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => handleUserSelect(user._id)}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200
            ${selectedUsers.includes(user._id)
                                        ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                                        : "bg-zinc-800/50 border-zinc-700 hover:border-indigo-500/50 hover:bg-zinc-800"
                                    }`}
                            >
                                {/* Dummy Profile */}
                                <div className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
                                    <i className="ri-user-3-fill text-white"></i>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-medium truncate">
                                        {user.email}
                                    </p>

                                    <p className="text-xs text-zinc-500">
                                        Click to select
                                    </p>
                                </div>
                            </div>
                        ))}

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-10 text-zinc-500">
                                No users found
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-6 border-t border-zinc-800">
                        <button
                            onClick={() => setIsAddCollaboratorOpen(false)}
                            className="px-5 py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={addCollaborators}
                            className="px-5 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition"
                        >
                            Add Selected Users ({selectedUsers.length})
                        </button>
                    </div>

                </div>
            </div>
        </main>
    )
}

export default Project
