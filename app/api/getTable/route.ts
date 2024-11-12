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

  try {
    const tablelist = await prisma.table.findMany({
      where: {
        userId: userId, 
      },
    });

    return NextResponse.json(tablelist);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trade data' }, { status: 500 });
  }
}