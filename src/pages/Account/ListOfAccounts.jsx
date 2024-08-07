// hooks
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "react-query";
// helpers
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";
// components
import { LoadingSkeleton } from "../../components/Table/LoadingSkeleton";
// icons
import { BsPlusLg, BsTrash } from "react-icons/bs";

import { DeleteModalConfirmation } from "./deletionModal";
// env
let REACT_APP_DOMAIN = import.meta.env.VITE_REACT_APP_DOMAIN;
let VITE_ENV = import.meta.env.VITE_ENV;

const AccountList = () => {
  // pagination option
  const tableConf = { perPage: "7", target: "user-data" };
  // state provider
  const [pageNumber, setPageNumber] = useState("1");
  const [searchKeyword, setSearchKeyword] = useState("");

  const location = useLocation();

  // get table data
  const handleTableData = async () => {
    // send req
    return await postReq(
      {
        page: pageNumber,
        perPage: tableConf.perPage,
        searchKeyword,
        target: tableConf.target,
      },
      "/api/account"
    );
  };

  const {
    data: tableData,
    isLoading: tableLoading,
    error,
    refetch: getPaginate,
  } = useQuery(
    [location.pathname, pageNumber, searchKeyword, tableConf.refresh],
    handleTableData,
    {
      refetchOnWindowFocus: false,
      enabled: true,
    }
  );

  console.log(tableData);

  //  handle next and prev
  const handleNext = () => {
    // check if page available
    if (!tableData?.hasNextPage) {
      // notif page end
      return;
    }

    // move page to next
    setPageNumber(tableData?.nextPage);
  };

  const handlePrev = () => {
    // check if page available
    if (!tableData?.hasPrevPage) {
      // notif page end
      return;
    }

    // move page to next
    setPageNumber(tableData?.prevPage);
  };

  // handle search
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchKeyword) {
      return;
    }

    setPageNumber("1");
    getPaginate();
  };

  const [index, setIndex] = useState(null);

  const handleRemoveAccount = (idx) => {
    toggleModal();
    setIndex(idx);
  };

  const [removing, setRemoving] = useState(false);

  const toggleModal = () => {
    setRemoving((prev) => !prev);
  };

  const checkConfirmation = (index) => {
    if (index) {
      handleRemove(index);
      toggleModal();
    } else {
      toggleModal();
    }
  };

  // remove items
  const handleRemove = async (id, target = "account-data") => {
    const targetId = id;

    if (!targetId) {
      return notif("error removing item, retry later");
    }

    setRemoving(true);

    const reqData = {
      id: targetId.trim(),
      target: target.trim(),
    };

    // sending request
    try {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append("GET", "POST", "OPTIONS");
      headers.append("Access-Control-Allow-Origin", `${REACT_APP_DOMAIN}`);
      headers.append("Access-Control-Allow-Credentials", "true");

      const response = await fetch(`${REACT_APP_DOMAIN}/api/account/delete`, {
        mode: "cors",
        method: "POST",
        headers: headers,
        body: JSON.stringify(reqData),
        credentials: "include",
      });

      const serverMessage = await response.json();

      if (serverMessage.code === "500") {
        if (VITE_ENV === "development") {
          console.log(serverMessage.message);
        }
      }

      // set data
      if (serverMessage.code === "ok") {
        setRemoving(false);

        // show success message
        notif("removed successfully");

        // refresh table
        getPaginate();
      }
    } catch (err) {
      if (VITE_ENV === "development") {
        console.log(err);
      }
      setRemoving(false);
    }
  };

  return (
    <>
      <section className="table-container account-list">
        <div
          className={
            tableConf && tableConf.target !== "user-data"
              ? "table-header expand-search"
              : "table-header"
          }
        >
          {/* user-data */}
          {tableConf && tableConf.target === "user-data" && (
            <div className="actions">
              <Link to={"/account/new-account"} className="btn btn-primary">
                <BsPlusLg /> <p>Add new Admin</p>
              </Link>
              {tableData?.totalDocs ? (
                <p>
                  {" "}
                  {tableData?.totalDocs}{" "}
                  {tableData?.totalDocs > 1 ? "accounts" : "account"}
                </p>
              ) : null}
            </div>
          )}
        </div>
        <div className="overflow-x-auto ">
          {/* header */}

          {/* table */}
          <table className="table table-zebra ">
            {/* thead*/}
            {tableConf &&
            tableConf.target === "user-data" &&
            tableData?.docs?.length ? (
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Entry date</th>
                  <th>Delete account</th>
                </tr>
              </thead>
            ) : (
              <thead>
                <tr>
                  <th>Accounts</th>
                  <th></th>
                </tr>
              </thead>
            )}

            <tbody>
              {/* loading */}
              {tableLoading &&
                new Array(Number(tableConf.perPage))
                  .fill("")
                  .map((elm, idx) => {
                    return (
                      <tr key={idx}>
                        <LoadingSkeleton />
                      </tr>
                    );
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
              {tableData?.docs?.length && tableConf.target === "user-data"
                ? tableData?.docs?.map((elm, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{elm?.username}</td>
                        <td>{elm?.email}</td>

                        <td>{new Date(elm?.createdAt).toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn--delete"
                            onClick={() => handleRemoveAccount(elm?._id)}
                          >
                            <BsTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
        {/* footer */}
        {tableData?.docs?.length > 0 && (
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
      {removing && (
        <DeleteModalConfirmation
          isDeleting={removing}
          toggleModal={toggleModal}
          checkConfirmation={checkConfirmation}
          warning={{
            message: "Are you sure you want to delete this account?",
          }}
          index={index}
        />
      )}
    </>
  );
};

export default AccountList;
