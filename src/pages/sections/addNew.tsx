import { useState } from "react";
import Modal from "../../components/Modal";
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import PropTypes from "prop-types";
import { useSession } from "../../contexts/authContext";
import FileUpload from "../../components/FileUpload";
import { useNavigate } from "react-router-dom";

interface AddNewSelectedCarsProps {
  isOpen: boolean;
  toggleModal: ({ state, action }: { state: boolean; action: string }) => void;
  List: [];
  update: any;
}

const AddNewSelectedCars: React.FC<AddNewSelectedCarsProps> = ({
  isOpen,
  toggleModal,
  List,
  update,
}) => {
  console.log(update)
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const navigate = useNavigate();
  const [data, setData] = useState<{
    section_title: string | null;
    section_uri: string;
  }>({
    section_title: update ? update.section_title : "",
    section_uri: "",
  });
  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");
  const uri = `https://autova-dot-clonegpt-fe34c.uc.r.appspot.com/?_id=${List.toString()}`;
  console.log(uri);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(data);
    e.preventDefault();
    e.stopPropagation();

    if (!data.section_title || !(List.length > 0)) {
      setWarning("Please fill all fields");
      return;
    }

    setActionBtn({ text: "Saving...", isDisabled: true });
    const uri = `https://autova-dot-clonegpt-fe34c.uc.r.appspot.com/?_id=${List.toString()}`;
    try {
      let response;
      if (update) {
        response = await postReq({
          data: {
            _id: update._id,
            section_title: data.section_title,
            section_uri: uri.toString(),
          },
          url: "section/update",
          extras,
        });
      } else {
        response = await postReq({
          data: {
            section_title: data.section_title,
            section_uri: uri.toString(),
          },
          url: "section/create",
          extras,
        });
      }

      console.log(response);

      if (response.status == 201) {
        notif(response.data?.message ?? "Success, Data has been added");
        setActionBtn({ text: "Save", isDisabled: false });
        closeModal(true);
        navigate("/sections/selected_cars");
      } else {
        notif(response.data?.message ?? "Failed to add data");
        setActionBtn({ text: "Save", isDisabled: false });
        setWarning("");
      }
    } catch (error) {
      console.log(error);
      setActionBtn({ text: "Save", isDisabled: false });
    }
  };

  const closeModal = (state: boolean) => {
    setWarning("");
    setData({ section_title: "", section_uri: "" });
    toggleModal({ state: state, action: "create" });
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Add New Item"
      warning={warning}
      closeModal={() => closeModal(false)}>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Section name"
          id="name"
          type="text"
          placeholder="Enter name"
          value={data.section_title}
          onChange={(e) => setData({ ...data, section_title: e.target.value })}
        />

        <Button onClick={handleSubmit} disabled={actionBtn.isDisabled}>
          <span>{actionBtn.text}</span>
        </Button>
      </form>
    </Modal>
  );
};

AddNewSelectedCars.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default AddNewSelectedCars;
