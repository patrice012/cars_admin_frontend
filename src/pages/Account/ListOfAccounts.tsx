// hooks
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "react-query";
import postReq from "../../helpers/postReq";
import { LoadingSkeleton } from "../../components/Table/LoadingSkeleton";
import { BsPlusLg, BsTrash } from "react-icons/bs";
import { useSession } from "../../contexts/authContext";
import { IUser } from "../../helpers/types";
import notif from "../../helpers/notif";

const AccountList = () => {
  const { session } = useSession();
  const tableConf = { perPage: "7", target: "user-data" };
  const [pageNumber, setPageNumber] = useState("1");
  const [searchKeyword, setSearchKeyword] = useState("");

  const location = useLocation();

  const handleTableData = async () => {
    const result = await postReq({
      data: {
        page: pageNumber,
        perPage: tableConf.perPage,
        searchKeyword,
        target: tableConf.target,
      },
      url: "user/admin",
      extras: [{ key: "authorization", value: "Bearer " + session }],
    });
    console.log(result);
    if (result.status == 200) return result.data;
  };

  const {
    data: tableData,
    isLoading: tableLoading,
    error,
    refetch: getPaginate,
  } = useQuery(
    [location.pathname, pageNumber, searchKeyword],
    handleTableData,
    {
      refetchOnWindowFocus: false,
      enabled: true,
    }
  );
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

  const [removing, setRemoving] = useState(false);

  const toggleModal = () => {
    setRemoving((prev) => !prev);
  };

  // const checkConfirmation = (index) => {
  //   if (index) {
  //     handleRemove(index);
  //     toggleModal();
  //   } else {
  //     toggleModal();
  //   }
  // };

  // remove items
  const handleRemoveAccount = async (id: string, target: any) => {
    const targetId = id;

    if (!targetId) {
      return notif("error removing item, retry later");
    }

    setRemoving(true);

    const reqData = {
      _id: targetId.trim(),
    };

    // sending request
    try {
      const url = "user/delete";
      const response = await postReq({ data: reqData, url });
      console.log(response, 'response')
      // set data
      if (response?.status != 400) {
        setRemoving(false);

        // show success message
        notif("removed successfully");

        // refresh table
        getPaginate();
      } else {
        notif("failed to remove admin");
      }
    } catch (err) {
      console.log(err, "err remove admin");
      setRemoving(false);
    }
  };

  return (
    <>
      <section className="table-container account-list">
        <div
          style={{ position: "relative" }}
          className={
            tableConf && tableConf.target !== "user-data"
              ? "table-header expand-search"
              : "table-header"
          }
        >
          {/* user-data */}
          {tableConf && tableConf.target === "user-data" && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
              }}
              className="actions "
            >
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
            tableData?.length ? (
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
                  .map((user, idx) => {
                    return (
                      <tr key={idx}>
                        <LoadingSkeleton />
                      </tr>
                    );
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
              {tableData?.length && tableConf.target === "user-data"
                ? tableData?.map((user: IUser, idx: number) => {
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{user?.username}</td>
                        <td>{user?.email}</td>

                        <td>
                          {user.createdAt
                            ? new Date(user?.createdAt!).toLocaleString()
                            : "Not defined"}
                        </td>
                        <td>
                          <button
                            className="btn btn--delete"
                            onClick={() => handleRemoveAccount(user?._id)}
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
        {tableData?.length < 0 && (
          <div className="table-footer">
            <div className="users flex">
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
      {/* {removing && (
        <DeleteModalConfirmation
          isDeleting={removing}
          toggleModal={toggleModal}
          checkConfirmation={checkConfirmation}
          index={index}
        />
      )} */}
    </>
  );
};

export default AccountList;
