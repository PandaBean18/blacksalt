import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import admin from 'firebase-admin';
import { rateLimit } from '@/lib/ratelimiter';

export async function POST(request: Request) {
    const clientIp = request.headers.get('x-forwarded-for') as string;

    if (!clientIp) {
        return new NextResponse(JSON.stringify({ error: 'Unable to determine IP address' }), { status: 400 });
    }

    if (clientIp) {
        const isAllowed = await rateLimit(clientIp);
        if (!isAllowed) {
            return new NextResponse(JSON.stringify({ error: 'Too many requests. Please try again later.' }), { status: 429 });
        }
    }

    try {
        const payload = await request.json();
        const { lookupKey, uniqueNumber } = payload;
        

        if (!lookupKey) {
            return new NextResponse(JSON.stringify({ error: 'Missing lookupKey in request body' }), { status: 400 });
        }

        if (!uniqueNumber || uniqueNumber.length < 3) {
            return new NextResponse(JSON.stringify({ error: 'Missing or invalid unique code' }), { status: 400 });
        }
        
        const querySnapshot = await db.collection('encrypted_data')
                .where('lookupKey', '==', lookupKey)
                .where('uniqueNumber', '==', Number(uniqueNumber))
                .limit(1)
                .get();

        if (querySnapshot.empty) {
            return new NextResponse(JSON.stringify({ error: 'Data not found' }), { status: 404 });
        }

        const docRef = querySnapshot.docs[0].ref
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
            fileCiphertext: data?.fileCiphertext,
            fileIv: data?.fileIv, 
            fileName: data?.fileName
        }), { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}