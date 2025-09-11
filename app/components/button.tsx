import React from "react";

export default function Button({ url, text, dark = false }: {url: string, text: string, dark?: boolean}) {
    const darkClasses = "rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-base h-12 px-4 sm:px-5 w-[158px] md:w-[158px]"
    const lightClasses = "bg-[#ededed] text-[#0a0a0a] rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center hover:bg-[#dddddd] hover:border-transparent font-medium text-base h-12 px-4 sm:px-5 w-[158px] md:w-[158px]";
    
    return (
        <a className = {dark ? darkClasses : lightClasses}
        href={url} >{text}</a>
    );
}