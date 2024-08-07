//hooks
import { useState } from "react";
import { useLocation } from "react-router-dom";

import { GoEye } from "react-icons/go";

// helpers
import postReq from "../../helpers/postReq";
// react query
import { useQuery } from "react-query";

import { debounce } from "../../helpers/request";

//loading skeleton
import { LoadingSkeleton } from "./LoadingSkeleton";
// import { listProxies } from "../../pages/Proxy/fetchProxies";

// env
let VITE_ENV = import.meta.env.VITE_ENV;

// view table row
import ViewTableData from "./ViewTableData";

const META = {
  page: 1,
  perPage: 25,
};

const Table = () => {
  const [metaField, setMetaField] = useState({ ...META });
  const [filter, setFilter] = useState({
    search: "",
  });
  const location = useLocation();
  // toggle view data
  const [isOpen, setIsOpen] = useState(false);
  const [rowData, setRowData] = useState({});

  // get table data
  const handleTableData = async () => {
    // send req
    return await postReq(
      {
        page: metaField.page,
        perPage: metaField.perPage,
        filter: filter,
      },
      "/api/proxies"
    );
  };

  let queryKey = [location.pathname, metaField.page, filter.search, "proxies"];
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
    if (!tableData?.proxies.next) {
      // notif page end
      return;
    }

    // scroll to the header of table
    const tableHeaderScrollTo = document.querySelector("thead");
    tableHeaderScrollTo.scrollIntoView();

    // move page to next
    setMetaField((prev) => ({ ...prev, page: metaField.page + 1 }));
  };

  const handlePrev = () => {
    // check if page available
    if (!tableData?.proxies.previous) {
      // notif page end
      return;
    }

    // scroll to the header of table
    const tableHeaderScrollTo = document.querySelector("thead");
    tableHeaderScrollTo.scrollIntoView();

    // move page to next
    setMetaField((prev) => ({ ...prev, page: metaField.page - 1 }));
  };

  // handle search
  const handleSearch = (e) => {
    e.preventDefault();

    if (!filter.search) {
      return;
    }

    debounce()
      .then((res) => {
        if (res) {
          setMetaField((prev) => ({ ...prev, page: 1 }));
          getPaginate();
        }
      })
      .catch((err) => {
        if (VITE_ENV === "development") {
          console.log(err);
        }
      });
  };

  // open or close modal
  const toggleViewData = () => {
    setIsOpen(!isOpen);
  };

  // view row detail
  const ViewRowData = (idx) => {
    let { ...data } = tableData?.proxies.results[idx] || {};
    // get detail data
    setRowData(data);
    // open modal
    setIsOpen(true);
  };

  return (
    <>
      <section className="table-container">
        <div className={"table-header"}></div>
        <div className="overflow-x-auto ">
          {/* header */}

          {/* table */}
          <table className="table table-zebra ">
            {/* thead*/}
            {tableData?.proxies?.count ? (
              <thead>
                <tr>
                  <th>View</th>
                  <th>IP Address</th>
                  <th>Country</th>
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
                new Array(Number(META.perPage)).fill("").map((elm, idx) => {
                  return (
                    <tr key={idx}>
                      <LoadingSkeleton />
                    </tr>
                  );
                })}

              {/* error on nothing found */}
              {(error || tableData?.proxies?.count === 0) && (
                <>
                  <div className="nodata">
                    <img src="/img/nodata.svg" alt="no data found" />
                    <h3>No record found</h3>
                  </div>
                </>
              )}

              {/* user-data */}
              {tableData?.proxies?.count
                ? tableData?.proxies?.results.map((elm, idx) => {
                    return (
                      <tr key={idx}>
                        <th
                          className="view-data"
                          onClick={() => ViewRowData(idx)}
                        >
                          <GoEye />
                        </th>
                        <td>{elm?.proxy_address}</td>
                        <td>{elm?.country_code}</td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
        {/* footer */}
        {tableData?.proxies?.count > 0 && (
          <div className="table-footer">
            <div className="elms">
              <button
                disabled={!tableData?.proxies.previous}
                className="btn"
                onClick={handlePrev}
              >
                Previous
              </button>

              <p>
                Page {metaField.page} of{" "}
                {Math.ceil(
                  tableData.proxies.count / tableData.proxies.results.length
                )}
              </p>

              <button
                disabled={!tableData?.proxies.next}
                className="btn"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
      <ViewTableData
        data={rowData}
        isOpen={isOpen}
        toggleViewData={toggleViewData}
      />
    </>
  );
};

export default Table;
