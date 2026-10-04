import React from 'react'
import { Button } from './ui/button'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import clsx from 'clsx'

function Themer({className} : {className?: string}) {
    const {resolvedTheme, setTheme} = useTheme()  
      
    return (
        <Button
            className={clsx("", resolvedTheme === 'light' ? 'text-black' : "text-white bg-primary/40 border-transparent hover:border-primary", className)} 
            onClick={() => setTheme(resolvedTheme === 'light' ? 'dark': 'light')}>
            {resolvedTheme === 'light' ? <Moon /> : <Sun />}
        </Button>
    )
}

export default Themer