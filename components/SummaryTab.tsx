
import React from 'react';
import { Summary } from '../types';

interface SummaryTabProps {
  summary: Summary;
}

const SummarySection: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="space-y-3">
    <h3 className="text-xl font-semibold text-blue-400">{title}</h3>
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{content || "No content generated."}</p>
    </div>
  </div>
);

const SummaryTab: React.FC<SummaryTabProps> = ({ summary }) => {
  return (
    <div className="space-y-8">
      <SummarySection title="Short Summary (1-2 Sentences)" content={summary.short} />
      <SummarySection title="Medium Summary (Paragraph)" content={summary.medium} />
      <SummarySection title="Detailed Summary (Section-wise)" content={summary.detailed} />
    </div>
  );
};

export default SummaryTab;
