"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CreateTable from "./createTable";
import Logout from "./logout";
import Transactionlist from "./transactionlist";

const LeftSidebar: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="relative">
      {/* Sidebar container */}
      <div
        className={`fixed top-0 left-0 h-screen transition-transform duration-300 ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-64"
        } w-64 border-r-2 border-transparent bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500`}
      >
        <section className="h-full bg-gray-800 text-white">
          <nav className="flex flex-col h-full">
            {/* Icon */}
            <div className="flex items-center justify-center pt-7">
              <Link href="/" className="mb-7 cursor-pointer flex items-center gap-3">
                <Image
                  src="/icons/saving-money.svg"
                  width={56}
                  height={56}
                  alt="Piggy"
                  className="size-[56px] max-xl:size-14"
                />
                <h1 className="text-xl font-bold">Transaction</h1>
              </Link>
            </div>

            {/* Menu */}
            <div className="font-semibold ml-4 text-sm">Add transaction</div>

            <div className="mb-5 ml-6 mr-6 mt-3">
              <CreateTable name="Enter your transaction" />
            </div>

            <div className="font-semibold ml-4 text-sm">Your transaction</div>
            <div className="mb-5 ml-6 mr-6 mt-3">
              <Transactionlist />
            </div>

            <div className="absolute inset-x-0 bottom-0 mb-5 ml-6 mr-6 mt-3">
              <Logout />
            </div>
          </nav>
        </section>
      </div>

      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-1/2 transform -translate-y-1/2 w-7 h-14 rounded-r-xl bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 text-white font-semibold ${
          isSidebarVisible ? "left-64" : "left-0"
        } transition-all duration-300`}
      >
        {isSidebarVisible ? "◀" : "▶"}
      </button>
    </div>
  );
};

export default LeftSidebar;
