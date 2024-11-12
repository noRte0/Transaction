import React from 'react'
import { signOut } from 'next-auth/react'

const Logout = () => {
  // ฟังก์ชัน logout
  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); // หลัง logout จะ redirect ไปที่หน้าโฮม
  }

  return (
    <div>
        <button onClick={handleLogout} type='button' className='py-2.5 px-6 text-sm bg-red-500 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-red-700'>Logout</button>
    </div>
  )
}

export default Logout
