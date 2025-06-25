import React, { useContext, useState } from 'react';
import { Header, CloseButton } from '../Modal';
import { IoCloseSharp } from 'react-icons/io5';
import { ModalContext } from '../../context/ModalContext';
import { PlaygroundContext } from '../../context/PlaygroundContext';
import Select from 'react-select';
import styled from 'styled-components';

/**
 * Styled Component: Layout for form inputs and dropdown
 */
const InputWithSelect = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr;
  gap: 1rem;
  margin-top: 1.2rem;
  align-items: center;

  input {
    flex-grow: 1;
    height: 2rem;
  }

  button {
    background: #241f21;
    height: 2.5rem;
    color: white;
    padding: 0.3rem 2rem;
  }

  & > div {
    width: 8rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/**
 * NewPlaygroundAndFolder Component
 * Allows user to create a new folder and add a playground card inside it.
 * Integrates form input with dropdown language selection.
 */
const NewPlaygroundAndFolder = () => {
  // Modal context: handles modal close
  const { closeModal } = useContext(ModalContext);

  // Playground context: handles combined folder & card creation
  const { addPlaygroundAndFolder } = useContext(PlaygroundContext);

  // Supported programming languages for selection
  const languageOptions = [
    { value: 'cpp', label: 'cpp' },
    { value: 'java', label: 'java' },
    { value: 'javascript', label: 'javascript' },
    { value: 'python', label: 'python' },
  ];

  // Local state for form fields
  const [folderName, setFolderName] = useState('');
  const [playgroundName, setPlaygroundName] = useState('');
  const [language, setLanguage] = useState(languageOptions[0]);

  // Handle language selection from dropdown
  const handleLanguageChange = (selectedOption) => {
    setLanguage(selectedOption);
  };

  return (
    <>
      {/* Modal header section */}
      <Header>
        <h2>Create New Playground & Folder</h2>
        <CloseButton onClick={closeModal}>
          <IoCloseSharp />
        </CloseButton>
      </Header>

      {/* Input section */}
      <InputWithSelect>
        {/* Folder Name Input */}
        <label>Enter Folder Name</label>
        <input
          type="text"
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />

        {/* Playground Name Input */}
        <label>Enter Playground Name</label>
        <input
          type="text"
          placeholder="Playground title"
          value={playgroundName}
          onChange={(e) => setPlaygroundName(e.target.value)}
        />

        {/* Language Dropdown */}
        <Select
          options={languageOptions}
          value={language}
          onChange={handleLanguageChange}
        />

        {/* Submit Button */}
        <button
          onClick={() => {
            addPlaygroundAndFolder(folderName, playgroundName, language.label); // Save new folder + card
            closeModal(); // Close modal
          }}
          disabled={!folderName.trim() || !playgroundName.trim()} // Prevent blank submissions
        >
          Create Playground
        </button>
      </InputWithSelect>
    </>
  );
};

export default NewPlaygroundAndFolder;
