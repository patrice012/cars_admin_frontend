import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReactSVG } from "react-svg";
// icons
import { BsPlusLg } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";

import postReq from "../../helpers/postReq";
import { useQuery } from "react-query";
import AddNewBrand from "./addNewbrand";
import { DeleteManyModal, DeleteModal } from "../../components/Modal";
import { useSession } from "../../contexts/authContext";
import UpdateBrand from "./updateBrand";
import { LoadingSkeleton } from "../../components/Table/LoadingSkeleton";
import { Brand } from "../../models/brand.model";
import { Trash } from "iconsax-react";
import InputField from "../../components/InputField";
import Item from "../../models/item.model";

const META = {
  title: "Site Data",
  description: "Site Data",
  perPage: 10,
  page: 1,
};

export const BrandList = () => {
  const { session } = useSession();
  const [pageNumber, setPageNumber] = useState(META.page);
  const [removing, setRemoving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<Brand>();
  const location = useLocation();
  const [removingMany, setRemovingMany] = useState(false);
  const [search, setSearch] = useState("");
  const [debounce, setDebounce] = useState(search);
  const [deleteList, setDeleteList] = useState([]);
  const [DisableList, setDisableList] = useState([]);
  const [check, setCheck] = useState(false);

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
      url: "brand",
      extras: [{ key: "authorization", value: `Bearer ${session}` }],
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
              {tableData ? <p>{tableData?.totalCount} items</p> : null}
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
                  <th>Logo</th>
                  <th>Title</th>
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
              {tableData?.data.length
                ? tableData?.data.map((brand: Brand, idx: number) => {
                    return (
                      <tr key={idx} className="cursor-pointer">
                        <td>
                          <input
                            type="checkbox"
                            className=" items-start justify-start flex"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            checked={deleteList.includes(brand?._id)}
                            onChange={(e) => {
                              handleDelete(brand?._id);
                            }}
                          />
                        </td>
                        <img
                          className="pl-3"
                          width={40}
                          height={40}
                          src={brand?.logo}
                        />
                        <td>{brand?.name}</td>
                        <th
                          className="view-data"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(brand._id);
                            setSelectedBrand(brand);
                            setIsUpdating(true);
                          }}
                        >
                          <RxUpdate />
                        </th>
                        <th
                          className="view-data"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(brand._id);
                            setRemoving(true);
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
      </section>
      {isCreating && (
        <AddNewBrand isOpen={isCreating} toggleModal={toggleModal} />
      )}
      {isUpdating && (
        <UpdateBrand
          brand={selectedBrand!}
          isOpen={isUpdating}
          toggleModal={() => toggleModal({ state: true, action: "update" })}
        />
      )}
      {removingMany && (
        <DeleteManyModal
          deleteItem={toggleDeleteManyData}
          _id={deleteList}
          url="brand/delete-many"
          isOpen={removingMany}
          setDelete={setDeleteList}
          closeModal={() => setRemovingMany(!removingMany)}
        />
      )}

      {removing && (
        <DeleteModal
          deleteItem={toggleDeleteData}
          _id={selectedId}
          url="brand/delete"
          isOpen={removing}
          closeModal={() => setRemoving(!removing)}
        />
      )}
    </>
  );
};
