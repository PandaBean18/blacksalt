import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import admin from 'firebase-admin';


export async function GET(request: Request) {    
    try {
        const FIVE_MINUTES_AGO = new Date();
        FIVE_MINUTES_AGO.setMinutes(FIVE_MINUTES_AGO.getMinutes() - 5);

        const querySnapshot = await db.collection('encrypted_data')
            .where('createdAt', '<', admin.firestore.Timestamp.fromDate(FIVE_MINUTES_AGO))
            .get();

        
        const batch = db.batch();
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        const deletedCount = querySnapshot.size;
        console.log(`Cron job: Successfully deleted ${deletedCount} expired records.`);
        
        return new NextResponse(JSON.stringify({
            success: true,
            message: `Deleted ${deletedCount} records.`,
        }), { status: 200 });

    } catch (error) {
        console.error('Cron job failed:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}