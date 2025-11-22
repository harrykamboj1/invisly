'use client'
import { useCallback, useRef } from "react";

export function useDebounce(callback:()=>void,delay:number) {
    const timeout = useRef<NodeJS.Timeout | null>(null);
    return useCallback(()=>{
        if(timeout.current){
            clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(callback,delay)
    },[callback,delay]);
}