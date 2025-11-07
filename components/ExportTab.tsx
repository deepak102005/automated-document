
import React from 'react';
import { AnalysisResult } from '../types';
import { FileTextIcon, FileCodeIcon, FileIcon } from './icons/FileIcons';

declare const jspdf: any;
declare const docx: any;
declare const saveAs: any;

interface ExportTabProps {
  result: AnalysisResult;
  documentName: string;
}

const ExportTab: React.FC<ExportTabProps> = ({ result, documentName }) => {
  const generateTextContent = () => {
    let content = `Analysis for: ${documentName}\n\n`;
    content += '--- SUMMARY ---\n\n';
    content += `Short:\n${result.summary.short}\n\n`;
    content += `Medium:\n${result.summary.medium}\n\n`;
    content += `Detailed:\n${result.summary.detailed}\n\n`;
    
    content += '--- Q&A HISTORY ---\n\n';
    if (result.qaHistory.length > 0) {
      result.qaHistory.forEach(qa => {
        content += `Q: ${qa.question}\nA: ${qa.answer}\n\n`;
      });
    } else {
      content += 'No questions asked.\n';
    }

    content += '--- KEYWORDS/CLAUSES ---\n\n';
    if (result.keywords.length > 0) {
      content += result.keywords.join(', ');
    } else {
      content += 'No keywords extracted.';
    }

    return content;
  };

  const handleExportTXT = () => {
    const content = generateTextContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${documentName}_analysis.txt`);
  };

  const handleExportPDF = () => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * 7);
    };

    let y = 20;
    doc.setFontSize(16);
    y = addWrappedText(`Analysis for: ${documentName}`, 10, y, 180);
    y += 10;
    
    doc.setFontSize(14);
    doc.text("Summary", 10, y);
    y += 7;
    doc.setFontSize(12);
    y = addWrappedText(`Short: ${result.summary.short}`, 10, y, 180);
    y += 5;
    y = addWrappedText(`Medium: ${result.summary.medium}`, 10, y, 180);
    y += 5;
    y = addWrappedText(`Detailed: ${result.summary.detailed}`, 10, y, 180);
    y += 10;

    doc.setFontSize(14);
    doc.text("Q&A History", 10, y);
    y += 7;
    doc.setFontSize(12);
    result.qaHistory.forEach(qa => {
      y = addWrappedText(`Q: ${qa.question}`, 10, y, 180);
      y += 2;
      y = addWrappedText(`A: ${qa.answer}`, 15, y, 175);
      y+= 5;
    });

    doc.save(`${documentName}_analysis.pdf`);
  };

  const handleExportDOCX = () => {
    const doc = new docx.Document({
      sections: [{
        children: [
          new docx.Paragraph({ text: `Analysis for: ${documentName}`, heading: docx.HeadingLevel.HEADING_1 }),
          new docx.Paragraph({ text: "Summary", heading: docx.HeadingLevel.HEADING_2 }),
          new docx.Paragraph({ text: "Short:", style: "strong" }),
          new docx.Paragraph(result.summary.short),
          new docx.Paragraph({ text: "Medium:", style: "strong" }),
          new docx.Paragraph(result.summary.medium),
          new docx.Paragraph({ text: "Detailed:", style: "strong" }),
          new docx.Paragraph(result.summary.detailed),
          
          new docx.Paragraph({ text: "Q&A History", heading: docx.HeadingLevel.HEADING_2 }),
          ...result.qaHistory.flatMap(qa => [
            new docx.Paragraph({ text: `Q: ${qa.question}`, style: "strong" }),
            new docx.Paragraph(qa.answer),
          ]),

          new docx.Paragraph({ text: "Keywords/Clauses", heading: docx.HeadingLevel.HEADING_2 }),
          new docx.Paragraph(result.keywords.join(', ')),
        ],
      }],
    });

    docx.Packer.toBlob(doc).then((blob: Blob) => {
      saveAs(blob, `${documentName}_analysis.docx`);
    });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-blue-400 mb-4">Export Analysis</h3>
      <p className="text-gray-400 mb-6">Download the generated summary, Q&A, and keywords in your preferred format.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ExportButton icon={FileIcon} label="Export as .txt" onClick={handleExportTXT} />
        <ExportButton icon={FileCodeIcon} label="Export as .pdf" onClick={handleExportPDF} />
        <ExportButton icon={FileTextIcon} label="Export as .docx" onClick={handleExportDOCX} />
      </div>
    </div>
  );
};

const ExportButton: React.FC<{icon: React.FC<{className?: string}>, label: string, onClick: () => void}> = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick} className="bg-gray-700 text-gray-200 font-semibold p-4 rounded-lg flex flex-col items-center justify-center gap-3 hover:bg-gray-600 transition-colors">
        <Icon className="w-8 h-8 text-blue-400"/>
        <span>{label}</span>
    </button>
)

export default ExportTab;
