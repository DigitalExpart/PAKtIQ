import { useState, useEffect } from 'react';
import { Sparkles, Quote } from 'lucide-react';

export function MotivationalQuote() {
  const [quote, setQuote] = useState({ text: '', author: '' });

  const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "Dream bigger. Do bigger.", author: "Unknown" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
    { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
    { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
    { text: "Little things make big days.", author: "Unknown" },
    { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
    { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
    { text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Unknown" },
    { text: "The key to success is to focus on goals, not obstacles.", author: "Unknown" }
  ];

  useEffect(() => {
    // Set a random quote on mount
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    // Change quote daily
    const lastQuoteDate = localStorage.getItem('lastQuoteDate');
    const today = new Date().toDateString();
    
    if (lastQuoteDate !== today) {
      const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(newQuote);
      localStorage.setItem('lastQuoteDate', today);
    }
  }, []);

  return (
    <div className="relative group">
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
      
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-6 text-white shadow-xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
        
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
              <Quote className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-xs opacity-90 tracking-wide uppercase">Daily Motivation</span>
              </div>
              <p className="text-sm leading-relaxed mb-3 italic">&ldquo;{quote.text}&rdquo;</p>
              <p className="text-xs opacity-90">— {quote.author}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
