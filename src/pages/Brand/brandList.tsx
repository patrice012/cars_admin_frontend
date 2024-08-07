import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// icons
import { BsPlusLg } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";

import postReq from "../../helpers/postReq";
import { useQuery } from "react-query";
// import { DeleteSite } from "./DeleteSite";
// import { CreateNewSite } from "./AddNew";
// import { UpdateSite } from "./UpdateSite";
// import { LoadingSkeleton } from "./Loading";
import AddNewBrand from "./addNewbrand";
import Brand from "../../models/brand.model";

const META = {
  title: "Site Data",
  description: "Site Data",
  perPage: 10,
  page: 1,
};

export const BrandList = () => {
  const [pageNumber, setPageNumber] = useState(META.page);
  const [removing, setRemoving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // toggle view data
  const [rowData, setRowData] = useState({});

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

  // get table data
  const handleTableData = async () => {
    // send req
    return await postReq({ page: pageNumber, perPage: META.perPage }, "brand");
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
    setRemoving(true);
  };

  // view site data
  const handleSiteKeywordDetail = async (brand: Brand) => {
    if (!brand._id) return;
    navigate(`/sites/${brand._id}`, { state: { ...brand } });
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
              {tableData?.docs ? (
                <p>{tableData?.totalDocs || tableData?.docs?.length} items</p>
              ) : null}
            </div>
          </div>

          {/* table */}
          <table className="table table-zebra mt-6">
            {/* thead*/}
            {tableData?.docs?.length || tableData ? (
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
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
              {(error || tableData?.docs?.length === 0) && (
                <>
                  <div className="nodata">
                    <img src="/img/nodata.svg" alt="no data found" />
                    <h3>No record found</h3>
                  </div>
                </>
              )}

              {/* user-data */}
              {tableData?.length
                ? tableData?.map((brand: Brand, idx: number) => {
                    return (
                      <tr key={idx} className="cursor-pointer">
                        <td>{brand?.title}</td>
                        <td>{brand?.description}</td>

                        <th
                          className="view-data"
                          onClick={(e) => {
                            e.stopPropagation();
                            UpdateRowData(brand);
                          }}
                        >
                          <RxUpdate />
                        </th>
                        <th
                          className="view-data"
                          onClick={(e) => {
                            e.stopPropagation();
                            DeleteRowData(brand._id);
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
        {tableData?.totalDocs > META.perPage - 2 && (
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
      <AddNewBrand isOpen={isCreating} toggleModal={toggleModal} />
      {/* <UpdateSite
        updateData={rowData}
        isOpen={isUpdating}
        toggleModal={toggleModal}
      />
      <DeleteSite
        data={rowData}
        isOpen={removing}
        toggleDeleteData={toggleDeleteData}
      /> */}
    </>
  );
};