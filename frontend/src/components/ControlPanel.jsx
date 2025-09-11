import { Save } from 'lucide-react';
import '../styles/ControlPanel.css';

const ControlPanel = ({
  documentName,
  setDocumentName,
  pageWidth,
  setPageWidth,
  outputFormat,
  setOutputFormat,
  handleDownload,
  isDownloading,
  handleBack,
}) => {
  const pageWidthOptions = [
    { value: 612, label: '8.5"' },
    { value: 595, label: 'A4' },
    { value: 816, label: '10.5"' },
    { value: 1056, label: '13.5"' },
  ];

  return (
    <div className="control-panel">
      <button className="back-button" onClick={handleBack} title="Go Back">
        ←
      </button>

      <div className="control-group">
        <label htmlFor="page-width">Width:</label>
        <select
          id="page-width"
          value={pageWidth}
          onChange={(e) => setPageWidth(Number(e.target.value))}
          className="page-width-select"
        >
          {pageWidthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="right-controls">
        <div className="control-group">
          <input
            id="document-name"
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="document-name-input"
            placeholder="Document Name"
          />
        </div>

        <div className="control-group">
          <label htmlFor="output-format">Format:</label>
          <select
            id="output-format"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="format-select"
          >
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
          </select>
        </div>

        <button
          className="download-button"
          onClick={handleDownload}
          disabled={isDownloading}
          title={isDownloading ? 'Converting...' : `Download ${outputFormat.toUpperCase()}`}
        >
          <Save size={16} />
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;