import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";

import postReq from "../../helpers/postReq";
import { useQuery } from "react-query";
import AddItem from "./addCar";
import Item from "../../models/item.model";
import {
  DeleteModal,
  DeleteManyModal,
  DisableModalMany,
} from "../../components/Modal";
import UpdateItem from "./updateCar";
import { ClipLoader } from "react-spinners";
import { LoadingSkeleton } from "../../components/Table/LoadingSkeleton";
import InputField from "../../components/InputField";
import { CloseCircle, Trash } from "iconsax-react";
import { useSession } from "../../contexts/authContext";
import Selectable from "../../components/Selectable";

const META = {
  title: "Site Data",
  description: "Site Data",
  perPage: 10,
  page: 1,
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ItemList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(META.page);
  const [removing, setRemoving] = useState(false);
  const [removingMany, setRemovingMany] = useState(false);
  const [deactivatingMany, setDeactivatingMany] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedITem, setSelectedItem] = useState<Item>();
  const [search, setSearch] = useState("");
  const [debounce, setDebounce] = useState(search);
  const [deleteList, setDeleteList] = useState([]);
  const [DisableList, setDisableList] = useState([]);
  const [check, setCheck] = useState(false);
  const [allSelected, setAllSelectedActive] = useState<boolean | null>(null);

  const [filtre, setFiltre] = useState(null);
  const filtres = [
    { label: "all", value: null },
    { label: "active", value: true },
    { label: "inactive", value: false },
  ];

  const toggleModal = ({ state = true, action = "create" }) => {
    if (action === "create") {
      setIsCreating((prev) => !prev);
    } else if (action === "update") {
      setIsUpdating((prev) => !prev);
    }
    if (state) {
      getPaginate();
    }
    getPaginate();
  };

  useEffect(() => {
    const Handler = setTimeout(() => {
      setDebounce(search);
    }, 500);

    return () => {
      clearTimeout(Handler);
    };
  }, [search]);

  const handleTableData = async () => {
    console.log(filtre);
    const result = await postReq({
      data: {
        page: pageNumber,
        perPage: META.perPage,
        search: debounce.trim(),
        isActive: filtre === "all" ? null : filtre,
      },
      url: "car/in-admin",
    });
    console.log(result);
    if (result.status == 200) {
      const data = result.data;
      return data;
    }
  };

  let queryKey = [
    location.pathname,
    pageNumber,
    debounce,
    filtre,
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

  /*  useEffect(() => {
    getPaginate(); // Refetch les données à chaque changement de recherche
  }, [search]); */

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

    setPageNumber(tableData?.prevPage);
  };

  // view item data
  const handleSiteKeywordDetail = async (item: Item) => {
    if (!item._id) return;
    navigate(`/items/${item._id}`, { state: { ...item } });
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

  const toggleDesactiveManyData = (state: boolean) => {
    setDeactivatingMany(!deactivatingMany);
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

  useEffect(() => {
    if (deleteList.length > 0) {
      const firstItem = tableData?.data.find(
        (item: Item) => item._id === deleteList[0]
      );
      if (firstItem) {
        const isFirstItemActive = firstItem.isActive;
        const allSameStatus = deleteList.every((id) => {
          const selectedItem = tableData?.data.find(
            (item: Item) => item._id === id
          );
          return selectedItem?.isActive === isFirstItemActive;
        });
        setAllSelectedActive(allSameStatus ? isFirstItemActive : null);
      }
    } else {
      setAllSelectedActive(null);
    }
  }, [deleteList, tableData]);

  /*  const deleteManyCar = async () => {
    const res = await postReq({
      data: { carsId: deleteList },
      url: "car/delete-many",
    });
    console.log(res);
  }; */

  return (
    <>
      <section className="table-container">
        <div className="site--container">
          {/* user-data */}
          <div className="wrapper-btn justify-between">
            <div className="actions flex items-center justify-start gap-8">
              <button
                onClick={() => toggleModal({ state: true, action: "create" })}
                className="btn btn-primary flex items-center justify-center gap-2">
                <BsPlusLg /> <p>Add new</p>
              </button>
              {tableData ? (
                <p>{tableData?.data.length || tableData?.length} item(s)</p>
              ) : null}
            </div>
            <div className="flex gap-[24px]">
              {deleteList.length > 0 ? (
                <>
                  {allSelected !== null && (
                    <button
                      style={{ background: "#2563eb" }}
                      onClick={() => setDeactivatingMany(true)}
                      className="btn border-0 btn-square">
                      <CloseCircle color="white" />
                    </button>
                  )}
                  <button
                    style={{ background: "red" }}
                    onClick={() => setRemovingMany(true)}
                    className="btn border-0 btn-square">
                    <Trash color="white" />
                  </button>
                </>
              ) : (
                ""
              )}

              <Selectable
                items={filtres.map((item: any) => ({
                  label: item.label,
                  value: item.value,
                }))}
                onChange={(e) => {
                  setFiltre(e.target.value);
                  setPageNumber(1);
                }}
                title=""
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
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Seller</th>
                  <th>Sales Price</th>
                  <th>Status</th>
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
                  <div className="nodata ">
                    <img src="/img/nodata.svg" alt="no data found" />
                    <h3>No record found</h3>
                  </div>
                </>
              )}

              {/* user-data */}
              {tableData?.data.map((item: Item, idx: number) => {
                return (
                  <tr
                    key={idx}
                    onClick={() => {
                      handleSiteKeywordDetail(item);
                    }}
                    className="cursor-pointer items-center">
                    <td>
                      <input
                        type="checkbox"
                        className=" items-start justify-start flex"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        checked={deleteList.includes(item._id)}
                        onChange={(e) => {
                          handleDelete(item?._id);
                        }}
                      />
                    </td>
                    <td>{item?.name}</td>
                    <td>{item.brand?.name}</td>
                    <td>{item.model?.name}</td>
                    <td>{item.seller?.firstname}</td>
                    <td>{item?.salesPrice}</td>
                    <td>{item?.isActive ? "Active" : "Inactive"}</td>
                    <th
                      className="view-data"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                        setIsUpdating(true);
                      }}>
                      <RxUpdate color="blue" />
                    </th>
                    <th
                      className="view-data"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(item._id);
                        setRemoving(true);
                      }}>
                      <MdDeleteOutline color="red" />
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* footer */}
        {(tableData?.hasNextPage || tableData?.hasPrevPage) && (
          <div className="table-footer">
            <div className="elms">
              <button
                disabled={!tableData.hasPrevPage}
                className="btn"
                onClick={handlePrev}>
                Previous
              </button>

              <p>
                Page {tableData?.page} of {tableData?.totalPages}
              </p>

              <button
                disabled={!tableData.hasNextPage}
                className="btn"
                onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}
      </section>
      {isCreating && <AddItem isOpen={isCreating} toggleModal={toggleModal} />}
      {isUpdating && selectedITem && (
        <UpdateItem
          item={selectedITem}
          isOpen={isUpdating}
          toggleModal={() => toggleModal({ state: false, action: "update" })}
        />
      )}
      {removing && (
        <DeleteModal
          deleteItem={toggleDeleteData}
          _id={selectedId}
          url="car/delete"
          isOpen={removing}
          closeModal={() => setRemoving(!removing)}
        />
      )}
      {removingMany && (
        <DeleteManyModal
          deleteItem={toggleDeleteManyData}
          _id={deleteList}
          url="car/delete-many"
          isOpen={removingMany}
          setDelete={setDeleteList}
          closeModal={() => setRemovingMany(!removingMany)}
        />
      )}
      {deactivatingMany && (
        <DisableModalMany
          data={{ isActive: allSelected }}
          deleteItem={toggleDesactiveManyData}
          _id={deleteList}
          url="car/delete-many"
          isOpen={deactivatingMany}
          setDelete={setDeleteList}
          closeModal={() => setDeactivatingMany(!deactivatingMany)}
        />
      )}
    </>
  );
};
function clg(check: boolean) {
  throw new Error("Function not implemented.");
}
