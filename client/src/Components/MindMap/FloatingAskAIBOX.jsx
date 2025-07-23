import React, { useState, useRef, useEffect } from "react";
import { MessageBubble } from "../MessageBubble";
import { ChatInput } from "../ChatInput";
import axiosInstance from "../../utils/axiosInstance";
import { useUserStore } from "../../store/userStore";
import { useUIStore } from "../../store/uiStore";

export function FloatingAskAIBOX({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "How can I help you with this mind map?" },
  ]);
  const chatAreaRef = useRef();
  const noteId = useUIStore((s) => s.selectedNoteId);
  const { token } = useUserStore();
  const mindmap = useUIStore((s) => s.mindMapData);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      if (!noteId || noteId === "null") {
        console.warn("❌ No noteId selected");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ No note is selected. Please open a note first.",
          },
        ]);
        return;
      }

      if (!mindmap || !mindmap.nodes || !mindmap.edges) {
        console.warn("⚠️ Mind map not loaded yet:", mindmap);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ Mind map is still loading or unavailable.",
          },
        ]);
        return;
      }

      console.log("📤 Sending to /api/askai:", {
        text,
        noteId,
        nodes: mindmap.nodes,
        edges: mindmap.edges,
      });

      const res = await axiosInstance.post(`/askai/${noteId}`, {
        prompt: text,
        nodes: mindmap.nodes,
        edges: mindmap.edges,
      });

      console.log("✅ Full AI response data:", res.data);

      const { type, message, nodes, edges } = res.data;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: message },
      ]);

      console.log("🤖 Parsed AI type:", type);
      console.log("📨 AI message:", message);
      console.log("🧠 AI nodes update:", nodes);
      console.log("🔗 AI edges update:", edges);

      if (type === "update" && nodes && edges) {
        const current = useUIStore.getState().mindMapData || {
          nodes: [],
          edges: [],
        };

        console.log("🧠 Current mind map (before update):", current.nodes);

        // Replace updated nodes
        const updatedNodes = current.nodes.map((node) => {
          const changed = nodes.find((n) => n.id === node.id);
          return changed ? { ...node, ...changed } : node;
        });

        // Add new nodes
        const newNodes = nodes.filter(
          (n) => !current.nodes.some((cn) => cn.id === n.id)
        );

        const finalNodes = [...updatedNodes, ...newNodes];

        // Merge new edges (only add new ones)
        const mergedEdges = [
          ...current.edges,
          ...edges.filter((e) => !current.edges.some((ce) => ce.id === e.id)),
        ];

        console.log("🧠 Final nodes after merge:", finalNodes);
        console.log("🔗 Final edges after merge:", mergedEdges);

        // Update the store
        useUIStore.getState().setMindMapData({
          nodes: finalNodes,
          edges: mergedEdges,
        });

        // Log post-update state
        console.log("✅ mindMapData set in Zustand!");
      }
    } catch (err) {
      console.error("❌ Error in handleSend:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Something went wrong." },
      ]);
    }
  };

  return (
    <div
      className="fixed z-[100] top-1/2 left-1/2"
      style={{
        transform: "translate(-50%, -50%)",
        minWidth: 350,
        maxWidth: 400,
        width: "90vw",
        borderRadius: 28,
        background: "rgba(24,32,54,0.97)",
        boxShadow: "0 8px 40px 0 rgba(0,0,0,0.18)",
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <h2 className="text-xl font-semibold text-white">Ask AI</h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white text-2xl font-bold"
          style={{ lineHeight: 1 }}
        >
          ×
        </button>
      </div>

      <div
        ref={chatAreaRef}
        className="flex-1 px-6 py-2 overflow-y-auto custom-scrollbar"
        style={{
          minHeight: 220,
          maxHeight: 320,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
      </div>

      <div className="px-6 py-4 bg-white/5 border-t border-white/10">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
