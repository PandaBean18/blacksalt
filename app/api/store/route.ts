import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import admin from 'firebase-admin';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const { lookupKey, salt, iv, ciphertext } = payload;
        
        if (!lookupKey || !salt || !iv || !ciphertext) {
            return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }
        
        await db.collection('encrypted_data').doc(lookupKey).set({
            salt: salt,
            iv: iv,
            ciphertext: ciphertext,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return new NextResponse(JSON.stringify({ success: true, message: 'Data stored successfully' }), { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}