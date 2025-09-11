import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import admin from 'firebase-admin';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const { lookupKey } = payload;

        if (!lookupKey) {
            return new NextResponse(JSON.stringify({ error: 'Missing lookupKey in request body' }), { status: 400 });
        }
        
        const docRef = db.collection('encrypted_data').doc(lookupKey);
        const docSnapshot = await docRef.get();

        if (!docSnapshot.exists) {
            return new NextResponse(JSON.stringify({ error: 'Data not found' }), { status: 404 });
        }

        const data = docSnapshot.data();
        
        const createdAt = data?.createdAt as admin.firestore.Timestamp;
        const now = admin.firestore.Timestamp.now();
        const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

        if (now.toMillis() - createdAt.toMillis() > FIVE_MINUTES_IN_MS) {
            await docRef.delete();
            return new NextResponse(JSON.stringify({ error: 'Data not found' }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({
            salt: data?.salt,
            iv: data?.iv,
            ciphertext: data?.ciphertext,
        }), { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}