import React from 'react';
import { PrintIcon } from './icons/Icons';

interface ResearchPaperViewProps {
  htmlContent: string;
}

const ResearchPaperView: React.FC<ResearchPaperViewProps> = ({ htmlContent }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Export Research Paper</title>
            <style>
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .no-print {
                  display: none !important;
                }
              }
              body {
                font-family: 'Times New Roman', Times, serif;
                line-height: 1.6;
                color: #000;
                margin: 40px;
              }
              h1 { font-size: 24pt; font-weight: bold; margin-bottom: 1rem; text-align: center; }
              h2 { font-size: 18pt; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; }
              h3 { font-size: 14pt; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; }
              p { margin-bottom: 0.75rem; text-align: justify; }
              ul { padding-left: 20px; }
              a { color: #0000EE; text-decoration: underline; }
              img { max-width: 80%; height: auto; margin: 1.5rem auto; display: block; }
              blockquote { border-left: 4px solid #ccc; padding-left: 1rem; margin-left: 0; font-style: italic;}
            </style>
          </head>
          <body>${htmlContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 animate-fade-in-slow">
      <div className="bg-gray-50 p-4 rounded-t-lg border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-700">Generated Research Paper</h3>
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 flex items-center gap-2"
        >
          <PrintIcon className="h-5 w-5" />
          Export to PDF
        </button>
      </div>
      <div className="p-6 sm:p-8 md:p-12 bg-white text-gray-800 rounded-b-lg">
        <div 
          className="prose prose-lg max-w-none prose-h1:text-center prose-h1:font-serif prose-h2:font-serif prose-a:text-blue-600"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

export default ResearchPaperView;