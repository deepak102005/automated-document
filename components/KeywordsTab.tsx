
import React from 'react';
import { DocumentType } from '../types';
import { TagIcon } from './icons/TabIcons';

interface KeywordsTabProps {
  keywords: string[];
  documentType: DocumentType;
}

const KeywordsTab: React.FC<KeywordsTabProps> = ({ keywords, documentType }) => {
  const title = documentType === 'legal' ? 'Key Clauses & Terms' : 'Key Themes & Elements';

  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-400 mb-4">{title}</h3>
      {keywords.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="flex items-center gap-2 bg-gray-700 text-gray-200 text-sm font-medium px-4 py-2 rounded-full"
            >
              <TagIcon className="w-4 h-4 text-gray-400" />
              {keyword}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No keywords were extracted.</p>
      )}
    </div>
  );
};

export default KeywordsTab;
