import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';  
import { NextRequest } from 'next/server'; 

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  console.log('Start add transaction');
  try {
    if (request.headers.get('Content-Type') !== 'application/json') {
      return new Response(JSON.stringify({ message: 'Content-Type must be application/json.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rawBody = await request.json();
    const { amount, type, note, imageUrl, tableId } = rawBody;

    const token = await getToken({ req:request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || typeof token.userId !== 'string') {
      return NextResponse.json({ message: 'Unauthorized: Missing userId' }, { status: 401 });
    }

    const userId = token.userId;

    // Check if required fields are present
    if (!amount || !type || !tableId) {
      return new Response(JSON.stringify({ message: 'Required fields are missing.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        note: note || '-',
        attachmentUrl: imageUrl || '-', // Handle as optional
        tableId: tableId,
        userId: userId,
        category: type,
        date: new Date(),
      },
    });

    return new Response(JSON.stringify({ message: 'Transaction added successfully', transaction: newTransaction }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}
