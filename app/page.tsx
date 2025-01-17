'use client'
import { useState, useEffect } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (prompt === "" && message === "") {
      setOutput("请输入提示词和具体内容");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        alert('密码错误');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('验证失败');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6">
        <h1 className="text-2xl font-bold mb-6">访问验证</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2">请输入访问密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            验证
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI 论文助手</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          退出登录
        </button>
      </div>

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
