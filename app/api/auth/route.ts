import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        if (password === process.env.ACCESS_PASSWORD) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: '密码错误' },
                { status: 401 }
            );
        }
    } catch {
        return NextResponse.json(
            { error: '验证失败' },
            { status: 500 }
        );
    }
} 