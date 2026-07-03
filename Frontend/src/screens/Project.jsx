import React, { useEffect, useState, useContext, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import axios from '../config/axios.js'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket.js'
import { UserContext } from '../context/user.context'
import { getWebContainer } from '../config/webContainer.js'

// Import subcomponents
import CollaboratorsDrawer from '../components/CollaboratorsDrawer'
import AddCollaboratorModal from '../components/AddCollaboratorModal'
import ChatPanel from '../components/ChatPanel'
import FileExplorer from '../components/FileExplorer'
import EditorPanel from '../components/EditorPanel'

const Project = () => {
    const location = useLocation();
    const [isMembersOpen, setIsMembersOpen] = useState(false);
    const [isAddCollaboratorOpen, setIsAddCollaboratorOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [project, setProject] = useState(location.state.project);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { user } = useContext(UserContext);

    const [fileTree, setFileTree] = useState({});
    const [activeFile, setActiveFile] = useState(null);

    const [users, setUsers] = useState([]);
    const [webContainer, setWebContainer] = useState(null);
    const [iframeUrl, setIframeUrl] = useState("");

    const messageBox = React.createRef();
    const activeProcessRef = useRef(null);

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

        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container);
                console.log("container started");
            });
        }

        receiveMessage('project-message', async data => {
            setMessages(prevMessages => [...prevMessages, data]);

            if (data && data.message && typeof data.message === 'object') {
                const { fileTree } = data.message;
                if (fileTree) {
                    console.log("Setting fileTree: ", fileTree);
                    setFileTree(fileTree);

                    // auto-select first file
                    const firstFile = Object.keys(fileTree)[0];
                    setActiveFile(firstFile);
                }
            }
        });

        axios.get('/users/all')
            .then(res => {
                setUsers(res.data.allUsers);
            })
            .catch((err) => {
                console.log(err);
            });

        axios.get(`/project/get-project/${location.state.project._id}`)
            .then(res => {
                setProject(res.data.project);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

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
            });
    }

    function sendMsg() {
        if (message.trim() === "") return;
        const outgoingMessage = {
            message,
            sender: user.email,
        };

        setMessages(prevMessages => [...prevMessages, outgoingMessage]);
        sendMessage('project-message', outgoingMessage);
        setMessage("");
    }

    useEffect(() => {
        if (messageBox.current) {
            messageBox.current.scrollTop = messageBox.current.scrollHeight;
        }
    }, [messages]);

    const runCode = async () => {
        if (!webContainer) return;

        try {
            console.clear();

            if (activeProcessRef.current) {
                console.log("Killing previous running server process...");
                activeProcessRef.current.kill();
                activeProcessRef.current = null;
            }

            const hasPackageJson = Object.keys(fileTree).includes('package.json');

            if (hasPackageJson) {
                await webContainer.mount(fileTree);
                console.log("Installing node modules...");

                const install = await webContainer.spawn("npm", ["install"]);
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

                console.log("Starting dev server...");
                const devServer = await webContainer.spawn("npm", ["run", "dev"]);
                activeProcessRef.current = devServer;

                devServer.output.pipeTo(
                    new WritableStream({
                        write(data) {
                            console.log(data);
                        },
                    })
                );
            } else {
                console.log("No package.json found. Setting up static site server...");
                const staticServerCode = `
                    const http = require('http');
                    const fs = require('fs');
                    const path = require('path');

                    const PORT = 3000;

                    const MIME_TYPES = {
                        '.html': 'text/html',
                        '.css': 'text/css',
                        '.js': 'text/javascript',
                        '.json': 'application/json',
                        '.png': 'image/png',
                        '.jpg': 'image/jpeg',
                        '.gif': 'image/gif',
                        '.svg': 'image/svg+xml',
                        '.ico': 'image/x-icon'
                    };

                    const server = http.createServer((req, res) => {
                        let filePath = '.' + req.url;
                        if (filePath === './') {
                            filePath = './index.html';
                        }

                        const extname = String(path.extname(filePath)).toLowerCase();
                        const contentType = MIME_TYPES[extname] || 'application/octet-stream';

                        fs.readFile(filePath, (error, content) => {
                            if (error) {
                                if(error.code === 'ENOENT') {
                                    res.writeHead(404, { 'Content-Type': 'text/html' });
                                    res.end('<h1>404 Not Found</h1>', 'utf-8');
                                } else {
                                    res.writeHead(500);
                                    res.end('Server Error: ' + error.code);
                                }
                            } else {
                                res.writeHead(200, { 'Content-Type': contentType });
                                res.end(content, 'utf-8');
                            }
                        });
                    });

                    server.listen(PORT, () => {
                        console.log('Static server is running at port ' + PORT);
                    });
                `;

                const extendedFileTree = {
                    ...fileTree,
                    '.server.js': {
                        file: {
                            contents: staticServerCode
                        }
                    }
                };

                await webContainer.mount(extendedFileTree);
                console.log("Starting static server...");
                const staticServer = await webContainer.spawn("node", [".server.js"]);
                activeProcessRef.current = staticServer;

                staticServer.output.pipeTo(
                    new WritableStream({
                        write(data) {
                            console.log(data);
                        },
                    })
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!webContainer) return;

        webContainer.on("server-ready", (port, url) => {
            console.log("WebContainer server is ready at port:", port, "url:", url);
            setIframeUrl(url);
        });
    }, [webContainer]);

    const handleFileContentChange = (value) => {
        if (!activeFile) return;
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
    };

    return (
        <main className="h-screen bg-black text-white relative overflow-hidden flex">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Overlay */}
            {(isMembersOpen || isAddCollaboratorOpen) && (
                <div
                    onClick={() => {
                        setIsMembersOpen(false);
                        setIsAddCollaboratorOpen(false);
                    }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
                />
            )}

            {/* Collaborators Drawer */}
            <CollaboratorsDrawer
                isOpen={isMembersOpen}
                onClose={() => setIsMembersOpen(false)}
                onAddCollaboratorClick={() => setIsAddCollaboratorOpen(true)}
                users={project.users}
            />

            {/* Chat Section */}
            <ChatPanel
                projectName={project?.name}
                onMembersClick={() => setIsMembersOpen(true)}
                messages={messages}
                message={message}
                onMessageChange={setMessage}
                onMessageSubmit={sendMsg}
                userEmail={user?.email}
                messageBoxRef={messageBox}
            />

            {/* AI Workspace */}
            <div className="workSpace max-[450px]:hidden relative z-10 w-[70%] flex">
                {/* Left Panel - File Explorer */}
                <FileExplorer
                    fileTree={fileTree}
                    activeFile={activeFile}
                    setActiveFile={setActiveFile}
                />

                {/* Right Panel - Code Editor & Live Preview */}
                <EditorPanel
                    activeFile={activeFile}
                    fileTree={fileTree}
                    onFileContentChange={handleFileContentChange}
                    runCode={runCode}
                    iframeUrl={iframeUrl}
                    setIframeUrl={setIframeUrl}
                    isWebContainerLoaded={!!webContainer}
                />
            </div>

            {/* Add Collaborator Modal */}
            <AddCollaboratorModal
                isOpen={isAddCollaboratorOpen}
                onClose={() => setIsAddCollaboratorOpen(false)}
                search={search}
                onSearchChange={setSearch}
                filteredUsers={filteredUsers}
                selectedUsers={selectedUsers}
                onUserSelect={handleUserSelect}
                onAdd={addCollaborators}
            />
        </main>
    );
}

export default Project;
