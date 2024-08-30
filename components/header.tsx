import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Header() {
    const [showDropdown, setShowDropdown] = useState(false)
    const [showMobileNav, setShowMobileNav] = useState(false)
    const router = useRouter()
    const session = useSession()
    const logout = () => {
        setShowDropdown(false)
        signOut({ redirect: false }).then(() => {
            router.push("/");
        });
    }
    return (
        <nav className="bg-gray-800">
            <div className="mx-auto px-2 sm:px-6">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false" onClick={() => setShowMobileNav(!showMobileNav)}>
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>

                            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>

                            <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="hidden sm:flex gap-4">
                            <div className="flex space-x-4">
                                <Link href="/education" className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-black">Education</Link>
                            </div>
                            <div className="flex space-x-4">
                                <Link href="/experience" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">Experience</Link>
                            </div>
                            <div className="flex space-x-4">
                                <Link href="/resume" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">Resume</Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <div className="relative ml-3">
                            <div>
                                <button type="button" className="relative flex rounded-full bg-gray-800 text-sm" id="user-menu-button" aria-expanded="false" aria-haspopup="true" onClick={() => setShowDropdown(!showDropdown)}>
                                    <span className="absolute -inset-1.5"></span>
                                    <span className="sr-only">Open user menu</span>
                                    <span className="text-white">Hi {session?.data?.user?.name}</span>
                                </button>
                            </div>
                            <div className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${showDropdown ? '' : 'hidden'}`} role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                                <a href="#" onClick={logout} className="block px-4 py-2 text-sm text-gray-700" role="menuitem" id="user-menu-item-2">Sign out</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${showMobileNav ? 'sm:hidden' : 'hidden'}`} id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    <Link href="/educatiopn" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Education</Link>
                    <Link href="/experience" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Experience</Link>
                    <Link href="/resume" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Resume</Link>
                </div>
            </div>
        </nav>
    )
}