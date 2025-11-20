import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { message: 'PM is working!' },
    { status: 200 },
  );
}
