import React, { useEffect, useState, useContext, useRef } from 'react'
import { data, useLocation } from 'react-router-dom'
import axios from '../config/axios.js'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket.js'
import { UserContext } from '../context/user.context'
import Markdown from 'markdown-to-jsx'
import MarkdownRenderer from '../components/Markdown.jsx'
import Editor from "@monaco-editor/react";
import { getWebContainer } from '../config/webContainer.js'

const Project = () => {
    const location = useLocation();
    const [isMembersOpen, setIsMembersOpen] = useState(false);
    const [isAddCollaboratorOpen, setIsAddCollaboratorOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [project, setProject] = useState(location.state.project);
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const { user } = useContext(UserContext);

    const [fileTree, setFileTree] = useState({});
    const [activeFile, setActiveFile] = useState(null);

    const [users, setUsers] = useState([]);

    const [webConatiner, setWebConatiner] = useState(null)

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

        if (!webConatiner) {
            getWebContainer().then(container => {
                setWebConatiner(container)
                console.log("container started");

            })
        }

        receiveMessage('project-message', async data => {
            setMessages(prevMessages => [...prevMessages, data])


            const { fileTree } = data.message;
            console.log(fileTree);
            if (fileTree) {
                console.log(fileTree);
               

                setFileTree(fileTree);

                // auto-select first file
                const firstFile = Object.keys(fileTree)[0];
                setActiveFile(firstFile);
            }
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
        const outgoingMessage = {
            message,
            sender: user.email,
        }

        setMessages(prevMessages => [...prevMessages, outgoingMessage])

        sendMessage('project-message', outgoingMessage)
        setMessage("")
    }
    useEffect(() => {
        if (messageBox.current) {
            messageBox.current.scrollTop = messageBox.current.scrollHeight;
        }
    }, [messages]);

    const runCode = async () => {
        if (!webConatiner) return;

        try {
            console.clear();

            await webConatiner.mount(fileTree);

            console.log("Installing...");

            const install = await webConatiner.spawn("npm", ["install"]);

            install.output.pipeTo(
                new WritableStream({
                    write(data) {
                        console.log(data);
                    },
                })
            );

            const code = await install.exit;

            if (code !== 0) {
                console.log("Install failed");
                return;
            }

            console.log("Starting...");

            const devServer = await webConatiner.spawn("npm", ["run", "dev"]);

            devServer.output.pipeTo(
                new WritableStream({
                    write(data) {
                        console.log(data);
                    },
                })
            );

        } catch (err) {
            console.error(err);
        }
    };


    const [iframeUrl, setIframeUrl] = useState("");

    useEffect(() => {
        if (!webConatiner) return;

        webConatiner.on("server-ready", (port, url) => {
            setIframeUrl(url);
        });
    }, [webConatiner]);

    return (

        <main className="h-screen bg-black text-white relative overflow-hidden flex">

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />


            {/* Overlay */}
            <>
                <div
                    onClick={() => {
                        setIsMembersOpen(false);
                        setIsAddCollaboratorOpen(false);
                    }}
                    className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300
    ${isMembersOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                />
            </>

            {/* Collaborators Drawer */}
            <div
                className={`max-[450px]:w-full  fixed left-0 top-0 h-screen w-[29.5%]
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
                    className="message-box flex-1 overflow-y-auto p-4 space-y-4 ">
                    {messages.map((msg, idx) => {
                        const isOutgoing = msg.sender === user.email
                        const isAI = msg.sender === 'AI'
                        return (
                            <div
                                key={idx}
                                className={`max-w-[85%] ${isOutgoing ? 'ml-auto flex flex-col items-end' : ''}`}
                            >
                                <p className="text-xs text-zinc-500 mb-1 ml-2">
                                    {msg.sender}
                                </p>
                                {isOutgoing ? (<div className={'max-w-75 w-fit wrap-break-word bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-3'}>
                                    <p className="wrap-break-word text-sm">
                                        {msg.message}
                                    </p>
                                </div>
                                ) : (
                                    isAI ? (
                                        <div className="ai-msg max-h-96 max-w-75 overflow-auto rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 to-purple-950/40 backdrop-blur-xl p-4 text-sm text-zinc-200">
                                            {/* <Markdown>{msg.message.text}</Markdown> */}
                                            <MarkdownRenderer content={msg.message.text} />
                                            {/* {msg.message.text} */}
                                        </div>
                                    ) : (
                                        <div className={`bg-zinc-800 w-fit rounded-2xl p-3`}>
                                            <p className="wrap-break-word text-sm">
                                                {msg.message}
                                            </p>
                                        </div>
                                    )

                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-zinc-800">

                    <div className="flex gap-2 overflow-hidden">

                        <input
                            value={message}
                            type="text"
                            onChange={(e) => { setMessage(e.target.value) }}
                            onKeyDown={(e) => {


                                if (message.trim() != '' && e.key === 'Enter') {
                                    sendMsg();
                                }
                            }}
                            placeholder="Ask AI or chat..."
                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                        />

                        <button
                            onClick={() => {
                                if (message.trim() != "") {
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
            <div className="workSpace max-[450px]:hidden relative z-10 w-[70%] flex">

                {/* Left Panel - File Explorer */}
                <div className="w-1/4 border-r border-zinc-800 bg-zinc-950/40 p-4">

                    <h3 className="text-sm text-zinc-400 mb-3">FILES</h3>

                    <div className="space-y-2">
                        {Object.keys(fileTree).map((fileName) => (
                            <div
                                key={fileName}
                                onClick={() => setActiveFile(fileName)}
                                className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition
                ${activeFile === fileName
                                        ? "bg-indigo-600/20 text-indigo-300"
                                        : "hover:bg-zinc-800 text-zinc-400"
                                    }`}
                            >
                                {fileName}
                            </div>
                        ))}
                    </div>

                </div>

                {/* Right Panel - Code Editor */}
                <div className="w-3/4 p-6 relative">

                    {/* Background effects */}
                    <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />

                    {/* Code Area */}
                    <div className="relative z-10">

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-zinc-200">
                                {activeFile || "No file selected"}
                            </h2>
                            <button
                                onClick={runCode}

                                className="
                                            flex items-center gap-2
                                            px-5 py-2.5
                                            rounded-xl
                                            bg-gradient-to-r from-indigo-500 to-purple-600
                                            text-white font-semibold
                                            shadow-lg shadow-indigo-500/30
                                            hover:from-indigo-400 hover:to-purple-500
                                            hover:shadow-purple-500/40
                                            hover:scale-105
                                            active:scale-95
                                            transition-all duration-200
                                            border border-white/10
                                            backdrop-blur-md
                                        "
                            >
                                Run
                            </button>
                        </div>
                        {activeFile && <div className="h-[650px]  overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur">
                            <Editor
                                height="100%"
                                theme="vs-dark"
                                path={activeFile}
                                value={fileTree[activeFile]?.file.contents || ""}
                                onChange={(value) => {
                                    setFileTree(prev => ({
                                        ...prev,
                                        [activeFile]: {
                                            ...prev[activeFile],
                                            file: {
                                                ...prev[activeFile].file,
                                                contents: value || ""
                                            }
                                        }
                                    }));
                                }}
                            />
                            
                        </div>}


                    </div>

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
