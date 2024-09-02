import { useState } from "react";
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

const META = {
  title: "Site Data",
  description: "Site Data",
  perPage: 10,
  page: 1,
};

interface ItemType {
  name: string;
  _id: string;
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
  // toggle view data
  const [rowData, setRowData] = useState({});

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

  // get table data
  const handleTableData = async () => {
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
    }
    console.log(relationUri);
    // send req
    const result = await postReq({
      data: { page: pageNumber, perPage: META.perPage },
      url: uri,
      extras,
    });
    console.log(result.data);
    if (result.status == 200) return result.data;
  };

  let queryKey = [location.pathname, pageNumber, "sites-list"];
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
    if (!tableData?.data.hasNextPage) {
      // notif page end
      return;
    }

    // scroll to the header of table
    const tableHeaderScrollTo = document.querySelector("thead");
    tableHeaderScrollTo!.scrollIntoView();

    // move page to next
    setPageNumber(tableData?.data.nextPage);
  };

  const handlePrev = () => {
    // check if page available
    if (!tableData?.data.hasPrevPage) {
      // notif page end
      return;
    }

    // scroll to the header of table
    const tableHeaderScrollTo = document.querySelector("thead");
    tableHeaderScrollTo!.scrollIntoView();

    // move page to next
    setPageNumber(tableData?.data.prevPage);
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

  return (
    <>
      <section className="table-container">
        <div className="site--container">
          {/* user-data */}
          <div className="wrapper-btn">
            <div className="actions flex items-center justify-start gap-8">
              <button
                onClick={() => toggleModal({ state: true, action: "create" })}
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                <BsPlusLg /> <p>Add new</p>
              </button>
              {tableData?.data.docs ? (
                <p>
                  {tableData?.data.totalDocs || tableData?.data.docs?.length}{" "}
                  items
                </p>
              ) : null}
            </div>
          </div>

          {/* table */}
          <table className="table table-zebra mt-6">
            {/* thead*/}
            {tableData?.data.docs?.length || tableData ? (
              <thead>
                <tr>
                  <th>Name</th>

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
                  return <tr key={idx}>{/* <LoadingSkeleton /> */}</tr>;
                })}

              {/* error on nothing found */}
              {(error || tableData?.data.docs?.length === 0) && (
                <>
                  <div className="nodata">
                    <img src="/img/nodata.svg" alt="no data found" />
                    <h3>No record found</h3>
                  </div>
                </>
              )}

              {/* user-data */}
              {tableData?.data.length
                ? tableData?.data.map((item: ItemType, idx: number) => {
                    return (
                      <tr key={idx} className="cursor-pointer">
                        <td>{item?.name}</td>
                        <th
                          className="view-data"
                          onClick={(e) => {
                            e.stopPropagation();
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
                  })
                : null}
            </tbody>
          </table>
        </div>
        {/* footer */}
        {tableData?.data.totalDocs > META.perPage - 2 && (
          <div className="table-footer">
            <div className="elms">
              <button
                disabled={!tableData?.data.hasPrevPage}
                className="btn"
                onClick={handlePrev}
              >
                Previous
              </button>

              <p>
                Page {tableData?.data.page} of {tableData?.data.totalPages}
              </p>

              <button
                disabled={!tableData?.data.hasNextPage}
                className="btn"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
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

      <UpdateData
        isOpen={isUpdating}
        toggleModal={toggleModal}
        page={page}
        updatedData={rowData}
      />

      <DeletedData
        isOpen={isDeleting}
        toggleModal={toggleModal}
        page={page}
        deleteData={rowData}
      />
    </>
  );
};
