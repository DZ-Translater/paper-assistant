import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt, message, temperature, password } = await request.json();

        // 验证密码
        if (password !== process.env.ACCESS_PASSWORD) {
            return NextResponse.json(
                { error: '未授权访问' },
                { status: 401 }
            );
        }

        const response = await fetch(`${process.env.OPENAI_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || "claude-3-5-sonnet-20241022",
                temperature: temperature,
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: message }
                ],
            }),
        });

        if (!response.ok) {
            throw new Error('OpenAI API 请求失败');
        }

        const data = await response.json();

        return NextResponse.json({ result: data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: '处理请求时发生错误' },
            { status: 500 }
        );
    }
} 