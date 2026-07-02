import React from 'react';

const AddCollaboratorModal = ({
    isOpen,
    onClose,
    search,
    onSearchChange,
    filteredUsers = [],
    selectedUsers = [],
    onUserSelect,
    onAdd
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-2xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Add Collaborators</h2>
                        <p className="text-zinc-500 text-sm mt-1">Select users to add to this project</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl hover:bg-zinc-800 flex items-center justify-center transition text-zinc-400 hover:text-white"
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
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white placeholder-zinc-500"
                    />
                </div>

                {/* Users list */}
                <div className="max-h-[300px] overflow-y-auto p-6 space-y-3">
                    {filteredUsers.map((user) => {
                        const isSelected = selectedUsers.includes(user._id);
                        return (
                            <div
                                key={user._id}
                                onClick={() => onUserSelect(user._id)}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200
                                ${isSelected
                                    ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                                    : "bg-zinc-800/50 border-zinc-700 hover:border-indigo-500/50 hover:bg-zinc-800"}`}
                            >
                                <div className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
                                    <i className="ri-user-3-fill text-white"></i>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-medium truncate text-white">{user.email}</p>
                                    <p className="text-xs text-zinc-500">Click to select</p>
                                </div>
                            </div>
                        );
                    })}

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-10 text-zinc-500">No users found</div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-zinc-800 bg-zinc-950/20">
                    <button
                        onClick={onClose}
                        className="px-5 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onAdd}
                        disabled={selectedUsers.length === 0}
                        className="px-5 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-indigo-500/25"
                    >
                        Add Selected Users ({selectedUsers.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCollaboratorModal;
