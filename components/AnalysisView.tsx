
import React, { useState } from 'react';
import { AnalysisResult, DocumentType, Tab } from '../types';
import SummaryTab from './SummaryTab';
import QATab from './QATab';
import KeywordsTab from './KeywordsTab';
import ExportTab from './ExportTab';
import { BookOpenIcon, MessageSquareIcon, TagIcon, DownloadIcon } from './icons/TabIcons';

interface AnalysisViewProps {
  result: AnalysisResult;
  documentName: string;
  documentType: DocumentType;
  onAskQuestion: (question: string) => void;
  onStartOver: () => void;
  isAnswering: boolean;
}

const TABS: { id: Tab; name: string; icon: React.FC<{className?:string}> }[] = [
  { id: 'summary', name: 'Summary', icon: BookOpenIcon },
  { id: 'qa', name: 'Q&A', icon: MessageSquareIcon },
  { id: 'keywords', name: 'Keywords', icon: TagIcon },
  { id: 'export', name: 'Export', icon: DownloadIcon },
];

const AnalysisView: React.FC<AnalysisViewProps> = ({
  result,
  documentName,
  documentType,
  onAskQuestion,
  onStartOver,
  isAnswering,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <SummaryTab summary={result.summary} />;
      case 'qa':
        return <QATab qaHistory={result.qaHistory} onAskQuestion={onAskQuestion} isAnswering={isAnswering} />;
      case 'keywords':
        return <KeywordsTab keywords={result.keywords} documentType={documentType} />;
      case 'export':
        return <ExportTab result={result} documentName={documentName} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{documentName}</h2>
          <p className="text-gray-400 capitalize">{documentType} Document</p>
        </div>
        <button
          onClick={onStartOver}
          className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
        >
          Analyze Another Document
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-2 sm:space-x-4 p-2" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 font-medium text-sm rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
