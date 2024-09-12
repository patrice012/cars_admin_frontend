import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";

import postReq from "../../helpers/postReq";
import { useQuery } from "react-query";
import AddItem from "./addCar";
import PropTypes from "prop-types";
import Item from "../../models/item.model";
import Modal, {
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
import { Selectable, SelectableFilter } from "../../components/Selectable";
import Button from "../../components/Button";
import FileUpload from "../../components/FileUpload";
import TextAreaField from "../../components/TextAreaField";
import { IoClose } from "react-icons/io5";
import {
  defaultCarDoorsCount,
  defaultCarsYear,
  cylinders,
} from "../../helpers/constants";
import notif from "../../helpers/notif";
import { characsItemProps } from "../../helpers/types";

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
  const [addFilter, setAddFilter] = useState(false);
  const [check, setCheck] = useState(false);
  const [allSelected, setAllSelectedActive] = useState<boolean | null>(null);
  const [filterSelected, setFilterSelected] = useState<string | null>(null);

  const [filtre, setFiltre] = useState(null);

  const [data, setData] = useState({
    model: "",
    color: "",
    engine: "",
    transmission: "",
    fuel: "",
    city: "",
    seller: "",
    brand: "",
  });

  const [filtre2, setFiltre2] = useState<string | null>(null);

  const filtres = [
    { label: "all", value: null },
    { label: "active", value: true },
    { label: "inactive", value: false },
  ];

  const filtres2 = [
    { label: "brand", value: "brand" },
    { label: "model", value: "model" },
    { label: "seller", value: "seller" },
    { label: "color", value: "color" },
    { label: "city", value: "city" },
    { label: "engine", value: "engine" },
    { label: "transmission", value: "transmission" },
    { label: "fuel", value: "fuel" },
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

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleTableData = async () => {
    console.log(filtre);
    const result = await postReq({
      data: {
        page: pageNumber,
        perPage: META.perPage,
        search: debounce.trim(),
        isActive: filtre === "all" ? null : filtre,
        brand: data.brand,
        model: data.model,
        seller: data.seller,
        color: data.color,
        city: data.city,
        engine: data.engine,
        transmission: data.transmission,
        fuel: data.fuel,
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
    data,
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

  const handle = (item: string) => {
    if (item === "color") {
      setData({ ...data, color: "" });
    } else if (item === "engine") {
      setData({ ...data, engine: "" });
    } else if (item === "model") {
      setData({ ...data, model: "" });
    } else if (item === "transmission") {
      setData({ ...data, transmission: "" });
    } else if (item === "fuel") {
      setData({ ...data, fuel: "" });
    } else if (item === "city") {
      setData({ ...data, city: "" });
    } else if (item === "seller") {
      setData({ ...data, seller: "" });
    } else if (item === "brand") {
      setData({ ...data, brand: "" });
    }
  };

  return (
    <>
      <section className="table-container">
        <div className="site--container">
          {/* user-data */}
          <div className="flex flex-col items-center justify-between ">
            <div className="flex items-center justify-between w-full">
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
              <div className="flex gap-[24px] items-center">
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

                {filterSelected && (
                  <button
                    style={{ background: "#ca8a04" }}
                    onClick={() => {
                      setData({
                        model: "",
                        color: "",
                        engine: "",
                        transmission: "",
                        fuel: "",
                        city: "",
                        seller: "",
                        brand: "",
                      });
                      setFiltre2(null);
                    }}
                    className="btn border-0 btn-square">
                    <CloseCircle color="white" />
                  </button>
                )}

                <Selectable
                  items={filtres2.map((item: any) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                  onChange={(e) => {
                    setFiltre2(e.target.value);
                    setAddFilter(true);
                    setPageNumber(1);
                  }}
                  title=""
                  selected={filtre2 ? filtre2 : ""}
                />

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
            <div className="flex justify-center items-center gap-[20px]">
              {Object.entries(data).map(([key, value]) => {
                if (value) {
                  return (
                    <>
                      <div className="relative">
                        <button
                          className="bg-[red] p-1 rounded-full absolute right-[-5px] bottom-[20px]"
                          key={key}
                          onClick={() => {
                            handle(key);
                          }}>
                          <IoClose color="white" size={15} />
                        </button>
                        <button
                          className="py-1 px-4 bg-[#2563eb] rounded-md text-[#fff]"
                          key={key}>
                          {key}
                        </button>
                      </div>
                    </>
                  );
                }
                return null;
              })}

              {data.brand ||
              data.city ||
              data.color ||
              data.engine ||
              data.fuel ||
              data.model ||
              data.seller ||
              data.transmission ? (
                <button
                  className="py-2 px-2 bg-[#ca8a04] rounded-md text-[#fff]"
                  onClick={() => {
                    setData({
                      model: "",
                      color: "",
                      engine: "",
                      transmission: "",
                      fuel: "",
                      city: "",
                      seller: "",
                      brand: "",
                    });
                    setFiltre2(null);
                  }}>
                  <CloseCircle color="white" size={20} />
                </button>
              ) : (
                ""
              )}
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

      {filtre2 && addFilter && (
        <AddFilter
          isOpen={addFilter}
          close={setAddFilter}
          item={filtre2}
          seleted={data}
          setSelected={setData}
        />
      )}
    </>
  );
};
function clg(check: boolean) {
  throw new Error("Function not implemented.");
}

interface AddItemProps {
  isOpen: boolean;
  close: any;
  item: string;
  seleted: {
    model: string;
    color: string;
    engine: string;
    transmission: string;
    fuel: string;
    city: string;
    seller: string;
    brand: string;
  };
  setSelected: any;
}

const AddFilter: React.FC<AddItemProps> = ({
  isOpen,
  close,
  item,
  seleted,
  setSelected,
}) => {
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];

  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");
  const [models, setModels] = useState([]);

  const fetchData = async (
    uri: string,
    setState: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    console.log(uri);
    let url = "";
    if (uri === "color") {
      url = "colors";
    } else if (uri === "engine") {
      url = "engine_type";
    } else if (uri === "model") {
      url = "model";
    } else if (uri === "transmission") {
      url = "transmission";
    } else if (uri === "fuel") {
      url = "fuel_type";
    } else if (uri === "title") {
      url = "title";
    } else if (uri === "city") {
      url = "city";
    } else if (uri === "seller") {
      url = "seller";
    } else if (uri === "brand") {
      url = "brand";
    }
    console.log(url);
    const result = await postReq({
      data: {},
      url,
      extras,
    });
    if (result.status === 200) {
      setState(result.data.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {};

  const closeModal = (state: boolean) => {
    setWarning("");

    close(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Filter Item"
      warning={warning}
      closeModal={() => closeModal(false)}>
      <form onSubmit={handleSubmit}>
        <Selectable
          items={models.map((ele: characsItemProps) => ({
            label: item == "seller" ? ele.firstname : ele.name,
            value: ele._id,
          }))}
          onOpen={() => !models.length && fetchData(item, setModels)}
          onChange={(e) => {
            if (item === "color") {
              setSelected({ ...seleted, color: e.target.value }), close(false);
            } else if (item === "engine") {
              setSelected({ ...seleted, engine: e.target.value }), close(false);
            } else if (item === "model") {
              setSelected({ ...seleted, model: e.target.value }), close(false);
            } else if (item === "transmission") {
              setSelected({ ...seleted, transmission: e.target.value }),
                close(false);
            } else if (item === "fuel") {
              setSelected({ ...seleted, fuel: e.target.value }), close(false);
            } else if (item === "title") {
              setSelected({ ...seleted, title: e.target.value }), close(false);
            } else if (item === "city") {
              setSelected({ ...seleted, city: e.target.value }), close(false);
            } else if (item === "seller") {
              setSelected({ ...seleted, seller: e.target.value }), close(false);
            } else if (item === "brand") {
              setSelected({ ...seleted, brand: e.target.value }), close(false);
            }
          }}
          title={`filter ${item}`}
          selected=""
        />
      </form>
    </Modal>
  );
};
