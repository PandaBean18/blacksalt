"use client"

import React, { useState, useRef, useEffect } from "react";

type Point = {
    x: number;
    y: number;
}

type EncryptedFileData ={
    fileCiphertext: string, 
    fileIv: string, 
    fileName: string,
}

function PatternGridIndvDiv({onMouseDown, id, setRef}: {onMouseDown: (e: React.PointerEvent<HTMLDivElement>, dotRef: React.RefObject<HTMLDivElement | null>) => void, setRef: (el: HTMLDivElement, id: number) => void, id: number})  {
    const dotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dotRef.current) {
            setRef(dotRef.current, id);
        }
    }, [setRef, id]);
    return (
        <div className="flex flex-row justify-center items-center"
            onPointerDown={(e) => onMouseDown(e, dotRef)}
            ref = {dotRef}
            id = {`${id}`}
        >
            <div className="flex items-center justify-center w-[20px] h-[20px] rounded-full border-2 border-gray-500">
                <div className="w-[4px] h-[4px] rounded-full bg-white"></div>
            </div>
        </div>
    );
}

function DynamicLine({startPoint, endPoint}: {startPoint: Point, endPoint: Point}) {
    const length = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
    const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * 180 / Math.PI;

    const st: React.CSSProperties = {
        position: 'absolute',
        top: `${startPoint.y}px`,
        left: `${startPoint.x}px`,
        width: `${length}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0',
        backgroundColor: 'white',
        height: '2px',
        zIndex: 10 
    };

    return <div style={st}></div>;
}

interface PathPoint {
  x: number;
  y: number;
  id: number;
}

function PatternGrid({isDrawing, setIsDrawing, path, setPath, endPoint, setEndPoint, setIsShaking}: {isDrawing: boolean, setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>, path: PathPoint[], setPath: React.Dispatch<React.SetStateAction<PathPoint[]>>, endPoint: Point, setEndPoint: React.Dispatch<React.SetStateAction<Point>>, setIsShaking: React.Dispatch<React.SetStateAction<boolean>>}) {
    const allDotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);

    const setDotRef = (el: HTMLDivElement, id: number) => {
      if (el) {
        allDotRefs.current[id - 1] = el;
      }
    };

    const handleMouseDown = (e: React.PointerEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, dotRef: React.RefObject<HTMLDivElement | null>) => {
        setIsDrawing(true);
        const gridRect = gridRef.current!.getBoundingClientRect();
        const rect = dotRef.current!.getBoundingClientRect();
        const startX = rect.left - gridRect.left + rect.width / 2;
        const startY = rect.top - gridRect.top + rect.height / 2;

        e.preventDefault();

        const newPath = [{ x: startX, y: startY, id: parseInt(dotRef.current!.id) }];
        setPath(newPath);
        setEndPoint({ x: startX, y: startY });
    };

    useEffect(() => {
        const handleMouseMove = (e: PointerEvent) => {
            if (isDrawing) {
                e.preventDefault();
                const gridRect = gridRef.current!.getBoundingClientRect();

                setEndPoint({ x: e.clientX-gridRect.left, y: e.clientY - gridRect.top});

                const lastDotId = path.length > 0 ? path[path.length - 1].id : null;

                for (const dotEl of allDotRefs.current) {
                    if (!dotEl) continue;

                    const rect = dotEl.getBoundingClientRect();
                    const dotCenterX = rect.left + rect.width / 2;
                    const dotCenterY = rect.top + rect.height / 2;
                    const dotId = parseInt(dotEl.id);

                    if (lastDotId !== null && lastDotId === dotId) {
                        continue;
                    }

                    const distance = Math.hypot(e.clientX - dotCenterX, e.clientY - dotCenterY);

                    const isDotInPath = path.some(p => p.id === dotId);

                    if (distance < 20 && !isDotInPath) {
                        setPath(prevPath => [...prevPath, { x: dotCenterX-gridRect.left, y: dotCenterY-gridRect.top, id: dotId }]);
                        setEndPoint({ x: dotCenterX-gridRect.left, y: dotCenterY-gridRect.top});
                        break;
                    }
                }
            }
        };

        const handleMouseUp = () => {
            if (isDrawing) {
                setIsDrawing(false);

                const cleanedPath = [];
                let lastId = null;

                for (const point of path) {
                    if (point.id !== lastId) {
                        cleanedPath.push(point);
                        lastId = point.id;
                    }
                }
                
                setPath(cleanedPath);

                if (cleanedPath.length < 6) {
                    document.getElementById("infoText")!.style.color = "#a80000"
                    setIsShaking(true);

                    setTimeout(() => {
                        document.getElementById("infoText")!.style.color = "#8a8a8a"
                        setIsShaking(false);
                    }, 3000);

                    clearGrid(setPath);
                }

            }
        };

        if (isDrawing) {
            window.addEventListener('pointermove', handleMouseMove);
            window.addEventListener('pointerup', handleMouseUp);

        }

        return () => {
            window.removeEventListener('pointermove', handleMouseMove);
            window.removeEventListener('pointerup', handleMouseUp);
        };
    }, [isDrawing, path]);

    const completedLines = path.slice(0, -1).map((point, index) => ({
      start: point,
      end: path[index + 1],
    }));

    return (
        <div ref={gridRef} className="relative h-[220px] w-[220px] grid grid-cols-4 grid-rows-4 border rounded-md border-[#400] touch-none">
            <PatternGridIndvDiv key={0} onMouseDown={handleMouseDown} id={1} setRef={setDotRef}/>
            <PatternGridIndvDiv key={1} onMouseDown={handleMouseDown} id={2} setRef={setDotRef}/>
            <PatternGridIndvDiv key={2} onMouseDown={handleMouseDown} id={3} setRef={setDotRef}/>
            <PatternGridIndvDiv key={3} onMouseDown={handleMouseDown} id={4} setRef={setDotRef}/>
            <PatternGridIndvDiv key={4} onMouseDown={handleMouseDown} id={5} setRef={setDotRef}/>
            <PatternGridIndvDiv key={5} onMouseDown={handleMouseDown} id={6} setRef={setDotRef}/>
            <PatternGridIndvDiv key={6} onMouseDown={handleMouseDown} id={7} setRef={setDotRef}/>
            <PatternGridIndvDiv key={7} onMouseDown={handleMouseDown} id={8} setRef={setDotRef}/>
            <PatternGridIndvDiv key={8} onMouseDown={handleMouseDown} id={9} setRef={setDotRef}/>
            <PatternGridIndvDiv key={9} onMouseDown={handleMouseDown} id={10} setRef={setDotRef}/>
            <PatternGridIndvDiv key={10} onMouseDown={handleMouseDown} id={11} setRef={setDotRef}/>
            <PatternGridIndvDiv key={11} onMouseDown={handleMouseDown} id={12} setRef={setDotRef}/>
            <PatternGridIndvDiv key={12} onMouseDown={handleMouseDown} id={13} setRef={setDotRef}/>
            <PatternGridIndvDiv key={13} onMouseDown={handleMouseDown} id={14} setRef={setDotRef}/>
            <PatternGridIndvDiv key={14} onMouseDown={handleMouseDown} id={15} setRef={setDotRef}/>
            <PatternGridIndvDiv key={15} onMouseDown={handleMouseDown} id={16} setRef={setDotRef}/>

            {completedLines.map((line, index) => (
                <DynamicLine key={`line-${index}`} startPoint={line.start} endPoint={line.end} />
            ))}

            {isDrawing && path.length > 0 && (
                <DynamicLine startPoint={path[path.length - 1]} endPoint={endPoint} />
            )}
        </div>
    );
}

function clearGrid(setPath: React.Dispatch<React.SetStateAction<PathPoint[]>>) {
    const path: PathPoint[] = []

    setPath(path);
}

function hexToBuffer(hexString: string) {
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }
    return bytes.buffer;
}

async function encryptText(text: string, keyHex: string) {
    const textBuffer = new TextEncoder().encode(text);
    const keyBuffer = hexToBuffer(keyHex);
    
    const importedKey = await window.crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
        name: "AES-GCM",
        iv: iv,
        },
        importedKey,
        textBuffer
    );

    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    const ciphertextHex = Array.from(new Uint8Array(encryptedBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    return {
        ciphertext: ciphertextHex,
        iv: ivHex,
    };
}

async function encryptFile(file: File, keyHex: string): Promise<EncryptedFileData | void> {
    return new Promise(async (resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
        try {
            const fileBuffer = event.target!.result as ArrayBuffer;

            if (fileBuffer === null) {
                return;
            }

            const keyBuffer = hexToBuffer(keyHex);
            const importedKey = await window.crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
            );

            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            
            const encryptedBuffer = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            importedKey,
            fileBuffer
            );

            const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
            const ciphertextHex = Array.from(new Uint8Array(encryptedBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
            
            resolve({
            fileCiphertext: ciphertextHex,
            fileIv: ivHex,
            fileName: file.name, 
            } as EncryptedFileData);
        } catch (e) {
            reject(e);
        }
        };

        reader.onerror = (e) => {
        reject(e);
        };

        reader.readAsArrayBuffer(file);
    });
}


async function generateKeys(patternString: string) {
    const patternBuffer = new TextEncoder().encode(patternString);

    const lookupKey = await window.crypto.subtle.deriveKey(
        {
        name: "PBKDF2",
        salt: new ArrayBuffer(0), 
        iterations: 200000,
        hash: "SHA-256",
        },
        await window.crypto.subtle.importKey("raw", patternBuffer, { name: "PBKDF2" }, false, ["deriveKey"]),
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt"]
    );

    const exportedLookupKey = await window.crypto.subtle.exportKey("raw", lookupKey);
    const lookupKeyHex = Array.from(new Uint8Array(exportedLookupKey)).map(b => b.toString(16).padStart(2, '0')).join('');

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

    const encryptionKey = await window.crypto.subtle.deriveKey(
        {
        name: "PBKDF2",
        salt: salt,
        iterations: 200000,
        hash: "SHA-256",
        },
        await window.crypto.subtle.importKey("raw", patternBuffer, { name: "PBKDF2" }, false, ["deriveKey"]),
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    const exportedEncryptionKey = await window.crypto.subtle.exportKey("raw", encryptionKey);
    const encryptionKeyHex = Array.from(new Uint8Array(exportedEncryptionKey)).map(b => b.toString(16).padStart(2, '0')).join('');

    return {
        lookupKey: lookupKeyHex,
        salt: saltHex,
        encryptionKey: encryptionKeyHex,
    };
}

async function storeData(setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, path: PathPoint[], setIsShaking: React.Dispatch<React.SetStateAction<boolean>>, setDataLoaded: React.Dispatch<React.SetStateAction<boolean>>, file: File | null) {
    setIsLoading(true);
    const textContainer = document.getElementById('userText')!
    const text = (textContainer as HTMLInputElement)!.value

    if (path.length < 6) {
        setIsShaking(true);
        setIsLoading(false);
        setTimeout(() => {
            setIsShaking(false);
        }, 3000)
    }

    const patternString: string = path.join('-');
    const keys = await generateKeys(patternString);

    const encryptedData = await encryptText(text, keys.encryptionKey);

    const payload = {
        lookupKey: keys.lookupKey,
        salt: keys.salt,
        iv: encryptedData.iv,
        ciphertext: encryptedData.ciphertext,
        fileCiphertext: "",
        fileIv: "",
        fileName: "",
    }

    if (file) {
        const d = await encryptFile(file, keys.encryptionKey);
        payload.fileCiphertext = d!.fileCiphertext;
        payload.fileIv = d!.fileIv;
        payload.fileName = d!.fileName
    }

    try {
        const response = await fetch('/api/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        
        if (response.ok) {
            setIsLoading(false);
            setDataLoaded(true);
            return true;
        } else {
            alert("Something went wrong");
            setIsLoading(false);
            return false;
        } 
    } catch (error) {
        alert("Something went wrong");
        setIsLoading(false);
        return false;
    }
}

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
};

export default function Store() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [path, setPath] = useState<PathPoint[]>([]);
    const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
    const [isShaking, setIsShaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [countdown, setCountdown] = useState(300);
    const [file, setFile] = useState<File | null>(null);
    const [fileButtonText, setFileButtonText] = useState('Upload document (max 500KB)')
    const [fileUploadIconStatus, setFileUploadIconStatus] = useState('block');

    useEffect(() => {
        let timerId: number | undefined;

        if (dataLoaded) {

            setInterval(() => {
                setCountdown(prevCountdown => {
                    if (prevCountdown <= 1) {
                        clearInterval(timerId!);
                        return 0;
                    }
                    timerId = prevCountdown - 1;
                    return (prevCountdown - 1);
                });
            }, 1000);
        }

        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    }, [dataLoaded]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target!.files?.[0];

        if (!file) {
            return;
        }

        setFileButtonText(file.name);
        setFile(file);
        setFileUploadIconStatus('hidden')
    }

    return (
        <div className="w-full h-full overflow-y-auto flex flex-row md:justify-center p-[20px] md:bg-[#131313]">
            <div className="bg-[#0a0a0a] h-min flex flex-col justify-start w-full max-w-[400px] min-w-[260px] h-full p-[20px] md:border md:rounded-md md:border-[#4f4f4f]">
                <p className="text-2xl font-semibold">Draw Pattern</p>
                <div className="w-[20px] h-[20px]"></div>
                <PatternGrid isDrawing = {isDrawing} setIsDrawing={setIsDrawing} path={path} setPath={setPath} endPoint={endPoint} setEndPoint={setEndPoint} setIsShaking = {setIsShaking}/>
                <div className="w-[20px] h-[10px]"></div>
                <button className="w-[150px] bg-neutral-800 text-white font-medium text-base rounded-lg px-4 py-2 transition-colors hover:bg-neutral-700" onClick={() => clearGrid(setPath)}>
                    Clear Pattern
                </button>
                <div className="w-[20px] h-[20px]"></div>
                <p className="text-sm font-normal tracking-[0.00rem] text-[#8a8a8a]">This pattern is used to create the encryption key</p>
                <div className="w-[20px] h-[5px]"></div>
                <p className={`text-sm font-normal tracking-[0.00rem] text-[#8a8a8a] ${isShaking ? 'shake' : ''}`} id="infoText">Please connect atleast 6 dots</p>

                <div className="w-[20px] h-[20px]"></div>
                {!dataLoaded ? <div className="w-full" id="uploadDataSection">
                    <textarea
                        className="bg-neutral-800 text-[#f2f2f2] placeholder-[#c1c1c1] rounded-lg p-[10px] w-full h-[150px] focus:outline-none focus:ring-1 focus:ring-[#4f4f4f] resize-none"
                        placeholder="Enter text (max 1024 characters)"
                        id="userText"
                    ></textarea>
                    <div className="w-[20px] h-[20px]"></div>
                    <label 
                    htmlFor="file-upload" 
                    className="flex items-center justify-between bg-neutral-800 text-[#c1c1c1] rounded-lg px-6 py-4 w-full transition-colors cursor-pointer hover:bg-neutral-700"
                    >
                    <span>{fileButtonText}</span>

                    <img 
                        src="/upload.svg" 
                        alt="Upload Icon" 
                        className={`w-6 h-6 ml-4 ${fileUploadIconStatus}`}
                    />
                    
                    <input 
                        id="file-upload" 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                    />
                    </label>

                    <div className="w-[20px] h-[20px]"></div>

                    <button className="w-full bg-[#f2f2f2] text-[#0a0a0a] text-lg font-medium rounded-lg px-6 py-3 transition-colors cursor-pointer hover:bg-neutral-900 hover:text-white flex justify-center items-center" onClick={() => storeData(setIsLoading, path, setIsShaking, setDataLoaded, file)}>
                    {
                        isLoading ? 
                        <div className="w-6 h-6 rounded-full border-4 border-t-transparent border-gray-300 animate-spin"></div>
                        : "Store"
                    }
                    </button>
                </div> :
                <div className="flex flex-col items-center p-8 rounded-xl bg-neutral-900 shadow-lg border border-neutral-800 text-center animate-fadeIn">
                    <div className="w-full flex justify-center mb-2">
                        <img 
                        className='w-1/3 min-w-[150px]' 
                        src="/capy2.png" 
                        alt="Capybara" 
                        />
                    </div>

                    <p className="text-xl text-white font-semibold">
                        Your data has been uploaded
                    </p>
                    
                    <p className="text-base text-gray-400 font-normal">
                        It will be available for:
                    </p>

                    <p className="text-4xl font-bold tracking-tight text-[#4e00bf] animate-pulse">
                        {formatTime(countdown)}
                    </p>
                    </div>}
            </div>
        </div>
    );
}