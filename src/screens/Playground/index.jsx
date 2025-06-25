import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Buffer } from 'buffer'

import Navbar from './Navbar'
import EditorContainer from './EditorContainer'
import InputConsole from './InputConsole'
import OutputConsole from './OutputConsole'
import Modal from '../../components/Modal'

import { PlaygroundContext, languageMap } from '../../context/PlaygroundContext'
import { ModalContext } from '../../context/ModalContext'

// Styled Components
const MainContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ isFullScreen }) => isFullScreen ? '1fr' : '2fr 1fr'};
  min-height: ${({ isFullScreen }) => isFullScreen ? '100vh' : 'calc(100vh - 4.5rem)'};
  @media (max-width: 768px){
    grid-template-columns: 1fr;
  }
`

const Consoles = styled.div`
  display: grid;
  width: 100%;
  grid-template-rows: 1fr 1fr;
`

// Main Playground Component
const Playground = () => {

  // Get folder & playground ID from route params
  const { folderId, playgroundId } = useParams();

  // Access context values
  const { folders, savePlayground } = useContext(PlaygroundContext);
  const { isOpenModal, openModal, closeModal } = useContext(ModalContext);

  // Extract code data from context
  const { title, language, code } = folders[folderId].playgrounds[playgroundId];

  // Local states
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentCode, setCurrentCode] = useState(code);
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Save Code to Context
 const saveCode = () => {
    savePlayground(folderId, playgroundId, currentCode, currentLanguage);
  };

  // Base64 Encode/Decode (required by Judge0 API)
  const encode = (str) => Buffer.from(str, "binary").toString("base64");
  const decode = (str) => Buffer.from(str, 'base64').toString();

  // Submit Code to Judge0 API
  const postSubmission = async (language_id, source_code, stdin) => {
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'your-api-key-here',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      data: JSON.stringify({ language_id, source_code, stdin })
    };
    const res = await axios.request(options);
    return res.data.token;
  };

  // Get Execution Result from Judge0 API
  const getOutput = async (token) => {
    const options = {
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'X-RapidAPI-Key': 'your-api-key-here',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    };

    const res = await axios.request(options);

    // If code is still running (queued/processing), wait and retry
    if (res.data.status_id <= 2) {
      const res2 = await getOutput(token);
      return res2.data;
    }

    return res.data;
  };

  // Run Code Handler
  const runCode = async () => {
    openModal({ show: true, modalType: 6 }); // Show loading modal

    const language_id = languageMap[currentLanguage].id;
    const source_code = encode(currentCode);
    const stdin = encode(currentInput);

    try {
      const token = await postSubmission(language_id, source_code, stdin);
      const res = await getOutput(token);

      const status_name = res.status.description;
      const decoded_output = decode(res.stdout || '');
      const decoded_compile_output = decode(res.compile_output || '');
      const decoded_error = decode(res.stderr || '');

      // Determine final output
      let final_output = '';
      if (res.status_id !== 3) {
        final_output = decoded_compile_output || decoded_error;
      } else {
        final_output = decoded_output;
      }

      setCurrentOutput(`${status_name}\n\n${final_output}`);
    } catch (err) {
      setCurrentOutput("Error: Unable to run code.");
    }

    closeModal(); // Hide loading modal
  };

  // File Import Handler
  const getFile = (e, setState) => {
    const input = e.target;
    if (input.files.length > 0) {
      placeFileContent(input.files[0], setState);
    }
  };

  const placeFileContent = (file, setState) => {
    readFileContent(file)
      .then(setState)
      .catch(console.error);
  };

  const readFileContent = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // JSX Render
  return (
    <div>
      <Navbar isFullScreen={isFullScreen} />
      <MainContainer isFullScreen={isFullScreen}>
        <EditorContainer
          title={title}
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
          currentCode={currentCode}
          setCurrentCode={setCurrentCode}
          folderId={folderId}
          playgroundId={playgroundId}
          saveCode={saveCode}
          runCode={runCode}
          getFile={getFile}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
        />
        <Consoles>
          <InputConsole
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            getFile={getFile}
          />
          <OutputConsole currentOutput={currentOutput} />
        </Consoles>
      </MainContainer>
      {isOpenModal.show && <Modal />}
    </div>
  );
};

export default Playground;
