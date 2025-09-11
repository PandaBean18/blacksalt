import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import admin from 'firebase-admin';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const { lookupKey } = payload;

        // 1. Validate the payload
        if (!lookupKey) {
            return new NextResponse(JSON.stringify({ error: 'Missing lookupKey in request body' }), { status: 400 });
        }
        
        // 2. Search for the document in Firestore
        const docRef = db.collection('encrypted_data').doc(lookupKey);
        const docSnapshot = await docRef.get();

        // 3. Check if the document exists
        if (!docSnapshot.exists) {
            // Return 404 to avoid giving information on keys that don't exist
            return new NextResponse(JSON.stringify({ error: 'Data not found' }), { status: 404 });
        }

        const data = docSnapshot.data();
        
        // 4. Validate the document's age
        const createdAt = data?.createdAt as admin.firestore.Timestamp;
        const now = admin.firestore.Timestamp.now();
        const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

        if (now.toMillis() - createdAt.toMillis() > FIVE_MINUTES_IN_MS) {
            // Delete the expired document
            await docRef.delete();
            // Return 404 to indicate the data is no longer available
            return new NextResponse(JSON.stringify({ error: 'Data not found' }), { status: 404 });
        }

        // 5. If valid, return the data
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