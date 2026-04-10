"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import kalbeLogo from "@/public/images/kalbe-logo.png"
import userIcon from "@/public/images/user-icon.png"
import Link from "next/link"

type Props = {
    role: "administrator" | "operator"
}

const menuItems = [
    {
        label: "PREDICTION MODEL",
        path: "/dashboard",
        roles: ["administrator", "operator"],
    },
    {
        label: "FILE MANAGEMENT",
        path: "/dashboard/fileManagement",
        roles: ["administrator", "operator"],
    },
    {
        label: "USER MANAGEMENT",
        path: "/dashboard/userManagement",
        roles: ["administrator"],
    },
    {
        label: "LOG ACTIVITY",
        path: "/dashboard/logActivity",
        roles: ["administrator"],
    },
]

export default function DashboardHeader({role}: Props) {
    const [username, setUsername] = useState("")
    const [menu, setMenu] = useState(false)

    const pathname = usePathname()

    const getClass = (path: string) => {
        return pathname === path ? "text-green-700" : "text-gray-500 hover:text-green-700"
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if(token) {
            try{
                const payload = JSON.parse(atob(token.split(".")[1]))
                setUsername(payload.username)
            } catch (err) {
                console.log("Invalid token")
            }
        }
    }, [])
    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.href = "/login"
    }
    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white">
            {/* LOGO + MENU */}
            <div className="flex items-center gap-6">
                <img src={kalbeLogo.src} alt="kalbe-logo" className="h-10 w-auto object-contain" />
                <div className="flex gap-6 text-sm font-medium">
                    {menuItems
                        .filter(item => item.roles.includes(role))
                        .map(item => (
                            <Link key={item.path} href={item.path}>
                                <span className={`${getClass(item.path)} cursor-pointer`}>
                                    {item.label}
                                </span>
                            </Link>
                        ))
                    }
                </div>
            </div>

            {/* USER */}
            <div className="relative flex items-center gap-2 cursor-pointer" onMouseEnter={() => setMenu(true)} onMouseLeave={() => setMenu(false)}>
                <img src={userIcon.src} alt="user" className="w-10 h-10 rounded-full" />
                <span className="text-sm font-medium">{username}</span>

                {menu && (
                    <div className="absolute right-0 top-full w-36 bg-white shadow-md rounded-md border z-50">
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500">Logout</button>
                    </div>
                )}
            </div>
        </div>
    )
}