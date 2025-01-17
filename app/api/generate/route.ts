import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt, message, temperature } = await request.json();

        const response = await fetch(`${process.env.OPENAI_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: prompt
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: temperature,
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