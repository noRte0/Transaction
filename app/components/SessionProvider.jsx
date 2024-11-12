'use client'
import { SessionProvider } from 'next-auth/react'
export default SessionProvider

// เมื่อ SessionProvider อยู่ใน layout component:

// Context API: SessionProvider ใช้ Context API ของ React เพื่อให้ข้อมูล session ถูกส่งผ่านไปยังทุกคอมโพเนนต์ลูกที่ต้องการใช้ session ข้อมูลนี้จะคงอยู่ในทุกๆ หน้าโดยไม่ต้องส่งผ่าน props ให้ยุ่งยาก
// ใช้ Hook ได้สะดวก: เมื่อเราใช้ SessionProvider รอบๆ คอมโพเนนต์ทั้งหมด การเรียก useSession() จาก next-auth/react ในทุกหน้าจะทำงานได้ทันทีและมีข้อมูล session ของผู้ใช้ เช่น user หรือ status อยู่พร้อมใช้งานเสมอ
// รองรับการทำงานแบบ Client-side: เพราะวาง SessionProvider ไว้ในคอมโพเนนต์ฝั่งไคลเอนต์ ('use client') และใน layout ของ Next.js การเข้าถึง session ฝั่งไคลเอนต์ในทุกๆ หน้า (ที่ใช้ Client Rendering) จะทำงานได้โดยไม่ต้องทำการตั้งค่าพิเศษเพิ่มเติม
// สรุป
// การใช้ SessionProvider ห่อใน layout ของ Next.js ทำให้การจัดการข้อมูลผู้ใช้เป็นเรื่องง่าย และการใช้ 'use client' เพื่อรันบนฝั่งไคลเอนต์นั้นช่วยให้สามารถเข้าถึงข้อมูล session ได้โดยสมบูรณ์ในทุกๆ หน้า