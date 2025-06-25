import React, { useContext } from 'react';
import styled from 'styled-components';

// Import modal type components
import {
  NewFolder,
  NewPlayground,
  NewPlaygroundAndFolder,
  EditFolder,
  EditPlaygroundTitle,
  Loading
} from './ModalTypes';

import { ModalContext } from '../context/ModalContext';

/* ---------------------- Styled Components ---------------------- */

// Background overlay for modal
const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4); // semi-transparent black
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Actual modal box content
const ModalContent = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  width: 35%;
  min-width: 300px;
  border-radius: 10px;
`;

// Header section with close button (used in multiple modals)
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// Reusable close button
export const CloseButton = styled.button`
  background: transparent;
  outline: 0;
  border: 0;
  font-size: 2rem;
  cursor: pointer;
`;

// Reusable layout for input + button in modals
export const Input = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 1.5rem 0;
  gap: 2rem;
  padding-bottom: 0;

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
`;

/* ---------------------- Modal Renderer ---------------------- */

/**
 * Modal Component
 * Dynamically renders one of the modal types based on `modalType` in global ModalContext
 */
const Modal = () => {
  const { isOpenModal } = useContext(ModalContext);
  const { modalType } = isOpenModal;

  return (
    <ModalContainer>
      <ModalContent>
        {modalType === 1 && <NewFolder />}
        {modalType === 2 && <NewPlayground />}
        {modalType === 3 && <NewPlaygroundAndFolder />}
        {modalType === 4 && <EditFolder />}
        {modalType === 5 && <EditPlaygroundTitle />}
        {modalType === 6 && <Loading />}
      </ModalContent>
    </ModalContainer>
  );
};

export default Modal;
