'use client'
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          message,
          temperature,
        }),
      });

      if (!response.ok) {
        throw new Error('API 请求失败');
      }

      const data = await response.json();
      setOutput(data.result);
    } catch (error) {
      console.error('Error:', error);
      setOutput("发生错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI 论文助手</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">提示词</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：请帮我写一篇关于人工智能的论文，要求学术性强..."
          />
        </div>

        <div>
          <label className="block mb-2">具体内容</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="在这里输入更详细的要求或者论文大纲..."
          />
        </div>

        <div>
          <label className="block mb-2">
            Temperature: {temperature}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-500 mt-1">
            较低的值会产生更确定的输出，较高的值会产生更有创意的输出
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "生成中..." : "生成论文"}
        </button>
      </form>

      {output && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">输出结果：</h2>
          <div className="p-4 border rounded-md whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
