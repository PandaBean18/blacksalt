"use client"

import React, { useState, useRef, useEffect } from "react";

type Point = {
    x: number;
    y: number;
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
        transformOrigin: '0 0', // Set the rotation origin to the start point
        backgroundColor: 'white',
        height: '2px', // The thickness of the line
        zIndex: 10 // Make sure the line is on top of other elements
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

    const setDotRef = (el: HTMLDivElement, id: number) => {
      if (el) {
        allDotRefs.current[id - 1] = el;
      }
    };

    const handleMouseDown = (e: React.PointerEvent<HTMLDivElement>, dotRef: React.RefObject<HTMLDivElement | null>) => {
        setIsDrawing(true);
        // We now get the ref directly from the child
        const rect = dotRef.current!.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        const newPath = [{ x: startX, y: startY, id: parseInt(dotRef.current!.id) }];
        setPath(newPath);
        setEndPoint({ x: startX, y: startY });
    };

    useEffect(() => {
        const handleMouseMove = (e: PointerEvent) => {
            if (isDrawing) {
                setEndPoint({ x: e.clientX, y: e.clientY });

                // Get the ID of the last dot in the path
                const lastDotId = path.length > 0 ? path[path.length - 1].id : null;
                // Check for snapping to other dots
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
                        setPath(prevPath => [...prevPath, { x: dotCenterX, y: dotCenterY, id: dotId }]);
                        setEndPoint({ x: dotCenterX, y: dotCenterY });
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

                console.log("Final path:", path.map(p => p.id).join('-'));
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
        <div className="h-[220px] w-[220px] grid grid-cols-4 grid-rows-4 border rounded-md border-[#400] touch-none">
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

async function generateLookupKey(patternString: string) {
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

    return lookupKeyHex;
}

async function generateDecryptionKey(patternString: string, salt: string) {
    const patternBuffer = new TextEncoder().encode(patternString);
    const saltBuffer = hexToBuffer(salt);

    const decryptionKey = await window.crypto.subtle.deriveKey(
        {
        name: "PBKDF2",
        salt: saltBuffer,
        iterations: 200000,
        hash: "SHA-256",
        },
        await window.crypto.subtle.importKey("raw", patternBuffer, { name: "PBKDF2" }, false, ["deriveKey"]),
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    const exportedDecryptionKey = await window.crypto.subtle.exportKey("raw", decryptionKey);
    const decryptionKeyHex = Array.from(new Uint8Array(exportedDecryptionKey)).map(b => b.toString(16).padStart(2, '0')).join('');

    return decryptionKeyHex;
}

function hexToBuffer(hexString: string) {
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }
    return bytes.buffer;
}

async function decryptText(ciphertextHex: string, ivHex: string, keyHex: string) {
    const ciphertextBuffer = hexToBuffer(ciphertextHex);
    const ivBuffer = hexToBuffer(ivHex);
    const keyBuffer = hexToBuffer(keyHex);
    
    
    const importedKey = await window.crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
    );
    
    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
        name: "AES-GCM",
        iv: ivBuffer,
        },
        importedKey,
        ciphertextBuffer
    );

    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    
    return decryptedText;
}

async function retrieveData(path: PathPoint[], setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, setDataLoaded: React.Dispatch<React.SetStateAction<boolean>>, setTextData: React.Dispatch<React.SetStateAction<string>>) {
    setIsLoading(true);
    const patternString = path.join('-');
    const lookupKey = await generateLookupKey(patternString)

    const payload = {
        lookupKey: lookupKey,
    }

    let respJson = null;

    try {
        const response = await fetch('/api/receive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        
        if (response.ok) {
            respJson = await response.json();
            
        } else {
            alert("Something went wrong");
            console.log(1);
            setIsLoading(false);
            return false;
        } 
    } catch (error) {
        alert("Something went wrong");
        console.log(error);
        setIsLoading(false);
        return false;
    }

    const salt = respJson!.salt;
    const ciphertext = respJson!.ciphertext;
    const iv = respJson!.iv;

    const decryptionKey = await generateDecryptionKey(patternString, salt);
    const plaintext = await decryptText(ciphertext, iv, decryptionKey);    
    setIsLoading(false);
    setDataLoaded(true);
    setTextData(plaintext);
    return true;

}

export default function Store() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [path, setPath] = useState<PathPoint[]>([]);
    const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
    const [isShaking, setIsShaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoaded, setDataLoaded] = useState(false);
    const [textData, setTextData] = useState("")
    const [copyButtonData, setCopyButtonData] = useState("Copy");

    return (
        <div className="w-full h-full flex flex-row md:justify-center p-[20px] md:bg-[#131313]">
            <div className="bg-[#0a0a0a] flex flex-col justify-start w-full max-w-[400px] min-w-[260px] h-full p-[20px] md:border md:rounded-md md:border-[#4f4f4f]">
                <p className="text-2xl font-semibold">Draw Pattern</p>
                <div className="w-[20px] h-[20px]"></div>
                <PatternGrid isDrawing = {isDrawing} setIsDrawing={setIsDrawing} path={path} setPath={setPath} endPoint={endPoint} setEndPoint={setEndPoint} setIsShaking = {setIsShaking}/>
                <div className="w-[20px] h-[10px]"></div>
                <button className="w-[150px] bg-neutral-800 text-white font-medium text-base rounded-lg px-4 py-2 transition-colors hover:bg-neutral-700" onClick={() => clearGrid(setPath)}>
                    Clear Pattern
                </button>
                <div className="w-[20px] h-[20px]"></div>
                <p className="text-sm font-normal tracking-[0.00rem] text-[#8a8a8a]">Please use the same pattern you used to store the files</p>
                <div className="w-[20px] h-[5px]"></div>
                <p className={`text-sm font-normal tracking-[0.00rem] text-[#8a8a8a] ${isShaking ? "shake" : ""}`} id="infoText">Pattern must connect atleast 6 dots</p>
                <div className="w-[20px] h-[5px]"></div>
                <p className="text-sm font-normal tracking-[0.00rem] text-[#8a8a8a]">Files only live for 5 minutes</p>
                <div className="w-[20px] h-[20px]"></div>
                <button className="bg-[#f2f2f2] text-[#0a0a0a] text-lg font-medium rounded-lg px-6 py-3 transition-colors cursor-pointer hover:bg-neutral-900 hover:text-white flex justify-center items-center" onClick={()=>retrieveData(path, setIsLoading, setDataLoaded, setTextData)}>
                {
                    isLoading ? 
                    <div className="w-6 h-6 rounded-full border-4 border-t-transparent border-gray-300 animate-spin"></div>
                    : "Fetch"
                }
                </button>
                <div className="h-[50px] w-[50px]"></div>
                { !isDataLoaded ? <div className="w-full h-[175px] flex flex-row justify-around items-center">
                        <img src="/capy.png" alt="capy" className="w-1/2" />
                        <p className="text-[#8a8a8a] tracking-[0.00rem] font-normal">Your data will show up here</p>
                    </div> :
                    <div className="w-full h-[150px] bg-neutral-800 rounded-lg flex flex-col justify-start">
                        <div className="w-full h-[30px] p-[5px] pr-[10px] pb-0 flex flex-row justify-end items-center">
                            <button className="hover:cursor-pointer text-[#c1c1c1]" onClick={() => {navigator.clipboard.writeText(textData); setCopyButtonData("Copied!")}}>{copyButtonData}</button>
                        </div>
                        <div className="w-full h-[120px] p-[10px] pt-0 overflow-y-auto text-wrap">
                            <p className="tracking-[0.00rem] text-[#f2f2f2] font-normal" id="dataTextField">{textData}</p>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}