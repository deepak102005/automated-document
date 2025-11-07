
import React, { useState, useCallback } from 'react';
import { DocumentType } from '../types';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import Loader from './Loader';

interface FileUploadProps {
  onAnalyze: (text: string, name: string, type: DocumentType) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalyze, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocumentType>('legal');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((selectedFile: File) => {
    setError(null);
    if (!selectedFile.type.startsWith('text/')) {
      setError('Invalid file type. Please upload a plain text (.txt) file.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file && docType) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onAnalyze(text, file.name, docType);
      };
      reader.readAsText(file);
    } else {
      setError('Please select a file and a document type.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 border border-gray-700">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Upload Your Document</h2>
        <p className="text-gray-400 mt-2">Drag & drop a .txt file or click to select.</p>
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 ${
          isDragging ? 'border-blue-500 bg-gray-700/50' : 'border-gray-600 hover:border-blue-600'
        }`}
      >
        <input
          type="file"
          accept=".txt"
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-4">
          {file ? (
            <>
              <FileTextIcon className="w-12 h-12 text-blue-400" />
              <p className="text-white font-semibold">{file.name}</p>
              <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
            </>
          ) : (
            <>
              <UploadCloudIcon className="w-12 h-12 text-gray-400" />
              <p className="text-gray-300">
                <span className="font-semibold text-blue-500">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">TXT files only</p>
            </>
          )}
        </label>
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Document Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setDocType('legal')}
              className={`px-4 py-3 rounded-md text-sm font-medium transition-all ${
                docType === 'legal' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Legal / Contract
            </button>
            <button
              onClick={() => setDocType('literary')}
              className={`px-4 py-3 rounded-md text-sm font-medium transition-all ${
                docType === 'literary' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Literary / Text
            </button>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!file || isLoading}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? <Loader /> : 'Analyze Document'}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
