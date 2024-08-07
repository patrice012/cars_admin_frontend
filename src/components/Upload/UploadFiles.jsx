// react hooks
import { useEffect, useState, useContext } from "react";
// icons
import { BsUpload, BsTrash } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
// context
import { UploadFilesContext } from "../../contexts/UploadFilesContext";
// helper
import notif from "../../helpers/notif";
// app domain
let REACT_APP_DOMAIN = import.meta.env.VITE_REACT_APP_DOMAIN;
let VITE_ENV = import.meta.env.VITE_ENV;
// useQuery
import { useQueryClient } from "react-query";
// router hooks
import { useNavigate } from "react-router-dom";

export const UploadFiles = () => {
  //limit number for upload
  const maxUpload = 10;
  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileValidation, setFileValidation] = useState({
    isValid: true,
    message: undefined,
  });

  const [isLoading, setIsloadind] = useState(false);

  const { isUploading, toggleModal } = useContext(UploadFilesContext);

  const handleFileChange = (e) => {
    const files = e.target.files;

    if (selectedFiles.length + files.length > maxUpload) {
      setFileValidation({
        isValid: false,
        message: `Upload maximun ${maxUpload} files`,
      });
      return;
    }

    for (let file of files) {
      if (!file.size > 0) {
        setFileValidation({
          isValid: false,
          message: "Please select a valid file",
        });
        return;
      }
    }
    setSelectedFiles((prev) => [...prev, ...e.target.files]);
  };

  useEffect(() => {
    if (!fileValidation.isValid && fileValidation.message !== undefined) {
      // notify user
      setTimeout(() => {
        setFileValidation({ isValid: true, message: undefined });
      }, 5000);
    }
  }, [fileValidation.isValid, fileValidation.message]);

  const deleteFile = (index) => {
    let newFiles = selectedFiles.filter((file, i) => i !== index);
    setSelectedFiles((prev) => [...newFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloadind(true);

    // Create a new FormData instance
    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append("files", file);
    }

    try {
      // Send a POST request to the endpoint
      const response = await postReq(formData, "/api/proxy/new");

      // push notification
      notif(`${response.message}`);
      if (response.code === "ok") {
        // close modal
        toggleModal();

        // reset selected files list
        setSelectedFiles([]);

        // refetch table data
        queryClient.invalidateQueries({
          queryKey: ["proxies"],
        });

        // refetch dashboard analytics data
        queryClient.invalidateQueries({
          queryKey: ["analytics"],
        });

        // redirect to user data page
        navigate("/proxies");
      }
    } catch (error) {
      if (VITE_ENV === "development") {
        console.log(error);
      }
    } finally {
      setIsloadind(false);
    }
  };

  const handleClose = () => {
    toggleModal();
    setSelectedFiles([]);
    setFileValidation({ isValid: true, message: undefined });
  };

  return (
    <>
      <input
        type="checkbox"
        checked={isUploading}
        readOnly
        id="upload-modal"
        className="modal-toggle"
      />
      <div className="modal upload modal--container" role="dialog">
        {/*  display upload warnings */}

        <>
          <div className="modal-box upload-box">
            {!fileValidation.isValid && (
              <div className="upload-warnings">
                <p>{fileValidation?.message}</p>
              </div>
            )}

            <div className="upload-files">
              <form
                onSubmit={handleSubmit}
                method="post"
                encType="multipart/form-data"
              >
                <label className="form-control w-full max-w-xs">
                  <span>Select files</span>
                  <input
                    type="file"
                    accept=".txt"
                    name="txt_files"
                    multiple
                    className="input input-bordered w-full max-w-xs"
                    onChange={handleFileChange}
                  />
                </label>
                {isLoading && (
                  <button className="btn btn-primary loading">
                    Uploading...
                  </button>
                )}
                {!isLoading && (
                  <button className="btn">
                    <span>Upload</span> <BsUpload />
                  </button>
                )}
              </form>
            </div>
            {selectedFiles.length > 0 && (
              <div className="uploaded-files">
                <div className="dataTable">
                  <div className="overflow-x-auto">
                    <table className="table ">
                      <thead>
                        <tr>
                          <th>Id</th>
                          <th>Name</th>
                          <th>Size</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFiles?.map((file, index) => {
                          return (
                            <tr key={index}>
                              <th>{index + 1}</th>
                              <td>{file.name}</td>
                              <td>{file.size}</td>
                              <td>
                                <button
                                  className="btn btn--delete"
                                  onClick={() => deleteFile(index)}
                                >
                                  <BsTrash />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>

        <div className="wrapper">
          <label className="modal-backdrop close-modal" htmlFor="upload-modal">
            <IoIosClose onClick={handleClose} />
          </label>
        </div>
      </div>
    </>
  );
};

// env
const postReq = async (formData, url) => {
  let endpoint = `${REACT_APP_DOMAIN}${url}`;

  try {
    const response = await fetch(endpoint, {
      mode: "cors",
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};
