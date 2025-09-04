import { useNavigate } from 'react-router-dom';

const ControlPanel = ({ 
  pageWidth, 
  setPageWidth, 
  pageWidthOptions, 
  fileName, 
  setFileName, 
  fileFormat, 
  setFileFormat, 
  fileFormatOptions, 
  onDownload 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="control-panel">
      <div className="control-group">
        <button onClick={handleBack} className="back-button" title="Go back">
          ←
        </button>
        <label>Document Name:</label>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter document name"
          className="document-name-input"
        />
      </div>
      
      <div className="control-group">
        <label>Page Width:</label>
        <select 
          value={pageWidth} 
          onChange={(e) => setPageWidth(parseInt(e.target.value))}
          className="page-width-select"
        >
          {pageWidthOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="control-group">
        <label>Format:</label>
        <select 
          value={fileFormat} 
          onChange={(e) => setFileFormat(e.target.value)}
          className="format-select"
        >
          {fileFormatOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <button onClick={onDownload} className="download-button">
        📥 Download
      </button>
    </div>
  );
};

export default ControlPanel;