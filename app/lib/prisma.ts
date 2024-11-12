// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// สร้าง Prisma Client
const prisma = new PrismaClient();

// ส่งออก prisma instance ให้ใช้งานในส่วนอื่นๆ
export default prisma;
