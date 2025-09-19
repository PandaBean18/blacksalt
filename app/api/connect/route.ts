// import Ably from 'ably'
// import { NextResponse } from 'next/server';

// const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });

// export async function GET(request: Request) {
//     const tokenRequest = await ably.auth.createTokenRequest({ clientId: 'your-client-id' });
//     console.log(tokenRequest);

//     return new NextResponse(JSON.stringify({ error: 'lol' }), { status: 200 });
// }