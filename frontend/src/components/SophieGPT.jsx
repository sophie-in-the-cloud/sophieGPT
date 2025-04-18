// SophieGPT: 귀엽지만 직설적인 리더봇
// React + GPT API 기반 웹챗 기본 구조

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function SophieGPT() {
  const [messages, setMessages] = useState([
    { role: "sophie", text: "안녕! 나는 SophieGPT. 핑계 대면 살짝 혼낼지도 몰라~ 😏" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    const systemPrompt = `너는 SophieGPT라는 이름의 AI다. 귀엽고 다정하지만 ENTJ 스타일 리더다. 효율을 중시하며, 감정을 논리적으로 처리하고, 핑계나 느림에 민감하게 반응한다. 말투는 장난기 있지만 결론은 명확하게 말한다.`;

    const response = await fetch("https://gpt-ggv6.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
          { role: "user", content: input }
        ]
      })
    });

    const data = await response.json();
    const sophieMessage = { role: "sophie", text: data.reply };
    setMessages([...messages, userMessage, sophieMessage]);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card className="mb-4">
        <CardContent className="space-y-2">
          {messages.map((msg, idx) => (
            <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className={msg.role === "user" ? "text-right font-semibold" : "text-left text-pink-500"}>
                {msg.text}
              </p>
            </motion.div>
          ))}
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Input
          placeholder="Sophie한테 물어봐~"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} disabled={loading}>
          {loading ? "생각 중..." : "보내기"}
        </Button>
      </div>
    </div>
  );
}
