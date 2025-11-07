
import React, { useState, useCallback } from 'react';
import { AnalysisResult, DocumentType, QAItem } from './types';
import { analyzeDocument, askQuestion } from './services/geminiService';
import FileUpload from './components/FileUpload';
import AnalysisView from './components/AnalysisView';
import { Logo } from './components/icons/Logo';

function App() {
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (text: string, name: string, type: DocumentType) => {
    setIsLoading(true);
    setError(null);
    setDocumentText(text);
    setDocumentName(name);
    setDocumentType(type);

    try {
      const result = await analyzeDocument(text, type);
      setAnalysisResult({ ...result, qaHistory: [] });
    } catch (e) {
      console.error(e);
      setError('Failed to analyze the document. Please check your API key and try again.');
      setAnalysisResult(null);
      setDocumentText(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAskQuestion = async (question: string) => {
    if (!documentText || !analysisResult) return;
    
    setIsAnswering(true);
    setError(null);
    
    const newQaHistory = [...analysisResult.qaHistory, { question, answer: '...' }];
    setAnalysisResult({ ...analysisResult, qaHistory: newQaHistory });

    try {
      const answer = await askQuestion(documentText, question, analysisResult.qaHistory.slice(0, -1));
      const updatedQaHistory = [...analysisResult.qaHistory, { question, answer }];
      setAnalysisResult({ ...analysisResult, qaHistory: updatedQaHistory });
    } catch (e) {
      console.error(e);
      setError('Failed to get an answer. Please try again.');
      const updatedQaHistory = [...analysisResult.qaHistory, { question, answer: 'Error: Could not get an answer.' }];
      setAnalysisResult({ ...analysisResult, qaHistory: updatedQaHistory });
    } finally {
      setIsAnswering(false);
    }
  };

  const handleStartOver = () => {
    setDocumentText(null);
    setDocumentName(null);
    setDocumentType(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="py-4 px-6 border-b border-gray-700 flex items-center justify-between bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="text-xl font-bold text-white">Automated Document Analyzer</h1>
        </div>
      </header>
      <main className="p-4 sm:p-6 md:p-8">
        {error && (
          <div className="mb-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {!analysisResult ? (
          <FileUpload onAnalyze={handleAnalysis} isLoading={isLoading} />
        ) : (
          <AnalysisView 
            result={analysisResult}
            documentName={documentName || 'Untitled Document'}
            documentType={documentType!}
            onAskQuestion={handleAskQuestion}
            onStartOver={handleStartOver}
            isAnswering={isAnswering}
          />
        )}
      </main>
    </div>
  );
}

export default App;
