import React, { useContext, useState } from 'react';
import { Header, CloseButton, Input } from '../Modal';          
import { IoCloseSharp } from 'react-icons/io5';                  
import { ModalContext } from '../../context/ModalContext';       
import { PlaygroundContext } from '../../context/PlaygroundContext'; 

/**
 * NewFolder Component
 * Allows the user to create a new folder in the code playground.
 * Uses modal and playground contexts for state and updates.
 */
const NewFolder = () => {
  // Modal context to handle modal close action
  const { closeModal } = useContext(ModalContext);

  // Playground context to handle folder creation
  const { addFolder } = useContext(PlaygroundContext);

  // Local state to store the title entered by the user
  const [folderTitle, setFolderTitle] = useState('');

  return (
    <>
      {/* Modal Header */}
      <Header>
        <h2>Create New Folder</h2>
        <CloseButton onClick={closeModal}>
          <IoCloseSharp />
        </CloseButton>
      </Header>

      {/* Input field and submit button */}
      <Input>
        <input
          type="text"
          placeholder="Enter folder name"
          value={folderTitle}
          onChange={(e) => setFolderTitle(e.target.value)}
        />

        <button
          onClick={() => {
            addFolder(folderTitle); // Add the new folder via context
            closeModal();           
          }}
          disabled={!folderTitle.trim()} // Prevent creation of empty titles
        >
          Create Folder
        </button>
      </Input>
    </>
  );
};

export default NewFolder;
