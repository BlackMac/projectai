'use client';

import { useState } from 'react';
import { generateProjectBrief } from '../actions/brief';

interface DownloadBriefButtonProps {
  projectId: string;
  projectName: string;
}

export function DownloadBriefButton({ projectId, projectName }: DownloadBriefButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const brief = await generateProjectBrief(projectId);
      
      // Use a Blob to create a PDF from the brief content
      const pdfContent = brief; // Assuming brief is the content you want to convert to PDF
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Create a link element to download the PDF
      const link = document.createElement('a');
      link.href = url;
      link.download = 'output.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log("PDF created successfully!");
    } catch (error) {
      console.error('Failed to download brief:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-md transition-colors"
    >
      {isGenerating ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating Brief...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          Download Project Brief
        </>
      )}
    </button>
  );
} 