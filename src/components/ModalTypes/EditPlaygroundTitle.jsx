import React, { useContext, useState } from 'react';
import { Header, CloseButton, Input } from '../Modal';          // Shared UI components
import { IoCloseSharp } from 'react-icons/io5';                  // Icon for close button
import { ModalContext } from '../../context/ModalContext';       // Context to handle modal state
import { PlaygroundContext } from '../../context/PlaygroundContext'; // Context for playground data

/**
 * EditPlaygroundTitle Component
 * Allows the user to edit the title of an existing code card (playground)
 * Uses modal and playground context to handle state and updates
 */
const EditPlaygroundTitle = () => {
  // Extract modal state and close handler from context
  const { isOpenModal, closeModal } = useContext(ModalContext);

  // Extract playground data and update method from context
  const { editPlaygroundTitle, folders } = useContext(PlaygroundContext);

  // Destructure folder and card IDs from modal identifiers
  const { folderId, cardId } = isOpenModal.identifiers;

  // Local state to hold updated title (initialized with current title)
  const [playgroundTitle, setPlaygroundTitle] = useState(
    folders[folderId].playgrounds[cardId].title
  );

  return (
    <>
      {/* Modal header */}
      <Header>
        <h2>Edit Card Title</h2>
        <CloseButton onClick={closeModal}>
          <IoCloseSharp />
        </CloseButton>
      </Header>

      {/* Input field for editing the title */}
      <Input>
        <input
          type="text"
          value={playgroundTitle}
          onChange={(e) => setPlaygroundTitle(e.target.value)}
        />
        
        {/* Update button to save the title and close the modal */}
        <button
          onClick={() => {
            editPlaygroundTitle(folderId, cardId, playgroundTitle); // Update title in context
            closeModal();                                            // Close modal after update
          }}
        >
          Update Title
        </button>
      </Input>
    </>
  );
};

export default EditPlaygroundTitle;
