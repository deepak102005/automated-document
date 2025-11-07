
import React, { useState, useRef, useEffect } from 'react';
import { QAItem } from '../types';
import Loader from './Loader';
import { UserIcon } from './icons/UserIcon';
import { BotIcon } from './icons/BotIcon';

interface QATabProps {
  qaHistory: QAItem[];
  onAskQuestion: (question: string) => void;
  isAnswering: boolean;
}

const QATab: React.FC<QATabProps> = ({ qaHistory, onAskQuestion, isAnswering }) => {
  const [question, setQuestion] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [qaHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isAnswering) {
      onAskQuestion(question.trim());
      setQuestion('');
    }
  };

  return (
    <div className="flex flex-col h-[60vh] max-h-[700px]">
      <div className="flex-1 overflow-y-auto pr-4 space-y-6">
        {qaHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Ask a question about the document to begin.</p>
          </div>
        ) : (
          qaHistory.map((item, index) => (
            <div key={index} className="space-y-6">
              <div className="flex items-start gap-4 justify-end">
                <div className="bg-blue-600/20 text-blue-200 p-4 rounded-lg max-w-xl">
                  <p>{item.question}</p>
                </div>
                 <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-gray-300"/>
                </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <BotIcon className="w-5 h-5 text-gray-300"/>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg max-w-xl">
                  {item.answer === '...' ? <Loader /> : <p className="whitespace-pre-wrap">{item.answer}</p>}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="mt-6 pt-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the document..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isAnswering}
          />
          <button
            type="submit"
            disabled={isAnswering || !question.trim()}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isAnswering ? <Loader /> : 'Ask'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QATab;
