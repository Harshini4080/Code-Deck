import React, { useContext, useState } from 'react';
import { Header, CloseButton } from '../Modal';
import { IoCloseSharp } from 'react-icons/io5';
import { ModalContext } from '../../context/ModalContext';
import { PlaygroundContext } from '../../context/PlaygroundContext';
import Select from 'react-select';
import styled from 'styled-components';

/**
 * Styled component for input field and select dropdown layout
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
 * NewPlayground Component
 * Allows users to create a new code card ("playground") inside an existing folder.
 * Uses React Context API for managing modal state and playground data.
 */
const NewPlayground = () => {
  // Context to handle modal state (open/close, identifiers)
  const { isOpenModal, closeModal } = useContext(ModalContext);

  // Context to add a new playground card
  const { addPlayground } = useContext(PlaygroundContext);

  // Predefined programming language options for the select dropdown
  const languageOptions = [
    { value: "cpp", label: "cpp" },
    { value: "java", label: "java" },
    { value: "javascript", label: "javascript" },
    { value: "python", label: "python" },
  ];

  // Extract the parent folder ID from modal context
  const { folderId } = isOpenModal.identifiers;

  // Local state: card title and selected language
  const [cardTitle, setCardTitle] = useState('');
  const [language, setLanguage] = useState(languageOptions[0]);

  // Handle language dropdown selection
  const handleLanguageChange = (selectedOption) => {
    setLanguage(selectedOption);
  };

  return (
    <>
      {/* Modal Header */}
      <Header>
        <h2>Create New Playground</h2>
        <CloseButton onClick={closeModal}>
          <IoCloseSharp />
        </CloseButton>
      </Header>

      {/* Input for title + dropdown for language + submit button */}
      <InputWithSelect>
        <input
          type="text"
          placeholder="Enter playground title"
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
        />
        <Select
          options={languageOptions}
          value={language}
          onChange={handleLanguageChange}
        />
        <button
          onClick={() => {
            addPlayground(folderId, cardTitle, language.label); // Add playground card
            closeModal();                                       // Close modal after creation
          }}
          disabled={!cardTitle.trim()} // Prevent empty titles
        >
          Create Playground
        </button>
      </InputWithSelect>
    </>
  );
};

export default NewPlayground;
