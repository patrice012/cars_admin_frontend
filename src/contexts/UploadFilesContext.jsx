import { createContext, useState } from "react";

const UploadFilesContext = createContext();

const UploadFilesProvider = ({ children }) => {
  const [isUploading, setIsUploading] = useState(false);

  const toggleModal = () => {
    setIsUploading((prev) => !prev);
  };

  return (
    <UploadFilesContext.Provider value={{ isUploading, toggleModal }}>
      {children}
    </UploadFilesContext.Provider>
  );
};

export { UploadFilesContext, UploadFilesProvider };
