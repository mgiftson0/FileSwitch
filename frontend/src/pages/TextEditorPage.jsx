import { useState } from 'react';
import CustomToolbar from '../components/CustomToolbar';
import EditorContainer from '../components/EditorContainer';
import ControlPanel from '../components/ControlPanel';
import Footer from '../components/Footer';
import '../components/TextEditorPage.css';

const TextEditorPage = () => {
  const [text, setText] = useState('');
  const [quillInstance, setQuillInstance] = useState(null);
  const [pageWidth, setPageWidth] = useState(816);
  const [fileName, setFileName] = useState('document');
  const [fileFormat, setFileFormat] = useState('html');

  const pageWidthOptions = [
    { value: 612, label: 'Letter (8.5")' },
    { value: 816, label: 'A4 (8.27")' },
    { value: 1056, label: 'Legal (11")' },
    { value: 720, label: 'Custom (7.5")' },
    { value: 960, label: 'Wide (10")' }
  ];

  const fileFormatOptions = [
    { value: 'html', label: 'HTML' },
    { value: 'doc', label: 'Word DOC' },
    { value: 'pdf', label: 'PDF' }
  ];

  const handleDownload = () => {
    // Download logic will be implemented here
    console.log('Downloading:', fileName, fileFormat);
  };

  return (
    <div className="text-editor-page">
      <ControlPanel 
        pageWidth={pageWidth}
        setPageWidth={setPageWidth}
        pageWidthOptions={pageWidthOptions}
        fileName={fileName}
        setFileName={setFileName}
        fileFormat={fileFormat}
        setFileFormat={setFileFormat}
        fileFormatOptions={fileFormatOptions}
        onDownload={handleDownload}
      />
      
      <CustomToolbar quillInstance={quillInstance} />
      
      <EditorContainer 
        text={text}
        setText={setText}
        pageWidth={pageWidth}
        setQuillInstance={setQuillInstance}
      />
      <Footer />
    </div>
  );
};

export default TextEditorPage;