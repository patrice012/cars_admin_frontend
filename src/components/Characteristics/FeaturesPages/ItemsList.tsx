import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// icons
import { BsPlusLg } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";

import postReq from "../../../helpers/postReq";
import { useQuery } from "react-query";
import AddNew from "./addNew";
import UpdateData from "./updateItem";
import DeletedData from "./deleteData";
import { useSession } from "../../../contexts/authContext";
import { LoadingSkeleton } from "../../Table/LoadingSkeleton";
import { characsItemProps, subItemProps } from "../../../helpers/types";
import { CloseCircle, Trash } from "iconsax-react";
import InputField from "../../InputField";
import Item from "../../../models/item.model";
import { DeleteManyModal } from "../../Modal";
import Selectable from "../../Selectable";

const META = {
  title: "Site Data",
  description: "Site Data",
  perPage: 10,
  page: 1,
};

interface ItemType {
  name: string;
  _id: string;
  [key: string]: subItemProps | any;
}

export const ItemList = ({ page }: { page: string }) => {
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const [pageNumber, setPageNumber] = useState(META.page);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const location = useLocation();
  const { hasRelation, relationName, relationUri } = location.state;
  const [search, setSearch] = useState("");
  const [removingMany, setRemovingMany] = useState(false);
  const [debounce, setDebounce] = useState(search);
  const [deleteList, setDeleteList] = useState([]);
  const [DisableList, setDisableList] = useState([]);
  const [check, setCheck] = useState(false);
  // toggle view data
  const [rowData, setRowData] = useState({});
  const [models, setModels] = useState([]);
  const [filterSelected, setFilterSelected] = useState<string | null>(null);

  const toggleModal = ({ state = true, action = "create" }) => {
    if (action === "create") {
      setIsCreating((prev) => !prev);
    } else if (action === "update") {
      setIsUpdating((prev) => !prev);
    } else if (action === "delete") {
      setIsDeleting((prev) => !prev);
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

  let uri = "";
  if (page?.toLowerCase() === "colors") {
    uri = "colors";
  } else if (page?.toLowerCase() === "cylinders") {
    uri = "cylinders";
  } else if (page?.toLowerCase() === "enginetype") {
    uri = "engine_type";
  } else if (page?.toLowerCase() === "model") {
    uri = "model";
  } else if (page?.toLowerCase() === "transmission") {
    uri = "transmission";
  } else if (page?.toLowerCase() === "fuel") {
    uri = "fuel_type";
  } else if (page?.toLowerCase() === "title") {
    uri = "title";
  } else if (page?.toLowerCase() === "countries") {
    uri = "country";
  } else if (page?.toLowerCase() === "city") {
    uri = "city";
  } else if (page?.toLowerCase() === "sellertype") {
    uri = "seller_type";
  }

  // get table data
  const handleTableData = async () => {
    console.log(relationUri);
    console.log(uri, filterSelected);
    // send req
    const result = await postReq({
      data: {
        page: pageNumber,
        perPage: META.perPage,
        search: debounce.trim(),
        country: uri === "city" ? filterSelected : null,
        brand: uri === "model" ? filterSelected : null,
      },
      url: uri,
      extras,
    });
    console.log(result.data);
    if (result.status == 200) return result.data;
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

  const getSubData = async () => {
    const result = await postReq({
      data: {},
      url: relationUri,
      extras: [{ key: "authorization", value: "Bearer " + session }],
    });
    console.log(result.data);
    if (result.status == 200) {
      const data = (result.data as { data: any }).data;
      return data;
    }
  };

  const {
    data: subTableData,
    isLoading: subTableloading,
    error: subtableError,
    refetch: subTableGetPaginate,
  } = useQuery(["queryKey"], getSubData, {
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

  // update row data
  const UpdateRowData = (data: any) => {
    // get detail data
    // console.log(data);
    setRowData({ ...data });
    // open modal
    toggleModal({ state: true, action: "update" });
  };

  // delete row data
  const DeleteRowData = (idx: string) => {
    // get detail data
    setRowData({ _id: idx });
    // open modal
    setIsDeleting(true);
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
      <section className="table-container">
        <div className="site--container">
          {/* user-data */}
          <div className="wrapper-btn justify-between">
            <div className="actions flex items-center justify-start gap-8">
              <button
                onClick={() => toggleModal({ state: true, action: "create" })}
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                <BsPlusLg /> <p>Add new</p>
              </button>
              {tableData?.data ? <p>{tableData?.data?.length} items</p> : null}
            </div>
            <div className="flex gap-[24px]">
              {deleteList.length > 0 ? (
                <button
                  style={{ background: "red" }}
                  onClick={() => setRemovingMany(true)}
                  className="btn border-0 btn-square"
                >
                  <Trash color="white" />
                </button>
              ) : (
                ""
              )}

              {filterSelected && (
                <button
                  style={{ background: "#ca8a04" }}
                  onClick={() => setFilterSelected(null)}
                  className="btn border-0 btn-square"
                >
                  <CloseCircle color="white" />
                </button>
              )}

              {(page?.toLowerCase() === "model" ||
                page?.toLowerCase() === "city") && (
                <Selectable
                  items={models.map((ele: characsItemProps) => ({
                    label: ele?.name ?? ele?.name,
                    value: ele?._id,
                  }))}
                  onOpen={() =>
                    !models.length &&
                    fetchData(
                      page?.toLowerCase() === "model" ? "brand" : "country",
                      setModels
                    )
                  }
                  onChange={(e) => {
                    setFilterSelected(e.target.value);
                  }}
                  title=""
                  selected={filterSelected ? filterSelected : ""}
                />
              )}

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
            {tableData?.data.docs?.length || tableData ? (
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
                  {hasRelation && <th> {relationUri?.toUpperCase()} </th>}

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
              {tableData?.data.length &&
                tableData?.data.map((item: ItemType, idx: number) => {
                  return (
                    <tr key={idx} className="cursor-pointer">
                      <td>
                        <input
                          type="checkbox"
                          className=" items-start justify-start flex"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          checked={deleteList.includes(item?._id)}
                          onChange={(e) => {
                            handleDelete(item?._id);
                          }}
                        />
                      </td>
                      <td>{item?.name}</td>

                      {hasRelation && <td>{item?.[relationUri].name}</td>}

                      <th
                        className="view-data"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(item);
                          UpdateRowData(item);
                        }}
                      >
                        <RxUpdate />
                      </th>
                      <th
                        className="view-data"
                        onClick={(e) => {
                          e.stopPropagation();
                          DeleteRowData(item._id);
                        }}
                      >
                        <MdDeleteOutline />
                      </th>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {/* footer */}
        {tableData?.totalPages > META.perPage - 2 && (
          <div className="table-footer">
            <div className="elms">
              <button
                disabled={!tableData?.hasPrevPage}
                className="btn"
                onClick={handlePrev}
              >
                Previous
              </button>

              <p>
                Page {tableData?.page} of {tableData?.totalPages}
              </p>

              <button
                disabled={!tableData?.hasNextPage}
                className="btn"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
      {isCreating && (
        <AddNew
          hasRelation={{
            hasRelation,
            relationName,
            relationData: subTableData ?? [],
          }}
          isOpen={isCreating}
          toggleModal={toggleModal}
          page={page}
        />
      )}

      {isUpdating && (
        <UpdateData
          hasRelation={{
            hasRelation,
            relationName,
            relationData: subTableData ?? [],
            relationUri: relationUri,
          }}
          isOpen={isUpdating}
          toggleModal={toggleModal}
          page={page}
          updatedData={rowData}
        />
      )}

      {removingMany && (
        <DeleteManyModal
          deleteItem={toggleDeleteManyData}
          _id={deleteList}
          url={`${uri}/delete-many`}
          isOpen={removingMany}
          setDelete={setDeleteList}
          closeModal={() => setRemovingMany(!removingMany)}
        />
      )}

      {isDeleting && (
        <DeletedData
          isOpen={isDeleting}
          toggleModal={toggleModal}
          page={page}
          deleteData={rowData}
        />
      )}
    </>
  );
};
