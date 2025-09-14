import React from "react";

export default function ErrorDiv({height = "150px", width = "360px", isError, buttonHandler, textContent}: {height?: string, width?: string, isError: boolean, buttonHandler: React.MouseEventHandler<HTMLButtonElement>, textContent: string}) {
    return (
        <div className="w-[100%] h-[100%] absolute top-0 z-100">
            <div className="absolute bg-[#222] w-full h-full opacity-50"></div>
            <div className={`absolute bg-[#0a0a0a] rounded-lg border border-[#3f3f3f] p-[20px] pt-[10px] pb-[15px] flex flex-col justify-between items-center`} style={{height: 'max-content', width: width, left: `calc(50% - calc(${width} / 2))`, top: `calc(50% - calc(${height} / 2))`}}>
                <p className="text-2xl font-semibold h-[24px]" style={{color: `${isError ? '#a80000' : '#ff8c00'}`}}>{isError ? "Error" : "Important"}</p>
                <p className="mt-[20px] text-lg font-medium text-[#c1c1c1]" >{textContent}</p>
                
                <button className="mt-[20px] w-full bg-[#f2f2f2] text-[#0a0a0a] text-lg font-medium rounded-lg px-6 py-1 transition-colors cursor-pointer hover:bg-neutral-900 hover:text-white flex justify-center items-center" onClick={buttonHandler}>Okay</button>
            </div>
        </div>
    );
}