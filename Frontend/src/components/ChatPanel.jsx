import React from 'react';
import MarkdownRenderer from './Markdown';

const ChatPanel = ({
    projectName,
    onMembersClick,
    messages = [],
    message,
    onMessageChange,
    onMessageSubmit,
    userEmail,
    messageBoxRef
}) => {
    return (
        <div className="max-[450px]:w-full relative z-10 w-[30%] border-r border-zinc-800 flex flex-col bg-zinc-950/50 backdrop-blur-md">
            {/* Header */}
            <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-5">
                <div>
                    <h2 className="font-semibold text-white truncate max-w-[180px]">
                        {projectName}
                    </h2>
                    <p className="text-xs text-zinc-500">
                        AI Developer Workspace
                    </p>
                </div>
                <button
                    onClick={onMembersClick}
                    className="w-10 h-10 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 flex items-center justify-center transition text-indigo-400"
                >
                    <i className="ri-team-line text-xl"></i>
                </button>
            </div>

            {/* Messages Area */}
            <div
                ref={messageBoxRef}
                className="message-box flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages.map((msg, idx) => {
                    const isOutgoing = msg.sender === userEmail;
                    const isAI = msg.sender === 'AI';
                    return (
                        <div
                            key={idx}
                            className={`max-w-[85%] ${isOutgoing ? 'ml-auto flex flex-col items-end' : ''}`}
                        >
                            <p className="text-xs text-zinc-500 mb-1 ml-2">
                                {msg.sender}
                            </p>
                            {isOutgoing ? (
                                <div className="max-w-75 w-fit wrap-break-word bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-3 shadow-md">
                                    <p className="wrap-break-word text-sm text-white">
                                        {msg.message}
                                    </p>
                                </div>
                            ) : (
                                isAI ? (
                                    <div className="ai-msg max-h-96 max-w-75 overflow-auto rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 to-purple-950/40 backdrop-blur-xl p-4 text-sm text-zinc-200 shadow-lg">
                                        <MarkdownRenderer content={msg.message.text || msg.message} />
                                    </div>
                                ) : (
                                    <div className="bg-zinc-800 w-fit rounded-2xl p-3 shadow-md">
                                        <p className="wrap-break-word text-sm text-zinc-200">
                                            {msg.message}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-zinc-800">
                <div className="flex gap-2 overflow-hidden">
                    <input
                        value={message}
                        type="text"
                        onChange={(e) => onMessageChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onMessageSubmit();
                            }
                        }}
                        placeholder="Ask AI or chat..."
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white placeholder-zinc-500 text-sm"
                    />
                    <button
                        onClick={onMessageSubmit}
                        className="w-12 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center hover:opacity-90 text-white transition shadow-lg shadow-indigo-500/25 shrink-0"
                    >
                        <i className="ri-send-plane-fill text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
