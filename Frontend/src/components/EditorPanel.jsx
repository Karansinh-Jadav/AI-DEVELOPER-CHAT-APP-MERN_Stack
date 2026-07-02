import React from 'react';
import Editor from "@monaco-editor/react";

const EditorPanel = ({
    activeFile,
    fileTree = {},
    onFileContentChange,
    runCode,
    iframeUrl,
    setIframeUrl,
    isWebContainerLoaded
}) => {
    return (
        <div className="flex-1 p-6 relative flex flex-col h-full overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

            {/* Code Area */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Panel Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                        {activeFile ? (
                            <>
                                <i className="ri-file-edit-line text-indigo-400"></i>
                                {activeFile}
                            </>
                        ) : "No file selected"}
                    </h2>
                    <button
                        onClick={runCode}
                        disabled={!isWebContainerLoaded || Object.keys(fileTree).length === 0}
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
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none
                            transition-all duration-200
                            border border-white/10
                            backdrop-blur-md
                        "
                    >
                        <i className="ri-play-fill text-lg"></i>
                        <span>Run</span>
                    </button>
                </div>

                {/* Main panel content: Split Editor / Preview */}
                {activeFile ? (
                    <div className="flex-1 flex gap-4 min-h-0 h-[650px]">
                        {/* Monaco Editor Container */}
                        <div className={`h-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur transition-all duration-300 ${iframeUrl ? 'w-1/2' : 'w-full'}`}>
                            <Editor
                                height="100%"
                                theme="vs-dark"
                                path={activeFile}
                                value={fileTree[activeFile]?.file.contents || ""}
                                onChange={onFileContentChange}
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    automaticLayout: true,
                                }}
                            />
                        </div>

                        {/* App Preview Container (Shown side-by-side on Run) */}
                        {iframeUrl && (
                            <div className="w-1/2 h-full rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col transition-all duration-300">
                                <div className="bg-zinc-900 text-zinc-300 text-xs px-4 py-2 flex items-center justify-between border-b border-zinc-800">
                                    <div className="flex items-center gap-2 max-w-[80%]">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="truncate font-mono">{iframeUrl}</span>
                                    </div>
                                    <button 
                                        onClick={() => setIframeUrl("")}
                                        className="hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
                                        title="Close Preview"
                                    >
                                        <i className="ri-close-line text-base"></i>
                                    </button>
                                </div>
                                <iframe src={iframeUrl} className="w-full flex-1 bg-white border-none" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur flex flex-col items-center justify-center text-zinc-500">
                        <i className="ri-code-s-slash-line text-5xl text-zinc-700 mb-3 animate-pulse"></i>
                        <p className="text-sm">Select or generate a file to start editing</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditorPanel;
