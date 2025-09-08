import React, { useState, useRef, useEffect } from "react";
import { MessageBubble } from "../ChatSmart/MessageBubble";
import { ChatInput } from "../ChatSmart/ChatInput";
import { FloatingDialog } from "../shared";
import axiosInstance from "../../utils/axiosInstance";
import { useUserStore } from "../../store/userStore";
import { useUIStore } from "../../store/uiStore";

export function FloatingAskAIBOX({ isOpen, onClose }) {
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
    <FloatingDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Ask AI"
      size="md"
      className="min-w-[350px] max-w-[400px] w-[90vw]"
    >
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
    </FloatingDialog>
  );
}
