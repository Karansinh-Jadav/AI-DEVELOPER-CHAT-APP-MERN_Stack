import React from 'react';

const CollaboratorsDrawer = ({
    isOpen,
    onClose,
    onAddCollaboratorClick,
    users = []
}) => {
    return (
        <div
            className={`max-[450px]:w-full fixed left-0 top-0 h-screen w-[29.5%]
            bg-zinc-900/80 backdrop-blur-xl border-r border-zinc-800 z-50 shadow-2xl
            transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
        >
            <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-5">
                <h2 className="font-semibold text-lg">Collaborators</h2>
                <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-lg hover:bg-zinc-800 flex items-center justify-center transition"
                >
                    <i className="ri-close-line text-xl"></i>
                </button>
            </div>
            <div className="p-4">
                <button
                    onClick={onAddCollaboratorClick}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                    bg-linear-to-r from-indigo-600 to-purple-600
                    hover:opacity-90 transition font-medium text-white shadow-lg"
                >
                    <i className="ri-user-add-line"></i>
                    <span>Add Collaborator</span>
                </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)]">
                {users.map(user => (
                    <div key={user._id || user} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
                        <div className="w-11 h-11 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
                            <i className="ri-user-3-fill text-white"></i>
                        </div>
                        <div className='max-w-[75%]'>
                            <p className="text-sm font-medium text-white truncate max-w-[200px]">
                                {user.email}
                            </p>
                            <p className="text-xs text-zinc-500">Collaborator</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CollaboratorsDrawer;
