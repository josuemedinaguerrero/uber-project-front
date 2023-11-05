import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    border: "none",
  },
};

interface ModalContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ModalContainer: React.FC<ModalContainerProps> = ({ children, isOpen, setIsOpen }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} style={customStyles}>
      {children}
    </Modal>
  );
};

export default ModalContainer;
