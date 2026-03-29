"use client"

import { useRef } from "react"

type Props = {
    file: File | null
    setFile: (file: File | null) => void
}

export default function UploadBox({file, setFile}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const allowedExtentions = [
        "csv",
        "xlsx",
        "xls",
    ];

    const isValidFile = (file: File) => {
        const ext = file.name.split(".").pop()?.toLowerCase();
        return allowedExtentions.includes(ext || "");
    }

    const handleClick = () => {
        inputRef.current?.click();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!isValidFile(selectedFile)) {
                alert("Invalid file type. Only CSV, XLS, and XLSX files are allowed.");
                e.target.value = "";
                return;
            }
            setFile(selectedFile);
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            if (!isValidFile(droppedFile)) {
                alert("Invalid file type. Only CSV, XLS, and XLSX files are allowed.");
                return;
            }
            setFile(droppedFile);
        }
    }

    const handleRemove = () => {
        setFile(null);
    }

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center text-gray-600 hover:border-green-500 transition cursor-pointer">
            {/* HIDDEN INPUT */}
            <input type="file" ref={inputRef} onChange={handleChange} className="hidden" accept=".csv, .xlsx, .xls" />

            {/* NO FILE STATE */}
            { !file && (
                <div onClick={handleClick} onDragOver={handleDragOver} onDrop={handleDrop} className="border-2 border-dashed border-gray-300 rounded-md p-10 text-center text-gray-600 hover:border-green-500 transition cursor-pointer">
                    <p className="mb-2">Drag & drop your dataset here</p>
                    <p className="text-blue-500">or click to browse</p>
                </div>
                )
            }

            {/* HAS FILE STATE */}
            { file && (
                <div className="mt-4 text-center">
                    <div className="border-2 border-dashed border-gray-3400 rounded-md p-8">
                        <p className="text-blue-600 font-medium">{file.name} uploaded</p>
                    </div>
                    <div className="flex justify-center gap-3 mt-3">
                        <button onClick={handleRemove} className="px-4 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400">Remove</button>
                        <button onClick={handleClick} className="px-4 py-1 text-sm bg-green-500 rounded hover:bg-green-600 text-white">Replace</button>
                    </div>
                </div>
            )}
        </div>
    )
}