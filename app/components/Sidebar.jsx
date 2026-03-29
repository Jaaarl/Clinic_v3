import React from 'react'
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';
export default function Sidebar() {
    return (
        <>
            <div className="w-[310px] bg-gray-800 h-100vh flex flex-col">
                <div className="p-4 text-white">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-gray-200 focus:bg-white focus:outline-none border border-gray-300 rounded-full py-2 px-4 pr-10 block w-full appearance-none leading-normal text-black text-[12px]"
                        />
                        <button className="absolute right-0 top-0 mt-2 mr-3">
                            <FaSearch className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>
                </div>
                <Link href={"/newPatient"}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                        New Patient
                    </button>
                </Link >
            </div>

        </>
    )
}
