export const ItemList = () => {
    // your existing states, queries, and functions
  
    // Filter the tableData based on the 'filtre' value
    const filteredData = tableData?.data.filter((item: Item) => {
      if (filtre === "all") return true; // Show all items
      if (filtre === "active") return item.isActive === true; // Show active items
      if (filtre === "inactive") return item.isActive === false; // Show inactive items
    });
  
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
                {filteredData ? (
                  <p>{filteredData.length || tableData?.length} item(s)</p>
                ) : null}
              </div>
              <div className="flex gap-[24px]">
                {deleteList.length > 0 ? (
                  <>
                    <button
                      style={{ background: "#2563eb" }}
                      onClick={() => setDeactivatingMany(true)}
                      className="btn border-0 btn-square"
                    >
                      <CloseCircle color="white" />
                    </button>
                    <button
                      style={{ background: "red" }}
                      onClick={() => setRemovingMany(true)}
                      className="btn border-0 btn-square"
                    >
                      <Trash color="white" />
                    </button>
                  </>
                ) : (
                  ""
                )}
  
                <Selectable
                  items={filtres.map((item: string) => ({
                    label: item,
                    value: item,
                  }))}
                  onChange={(e) => setFiltre(e.target.value)}
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
              {filteredData?.length ? (
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
                {tableLoading &&
                  new Array(Number(4)).fill("").map((elm, idx) => {
                    return <tr key={idx}>{<LoadingSkeleton />}</tr>;
                  })}
  
                {error || filteredData?.length === 0 ? (
                  <div className="nodata ">
                    <img src="/img/nodata.svg" alt="no data found" />
                    <h3>No record found</h3>
                  </div>
                ) : null}
  
                {filteredData?.map((item: Item, idx: number) => (
                  <tr
                    key={idx}
                    onClick={() => handleSiteKeywordDetail(item)}
                    className="cursor-pointer items-center"
                  >
                    <td>
                      <input
                        type="checkbox"
                        className=" items-start justify-start flex"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        checked={deleteList.includes(item._id)}
                        onChange={() => handleDelete(item?._id)}
                      />
                    </td>
                    <td>{item?.name}</td>
                    <td>{item.brand?.name}</td>
                    <td>{item.model?.name}</td>
                    <td>{item.seller?.firstname}</td>
                    <td>{item?.salesPrice}</td>
                    <td>{item?.isActive ? "yes" : "No"}</td>
                    <th
                      className="view-data"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                        setIsUpdating(true);
                      }}
                    >
                      <RxUpdate color="blue" />
                    </th>
                    <th
                      className="view-data"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(item._id);
                        setRemoving(true);
                      }}
                    >
                      <MdDeleteOutline color="red" />
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* other modals */}
      </>
    );
  };
  