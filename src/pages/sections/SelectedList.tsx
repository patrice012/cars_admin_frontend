import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";

import postReq from "../../helpers/postReq";
import { useQuery } from "react-query";
import Item from "../../models/item.model";
import Modal, {
  DeleteModal,
  DeleteManyModal,
  DisableModalMany,
} from "../../components/Modal";

import { LoadingSkeleton } from "../../components/Table/LoadingSkeleton";
import InputField from "../../components/InputField";
import { CloseCircle, Trash } from "iconsax-react";
import { useSession } from "../../contexts/authContext";
import { Selectable } from "../../components/Selectable";
import { IoClose } from "react-icons/io5";
import { characsItemProps } from "../../helpers/types";

const META = {
  title: "Site Data",
  description: "Site Data",
  perPage: 10,
  page: 1,
};

export const ItemList = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="table-container">
        <div className="site--container">
          {/* user-data */}
          <div className="flex flex-col items-center justify-between ">
            <div className="flex items-center justify-between w-full">
              <div className="actions flex items-center justify-start gap-8">
                <button onClick={()=> navigate('/section/choose_cars')} className="btn btn-primary flex items-center justify-center gap-2">
                  <BsPlusLg /> <p>Add new</p>
                </button>
              </div>
              <div className="flex gap-[24px] items-center">
                <InputField
                  label=""
                  id="title"
                  type="text"
                  placeholder="search"
                  value=""
                  onChange={(e) => {}}
                />
              </div>
            </div>
          </div>

          {/* table */}
          <table className="table table-zebra mt-6">
            {/* thead*/}

            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className=" items-start justify-start flex"
                  />
                </th>
                <th>Name</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody></tbody>
          </table>
        </div>
      </section>
    </>
  );
};
function clg(check: boolean) {
  throw new Error("Function not implemented.");
}

interface AddItemProps {
  isOpen: boolean;
  close: any;
  item: string;
  seleted: {
    model: string;
    color: string;
    engine: string;
    transmission: string;
    fuel: string;
    city: string;
    seller: string;
    brand: string;
  };
  setSelected: any;
}
