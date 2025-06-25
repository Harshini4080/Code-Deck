import { createContext, useState } from "react";

export const ModalContext = createContext();

/**
 * ModalProvider component
 * This wraps the app and provides modal state and control functions via context
 */
function ModalProvider({ children }) {
  const initialModalFields = {
    show: false,          
    modalType: "",        
    identifiers: {
      folderId: "",       
      cardId: "",
    },
  };

  // State to track modal's open/close state and metadata
  const [isOpenModal, setIsOpenModal] = useState({ ...initialModalFields });

  // Function to open modal with passed-in metadata
  const openModal = (value) => {
    setIsOpenModal(value);
  };

  // Function to reset modal state (close it)
  const closeModal = () => {
    setIsOpenModal({ ...initialModalFields });
  };

  // Context value to be passed to children
  const ModalFeatures = {
    isOpenModal,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={ModalFeatures}>
      {children}
    </ModalContext.Provider>
  );
}

export default ModalProvider;
