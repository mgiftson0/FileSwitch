const DownloadPanel = ({ fileName, setFileName, onDownload }) => {
    return (
      <div className="download-panel">
        <div className="download-controls">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="file-name-input"
          />
          <button onClick={onDownload} className="download-button">
            📥 Download HTML
          </button>
        </div>
      </div>
    );
  };
  
  export default DownloadPanel;