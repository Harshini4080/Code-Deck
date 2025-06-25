import React, { useContext, useState } from 'react';
import { Header, CloseButton, Input } from '../Modal';
import { IoCloseSharp } from 'react-icons/io5';
import { ModalContext } from '../../context/ModalContext';
import { PlaygroundContext } from '../../context/PlaygroundContext';

/**
 * EditFolder Component
 * Allows the user to rename an existing folder in the code playground.
 * Uses context for state management and modal handling.
 */
const EditFolder = () => {
  // Modal context: handles modal visibility and identifiers
  const { closeModal, isOpenModal } = useContext(ModalContext);

  // Playground context: handles folder operations and state
  const { editFolderTitle, folders } = useContext(PlaygroundContext);

  // Extract the folder ID of the folder being edited
  const folderId = isOpenModal.identifiers.folderId;

  // Local state to manage the updated folder title
  const [folderTitle, setFolderTitle] = useState(folders[folderId].title);

  return (
    <>
      {/* Modal header with title and close button */}
      <Header>
        <h2>Edit Folder Title</h2>
        <CloseButton onClick={closeModal}>
          <IoCloseSharp />
        </CloseButton>
      </Header>

      {/* Input field to edit title and update button */}
      <Input>
        <input
          type="text"
          value={folderTitle}
          onChange={(e) => setFolderTitle(e.target.value)}
        />
        <button
          onClick={() => {
            editFolderTitle(folderId, folderTitle); // Update folder title via context
            closeModal(); // Close the modal after update
          }}
        >
          Update Title
        </button>
      </Input>
    </>
  );
};

export default EditFolder;
