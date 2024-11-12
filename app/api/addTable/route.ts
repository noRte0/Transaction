import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';  // Import getToken from next-auth/jwt
import { NextRequest } from 'next/server'; // Import NextRequest from next/server

const prisma = new PrismaClient();

export async function POST(request: NextRequest) { // Use 'NextRequest' here
  try {
    
    // Extract the token from the request headers (Authorization: Bearer token)
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    console.log('Raw Token:', token);

    // Check if the token exists and has the 'userId' field
    if (!token || typeof token.userId !== 'string') {
        return NextResponse.json({ message: 'Unauthorized: Missing userId' }, { status: 401 });
    }  

    const userId = token.userId; // Now token.userId is available and properly typed

    // Parse the request body to get the transaction name
    const body = await request.json();
    const { transactionName } = body;

    // Validate input
    if (!transactionName) {
      return NextResponse.json({ error: 'Transaction name is required' }, { status: 400 });
    }

    // Save the new table entry to the database
    const newTable = await prisma.table.create({
      data: {
        name: transactionName,
        userId: userId, // Correctly typed 'userId' as a string
      },
    });

    return NextResponse.json(newTable, { status: 201 });
  } catch (error) {
    console.error('Error creating table:', error);
    return NextResponse.json({ error: 'An error occurred while creating the table' }, { status: 500 });
  }
}
