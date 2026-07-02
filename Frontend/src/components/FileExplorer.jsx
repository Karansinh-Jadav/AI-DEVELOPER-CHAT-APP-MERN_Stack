import React from 'react';

const FileExplorer = ({
    fileTree = {},
    activeFile,
    setActiveFile
}) => {
    return (
        <div className="w-1/4 border-r border-zinc-800 bg-zinc-950/40 p-4 shrink-0 overflow-y-auto">
            <h3 className="text-xs text-zinc-400 font-semibold tracking-wider mb-3">FILES</h3>
            <div className="space-y-1">
                {Object.keys(fileTree).map((fileName) => (
                    <div
                        key={fileName}
                        onClick={() => setActiveFile(fileName)}
                        className={`px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200 flex items-center gap-2
                        ${activeFile === fileName
                            ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                            : "hover:bg-zinc-800/50 text-zinc-400 border border-transparent"}`}
                    >
                        <i className="ri-file-code-line text-lg"></i>
                        <span className="truncate">{fileName}</span>
                    </div>
                ))}
                {Object.keys(fileTree).length === 0 && (
                    <div className="text-zinc-600 text-xs py-4 text-center">No files generated yet</div>
                )}
            </div>
        </div>
    );
};

export default FileExplorer;
