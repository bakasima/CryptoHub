
import React, { useState } from 'react';
import { Search, Users, ArrowUp } from 'lucide-react';
import { useLearningContent } from '@/hooks/useLearningContent';

export const LearningHub = () => {
  const [selectedTopic, setSelectedTopic] = useState('DeFi');
  const { content, loading: generatingContent, generateContent } = useLearningContent();

  const topics = [
    { id: 'DeFi', name: 'Decentralized Finance', level: 'Beginner', popularity: 95 },
    { id: 'NFT', name: 'Non-Fungible Tokens', level: 'Intermediate', popularity: 87 },
    { id: 'Bitcoin', name: 'Bitcoin Fundamentals', level: 'Beginner', popularity: 92 },
    { id: 'Ethereum', name: 'Ethereum & Smart Contracts', level: 'Advanced', popularity: 89 },
    { id: 'Trading', name: 'Crypto Trading', level: 'Intermediate', popularity: 76 },
    { id: 'Security', name: 'Crypto Security', level: 'Advanced', popularity: 84 }
  ];

  const selectedTopicData = topics.find(t => t.id === selectedTopic);

  const handleGenerateContent = () => {
    if (selectedTopicData) {
      generateContent(selectedTopicData.name, selectedTopicData.level);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-400 bg-green-900/30';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-900/30';
      case 'Advanced': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">AI-Powered Learning Hub</h1>
          <p className="text-gray-300">Personalized crypto education powered by OpenAI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topic Selection */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Learning Topics</h2>
              <div className="space-y-3">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                      selectedTopic === topic.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{topic.name}</span>
                      <div className="flex items-center space-x-1 text-xs">
                        <ArrowUp className="w-3 h-3" />
                        <span>{topic.popularity}%</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(topic.level)}`}>
                      {topic.level}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Learning Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">DeFi Basics</span>
                    <span className="text-purple-400">85%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">NFT Fundamentals</span>
                    <span className="text-purple-400">62%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  Learning: {selectedTopicData?.name}
                </h2>
                <button
                  onClick={handleGenerateContent}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  {generatingContent ? 'Generating...' : 'Generate AI Content'}
                </button>
              </div>

              {generatingContent ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">OpenAI is generating personalized content...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {content ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {content}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-400 mb-4">Click "Generate AI Content" to create personalized learning material</p>
                      <p className="text-sm text-gray-500">Powered by OpenAI's advanced language models</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recommended Learning Path</h3>
              <div className="space-y-3">
                {[
                  'Complete Bitcoin Fundamentals',
                  'Explore Ethereum & Smart Contracts',
                  'Master DeFi Protocols',
                  'Advanced Trading Strategies'
                ].map((step, index) => (
                  <div key={step} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={index === 0 ? 'text-white font-medium' : 'text-gray-400'}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
