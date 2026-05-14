/**
 * AI Service for Kadhi Tari
 * Mocking AI responses for now. In a real app, this would call 
 * an LLM (like Gemini) via a cloud function or backend.
 */

export const AIService = {
  generateCaption: async (prompt: string) => {
    // Simulating AI delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const vibes = [
      "Another cinematic moment in our little universe... 🌙",
      "Finding magic in the random nonsense. ✨",
      "Late night thoughts, lasting memories. 🌻",
      "Proof that we're the best at extending 2-minute calls. 😭"
    ];
    return vibes[Math.floor(Math.random() * vibes.length)];
  },

  summarizeVibe: async (data: any) => {
    // Simulating vibe summary
    return "Today felt peaceful with a hint of chaotic energy from those 50 reels you sent. 🌙";
  },

  generateMemoryCard: (content: string) => {
    return {
      title: "AI Generated Memory",
      description: `Reflecting on: ${content}`,
      date: new Date().toLocaleDateString(),
      icon: "Sparkles"
    };
  }
};
