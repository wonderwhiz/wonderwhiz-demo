
import React from 'react';
import { Star, Brain, Globe, Lightbulb, BookOpen } from 'lucide-react';

const HeroFeed = () => {
  return (
    <>
      {/* Header with profile and sparks */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-wonderwhiz-blue/20 flex items-center justify-center">
            <Star className="h-4 w-4 text-wonderwhiz-gold" />
          </div>
          <span className="ml-2 font-medium text-white text-sm">Alex's Feed</span>
        </div>
        <div className="flex items-center bg-wonderwhiz-gold/20 px-2 py-1 rounded-full">
          <Star className="h-3 w-3 text-wonderwhiz-gold mr-1" />
          <span className="text-xs font-medium text-wonderwhiz-gold">137 sparks</span>
        </div>
      </div>
      
      {/* Curios Feed Title */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold mb-2">Today's Curios</h3>
        
        {/* Categories Filter */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
          <div className="bg-wonderwhiz-blue/30 text-white text-xs px-3 py-1 rounded-full flex-shrink-0">
            All
          </div>
          <div className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full flex-shrink-0">
            Science
          </div>
          <div className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full flex-shrink-0">
            Art
          </div>
          <div className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full flex-shrink-0">
            History
          </div>
          <div className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full flex-shrink-0">
            Space
          </div>
        </div>
        
        {/* Specialists Strip */}
        <div className="flex space-x-3 mb-4 justify-center">
          {[{
          emoji: "🔭",
          color: "bg-gradient-to-r from-blue-500 to-purple-500"
        }, {
          emoji: "🎨",
          color: "bg-gradient-to-r from-pink-500 to-orange-400"
        }, {
          emoji: "🌿",
          color: "bg-gradient-to-r from-green-500 to-teal-400"
        }, {
          emoji: "🧠",
          color: "bg-gradient-to-r from-purple-500 to-indigo-500"
        }].map((specialist, idx) => <div key={idx} className={`w-8 h-8 rounded-full ${specialist.color} flex items-center justify-center text-sm shadow-lg ${idx === 0 ? 'ring-2 ring-white' : ''}`}>
              {specialist.emoji}
            </div>)}
        </div>
      </div>
      
      {/* Curio Cards */}
      <div className="space-y-3">
        {/* First Curio - Fact */}
        <div className="bg-gradient-to-r from-wonderwhiz-purple/70 to-wonderwhiz-blue/70 rounded-xl p-3 shadow-lg">
          <div className="flex items-start">
            <div className="rounded-full w-8 h-8 mr-2 bg-white/20 flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div className="text-white">
              <h4 className="text-sm font-bold">Fun Space Fact</h4>
              <p className="text-xs">A year on Venus is shorter than a day on Venus! Venus rotates so slowly that it takes 243 Earth days to spin once.</p>
              <div className="mt-2 flex justify-between items-center">
                <div className="text-[10px] text-white/60">Astronomy</div>
                <div className="flex space-x-2">
                  <button className="p-1 rounded-full hover:bg-white/10 text-white/70">
                    <Star className="h-3 w-3" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-white/10 text-white/70">
                    <Globe className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Second Curio - Quiz */}
        <div className="bg-gradient-to-r from-green-500/70 to-teal-500/70 rounded-xl p-3 shadow-lg">
          <div className="flex items-start">
            <div className="rounded-full w-8 h-8 mr-2 bg-white/20 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-yellow-200" />
            </div>
            <div className="text-white flex-1">
              <h4 className="text-sm font-bold">Pop Quiz!</h4>
              <p className="text-xs mb-2">What's the largest ocean on Earth?</p>
              <div className="space-y-1">
                <button className="bg-white/20 w-full text-left px-2 py-1 rounded text-xs hover:bg-white/30">
                  Atlantic Ocean
                </button>
                <button className="bg-white/20 w-full text-left px-2 py-1 rounded text-xs hover:bg-white/30">
                  Pacific Ocean
                </button>
              </div>
              <div className="mt-2 flex justify-end">
                <div className="text-[10px] text-white/60">+5 sparks for correct answer</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Third Curio - Creative */}
        <div className="bg-gradient-to-r from-amber-400/80 to-yellow-300/80 rounded-xl p-3 shadow-lg">
          <div className="flex items-start">
            <div className="rounded-full w-8 h-8 mr-2 bg-white/20 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-purple-700" />
            </div>
            <div className="text-gray-800 flex-1">
              <h4 className="text-sm font-bold">Draw Challenge</h4>
              <p className="text-xs mb-2">Can you draw your favorite animal? Upload your creation!</p>
              <div className="p-1.5 bg-white/30 rounded border border-dashed border-gray-500 flex items-center justify-center">
                <span className="text-[10px]">Tap to upload your drawing</span>
              </div>
              <div className="mt-2 flex justify-end">
                <div className="text-[10px] text-gray-700">+10 sparks for uploading</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroFeed;
