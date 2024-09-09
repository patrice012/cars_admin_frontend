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
import { DeleteModal } from "../../components/Modal";
import UpdateItem from "./updateCar";
import { ClipLoader } from "react-spinners";
import { LoadingSkeleton } from "../../components/Table/LoadingSkeleton";
import InputField from "../../components/InputField";

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
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedITem, setSelectedItem] = useState<Item>();
  const [search, setSearch] = useState("");
  const [debounce, setDebounce] = useState(search);

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
    const result = await postReq({
      data: {
        page: pageNumber,
        perPage: META.perPage,
        search: debounce.trim(),
      },
      url: "car/in-admin",
    });
    console.log(result);
    if (result.status == 200) {
      const data = result.data;
      return data;
    }
  };

  let queryKey = [location.pathname, pageNumber,  debounce, "sites-list"];
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
            <InputField
              label=""
              id="title"
              type="text"
              placeholder="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* table */}
          <table className="table table-zebra mt-6">
            {/* thead*/}
            {tableData?.data.length || tableData ? (
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Seller</th>
                  <th>Sales Price</th>
                  <th>Min Price</th>
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
                    className="cursor-pointer">
                    <td>{item.name}</td>
                    <td>{item.brandId.name}</td>
                    <td>{item.modelId.name}</td>
                    <td>{item.sellerId.firstname}</td>
                    <td>{item.salesPrice}</td>
                    <td>{item.minPrice}</td>
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
    </>
  );
};
