// pages/api/transactiondata.ts หรือ app/api/transactiondata/route.ts (สำหรับ Next.js 13+)
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server'; 
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token || typeof token.userId !== 'string') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = token.userId;

  const url = new URL(request.url);
  const tableId = url.searchParams.get('tableId');

  if (!tableId) {
    return NextResponse.json({ message: 'tableId is required' }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ message: 'userId is required' }, { status: 400 });
  }
  try {
    // ตรวจสอบว่ามีข้อมูลตรงกับ userId และ tableId หรือไม่
    const transaction = await prisma.transaction.findMany({
      where: {
        userId: userId,
        tableId: tableId,  // ตรวจสอบว่า tableId ถูกต้อง
      },
    });
    console.log(transaction)

    if (!transaction) {
      console.log('No transaction found for tableId:', tableId);  // ตรวจสอบหากไม่มี transaction
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction details' }, { status: 500 });
  }
}
