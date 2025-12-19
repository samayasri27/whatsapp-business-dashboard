import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/contacts', {
      headers: {
        'Authorization': 'Bearer debug_token'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ contacts: [], total: 0 }, { status: 500 });
  }
}