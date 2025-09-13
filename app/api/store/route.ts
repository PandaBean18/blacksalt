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
        const { lookupKey, salt, iv, ciphertext, fileCiphertext, fileIv, fileName } = payload;
        
        if (!lookupKey || !salt || !iv || !ciphertext) {
            return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }
        
        await db.collection('encrypted_data').doc(lookupKey).set({
            salt: salt,
            iv: iv,
            ciphertext: ciphertext,
            fileCiphertext: fileCiphertext, 
            fileIv: fileIv,
            fileName: fileName,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return new NextResponse(JSON.stringify({ success: true, message: 'Data stored successfully' }), { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}