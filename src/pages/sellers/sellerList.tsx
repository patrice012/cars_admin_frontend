import { useEffect, useState } from "react";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
// icons
import { BsPlusLg } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";

import postReq from "../../helpers/postReq";
import { useQuery } from "react-query";
import AddNewSeller from "./addNewSeller";
import { Seller } from "../../models/brand.model";
import { DeleteManyModal, DeleteModal } from "../../components/Modal";
import { useSession } from "../../contexts/authContext";
import UpdateSeller from "./updateSeller";
import Header from "../../components/Header/Header";
import { ClipLoader } from "react-spinners";
import { LoadingSkeleton } from "../../components/Table/LoadingSkeleton";
import { CloseCircle, Trash } from "iconsax-react";
import InputField from "../../components/InputField";
import Item from "../../models/item.model";
import Selectable from "../../components/Selectable";
import { characsItemProps } from "../../helpers/types";

const META = {
  title: "Site Data",
  description: "Site Data",
  perPage: 10,
  page: 1,
};

export const SellerList = () => {
  const { session } = useSession();
  const [pageNumber, setPageNumber] = useState(META.page);
  const [removing, setRemoving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [removingMany, setRemovingMany] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller>();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [debounce, setDebounce] = useState(search);
  const [deleteList, setDeleteList] = useState([]);
  const [DisableList, setDisableList] = useState([]);
  const [check, setCheck] = useState(false);
  const [filtre, setFiltre] = useState(null);
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const [models, setModels] = useState([]);
  const [filterSelected, setFilterSelected] = useState<string | null>(null);

  const toggleModal = ({ state = true, action = "create" }) => {
    if (action === "create") {
      setIsCreating((prev) => !prev);
    } else if (action === "update") {
      setIsUpdating((prev) => !prev);
    }
    if (state) {
      getPaginate();
    }
  };

  const fetchData = async (
    url: string,
    setState: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    const result = await postReq({
      data: {},
      url,
      extras,
    });
    if (result.status === 200) {
      setState(result.data.data);
    }
  };

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
        sellerType: filterSelected,
      },
      url: "seller",
      extras: [{ key: "authorization", value: `Bearer ${session}` }],
    });
    if (result.status == 200) {
      console.log(result.data);
      return result.data;
    }
  };

  let queryKey = [
    location.pathname,
    pageNumber,
    debounce,
    filterSelected,
    "sites-list",
  ];
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

  const handleDelete = (id: string) => {
    if (id === "all") {
      if (check) {
        setDeleteList([]);
      } else {
        tableData?.data.map((item: Item, idx: number) => {
          setDeleteList((idSelected) => {
            return [...idSelected, item._id];
          });
        });
      }
    } else {
      setDeleteList((idSelected) => {
        if (deleteList.includes(id)) {
          return idSelected.filter((selected) => selected != id);
        } else {
          return [...idSelected, id];
        }
      });
    }
  };

  return (
    <>
      <Header page="Sellers" headerStatus="" />
      <div className="searches-container centerer">
        <section className="table-container">
          <div className="site--container">
            {/* user-data */}
            <div className="wrapper-btn justify-between">
              <div className="actions flex items-center justify-start gap-8">
                <button
                  onClick={() => toggleModal({ state: true, action: "create" })}
                  className="btn btn-primary flex items-center justify-center gap-2">
                  <BsPlusLg /> <p>Add seller</p>
                </button>
                <button
                  style={{ background: "#eab308" }}
                  onClick={() =>
                    navigate("/characteristics/seller_type", {
                      state: {
                        hasRelation: false,
                        relationName: "",
                        relationUri: "",
                      },
                    })
                  }
                  className="btn  flex items-center justify-center gap-2">
                  <p>Seller type</p>
                </button>
                {tableData ? (
                  <p>
                    {tableData?.data.length || tableData?.docs?.length} items
                  </p>
                ) : null}
              </div>
              <div className="flex gap-[24px]">
                {deleteList.length > 0 ? (
                  <button
                    style={{ background: "red" }}
                    onClick={() => setRemovingMany(true)}
                    className="btn border-0 btn-square">
                    <Trash color="white" />
                  </button>
                ) : (
                  ""
                )}

                {filterSelected && (
                  <button
                    style={{ background: "#ca8a04" }}
                    onClick={() => setFilterSelected(null)}
                    className="btn border-0 btn-square">
                    <CloseCircle color="white" />
                  </button>
                )}

                <Selectable
                  items={models.map((ele: characsItemProps) => ({
                    label: ele.name,
                    value: ele._id,
                  }))}
                  onOpen={() =>
                    !models.length && fetchData("seller_type", setModels)
                  }
                  onChange={(e) => {
                    setFilterSelected(e.target.value);
                  }}
                  title=""
                  selected={filterSelected ? filterSelected : ""}
                />

                <InputField
                  label=""
                  id="title"
                  type="text"
                  placeholder="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* table */}
            <table className="table table-zebra mt-6">
              {/* thead*/}
              {tableData?.data.length || tableData ? (
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        className=" items-start justify-start flex"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onChange={(e) => {
                          setCheck(!check);
                          handleDelete("all");
                        }}
                      />
                    </th>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>phone</th>
                    <th>whatsapp</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
              ) : (
                <thead>
                  <tr>
                    <th>Items</th>
                    <th></th>
                  </tr>
                </thead>
              )}

              <tbody>
                {/* loading */}
                {tableLoading &&
                  new Array(Number(4)).fill("").map((elm, idx) => {
                    return <tr key={idx}>{<LoadingSkeleton />}</tr>;
                  })}

                {/* error on nothing found */}
                {(error || tableData?.data.length === 0) && (
                  <>
                    <div className="nodata">
                      <img src="/img/nodata.svg" alt="no data found" />
                      <h3>No record found</h3>
                    </div>
                  </>
                )}

                {/* user-data */}
                {tableData &&
                  tableData?.data.map((Seller: Seller, idx: number) => {
                    return (
                      <tr key={idx} className="cursor-pointer">
                        <td>
                          <input
                            type="checkbox"
                            className=" items-start justify-start flex"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            checked={deleteList.includes(Seller._id)}
                            onChange={(e) => {
                              handleDelete(Seller?._id);
                            }}
                          />
                        </td>
                        <td>{Seller?.firstname}</td>
                        <td>{Seller?.lastname}</td>
                        <td>{Seller?.phone}</td>
                        <td>{Seller?.whatsapp}</td>
                        <th
                          className="view-data"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(Seller._id);
                            setSelectedSeller(Seller);
                            setIsUpdating(true);
                          }}>
                          <RxUpdate />
                        </th>
                        <th
                          className="view-data"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(Seller._id);
                            setRemoving(true);
                          }}>
                          <MdDeleteOutline />
                        </th>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {/* footer */}
          {tableData?.data.length > META.perPage - 2 && (
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
        </section>
        {isCreating && (
          <AddNewSeller isOpen={isCreating} toggleModal={toggleModal} />
        )}
        {isUpdating && (
          <UpdateSeller
            Seller={selectedSeller!}
            isOpen={isUpdating}
            toggleModal={() => toggleModal({ state: true, action: "update" })}
          />
        )}
        {removingMany && (
          <DeleteManyModal
            deleteItem={toggleDeleteManyData}
            _id={deleteList}
            url="seller/delete-many"
            isOpen={removingMany}
            setDelete={setDeleteList}
            closeModal={() => setRemovingMany(!removingMany)}
          />
        )}
        {removing && (
          <DeleteModal
            deleteItem={toggleDeleteData}
            _id={selectedId}
            url="seller/delete"
            isOpen={removing}
            closeModal={() => setRemoving(!removing)}
          />
        )}
      </div>
    </>
  );
};
