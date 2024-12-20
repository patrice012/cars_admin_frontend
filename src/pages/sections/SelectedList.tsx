import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
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
import { ChooseCar } from "./chooseCar";

const META = {
  title: "Site Data",
  description: "Site Data",
  perPage: 10,
  page: 1,
};

export const ItemList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [debounce, setDebounce] = useState(search);
  const [removing, setRemoving] = useState(false);
  const [removingMany, setRemovingMany] = useState(false);
  const [deleteList, setDeleteList] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const { session } = useSession();
  const [pageNumber, setPageNumber] = useState(META.page);
  const extras = [{ key: "authorization", value: "Bearer " + session }];

  useEffect(() => {
    const Handler = setTimeout(() => {
      setDebounce(search);
    }, 500);

    return () => {
      clearTimeout(Handler);
    };
  }, [search]);

  // get table data
  const handleTableData = async () => {
    // send req
    const result = await postReq({
      data: {
        page: pageNumber,
        perPage: META.perPage,
        search: debounce.trim(),
      },
      url: "section",
      extras: extras,
    });
    if (result.status == 200) {
      console.log(result.data);
      return result.data;
    }
  };

  let queryKey = [location.pathname, pageNumber, debounce, "sites-list"];
  const {
    data: tableData,
    isLoading: tableLoading,
    error,
    refetch: getPaginate,
  } = useQuery(queryKey, handleTableData, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  //  handle next and prev
  const handleNext = () => {
    // check if page available
    if (!tableData?.hasNextPage) {
      // notif page end
      return;
    }

    // scroll to the header of table
    const tableHeaderScrollTo = document.querySelector("thead");
    tableHeaderScrollTo!.scrollIntoView();

    // move page to next
    setPageNumber(tableData?.nextPage);
  };

  const handlePrev = () => {
    // check if page available
    if (!tableData?.hasPrevPage) {
      // notif page end
      return;
    }

    // scroll to the header of table
    const tableHeaderScrollTo = document.querySelector("thead");
    tableHeaderScrollTo!.scrollIntoView();

    // move page to next
    setPageNumber(tableData?.prevPage);
  };

  const toggleDeleteData = (state: boolean) => {
    setRemoving(!removing);
    if (state) {
      getPaginate();
    }
  };

  const toggleDeleteManyData = (state: boolean) => {
    setRemovingMany(!removingMany);
    if (state) {
      getPaginate();
    }
  };

  return (
    <>
      <section className="table-container">
        <div className="site--container">
          {/* user-data */}
          <div className="flex flex-col items-center justify-between ">
            <div className="flex items-center justify-between w-full">
              <div className="actions flex items-center justify-start gap-8">
                <button
                  onClick={() => navigate("/section/choose_cars")}
                  className="btn btn-primary flex items-center justify-center gap-2">
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

            <tbody>
              {/* loading */}
              {tableLoading &&
                new Array(Number(4)).fill("").map((elm, idx) => {
                  return <tr key={idx}>{<LoadingSkeleton />}</tr>;
                })}

              {/* error on nothing found */}
              {(error || tableData?.length === 0) && (
                <>
                  <div className="nodata">
                    <img src="/img/nodata.svg" alt="no data found" />
                    <h3>No record found</h3>
                  </div>
                </>
              )}

              {/* user-data */}
              {tableData &&
                tableData?.map(
                  (
                    Selected: {
                      _id: string;
                      section_title: string;
                      section_uri: string;
                    },
                    idx: number
                  ) => {
                    return (
                      <tr key={idx} className="cursor-pointer">
                        <td>
                          <input
                            type="checkbox"
                            className=" items-start justify-start flex"
                          />
                        </td>
                        <td>{Selected?.section_title}</td>

                        <th
                          className="view-data"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/section/choose_cars", {
                              state: Selected.section_uri,
                            });
                          }}>
                          <RxUpdate />
                        </th>
                        <th
                          className="view-data"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(Selected._id);
                            setRemoving(true);
                          }}>
                          <MdDeleteOutline />
                        </th>
                      </tr>
                    );
                  }
                )}
            </tbody>
          </table>
          {tableData?.length > META.perPage - 2 && (
            <div className="table-footer">
              <div className="elms">
                <button
                  disabled={!tableData?.hasPrevPage}
                  className="btn"
                  onClick={handlePrev}>
                  Previous
                </button>

                <p>
                  Page {tableData?.page} of {tableData?.totalPages}
                </p>

                <button
                  disabled={!tableData?.hasNextPage}
                  className="btn"
                  onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {removing && (
          <DeleteModal
            deleteItem={toggleDeleteData}
            _id={selectedId}
            url="section/delete"
            isOpen={removing}
            closeModal={() => setRemoving(!removing)}
          />
        )}
        {removingMany && (
          <DeleteManyModal
            deleteItem={toggleDeleteManyData}
            _id={deleteList}
            url="section/delete-many"
            isOpen={removingMany}
            setDelete={setDeleteList}
            closeModal={() => setRemovingMany(!removingMany)}
          />
        )}
      </section>
    </>
  );
};
function clg(check: boolean) {
  throw new Error("Function not implemented.");
}
