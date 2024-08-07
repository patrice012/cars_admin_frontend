import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// icons
import { BsPlusLg } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegStopCircle } from "react-icons/fa";
import { VscDebugStart } from "react-icons/vsc";
import { MdOutlineDelete } from "react-icons/md";

import postReq from "../../helpers/postReq";
import { useQuery } from "react-query";
import { DeleteSite } from "./DeleteSite";
import { CreateNewKwargs } from "./AddNewKwargs";
import { UpdateSite } from "./UpdateSite";
import { SectionLoadingSkeleton } from "./Loading";
import Error from "./ReqError";
import notif from "../../helpers/notif";

function SiteKeyword({ siteId, setHeaderStatus }) {
  const [removing, setRemoving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionData, setActionData] = useState({});
  const location = useLocation();

  const [siteData, setSiteData] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    setHeaderStatus(status);
  }, [status]);

  console.log(status, "status");

  const handleStart = async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();

      const data = {
        siteData: {
          siteName: siteData?.name || "",
          siteUrl: siteData.url || "",
          visit: siteData.visit || 0,
          click: siteData.click || 0,
          status: status === "stop" ? "start" : "stop",
          keywords: {
            targetK: firstGroupQuery.data?.docs?.urls || [],
            randomK: secondGroupQuery.data?.docs?.urls || [],
          },
        },
      };

      console.log(data, "data btn");

      const res = await postReq(
        { siteId: siteId, status: data.siteData.status },
        "/api/site/status"
      );

      console.log(res);
      if (res.code != "ok") {
        notif(res.message ?? "Somethings went wrong");
        return;
      } else {
        refetchSite();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get table data
  const handleSiteURLData = async (groupId) => {
    // send req
    return await postReq({ siteId: siteId, groupId }, "/api/site-url/list");
  };

  const firstGroupQuery = useQuery(
    [location.pathname, "sites-list-first"],
    () => handleSiteURLData("1"),
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  const secondGroupQuery = useQuery(
    [location.pathname, "sites-list-second"],
    () => handleSiteURLData("2"),
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  const [refechSite, setRefechSite] = useState(true);

  const refetchSite = () => {
    setRefechSite(true);
    setTimeout(() => {
      setRefechSite(false);
    }, 2000);
  };

  useEffect(() => {
    refetchSite();
  }, []);

  const handleSiteData = async () => {
    try {
      const res = await postReq({ siteId: siteId }, "/api/site/get");
      if (res.code === "ok") {
        // setSiteData({ ...res.data });
        return res.data;
      }
      return { data: {} };
    } catch (error) {
      console.log(error, "error");
    }
  };

  const getSiteQuery = useQuery(
    [location.pathname, "sites"],
    () => handleSiteData(),
    {
      enabled: refechSite,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        setSiteData({ ...res });
      },
    }
  );

  useEffect(() => {
    if (getSiteQuery.isSuccess) {
      setSiteData({ ...getSiteQuery.data });
      setStatus(getSiteQuery.data.status);
    }
  }, [getSiteQuery.isSuccess]);

  const toggleModal = ({
    state = true,
    action = "create",
    groupId = "1",
    kwargs = {},
  }) => {
    if (action === "create") {
      setIsCreating((prev) => !prev);
    } else if (action === "update") {
      setIsUpdating((prev) => !prev);
    }
    // update location state with groupId, used in create new keyword, update keyword
    location.state = { ...location.state, groupId };

    if (state && action === "create" && Object.keys(kwargs).length > 0) {
      let key = kwargs?.refechKey;

      if (key === "1") {
        console.log("refetching 1 after creation");
        firstGroupQuery.refetch();
      } else if (key === "2") {
        console.log("refetching 2 after creation");
        secondGroupQuery.refetch();
      }
    }

    if (state && action === "update" && Object.keys(kwargs).length > 0) {
      let name = kwargs?.name;
      let { usr } = window.history.state;

      usr = { ...usr, name };
      window.history.pushState(
        { ...window.history.state, usr },
        "",
        location.pathname
      );

      // add fallback because the page will not reload
      document.querySelector(".page-title .title").innerText = name;
    }
  };

  const toggleDeleteData = (state) => {
    setRemoving(!removing);
    if (state) {
      // getPaginate();
    }
  };

  // update row data
  const handleSiteUpdate = (data) => {
    // get detail data
    // console.log(data);
    setActionData({ ...data });
    // open modal
    toggleModal({ state: true, action: "update" });
  };

  // delete row data
  const handleDeleteSite = (id) => {
    // get detail data
    setActionData({ _id: id });
    // open modal
    setRemoving(true);
  };

  const [visit, setVisite] = useState();
  const [click, setClick] = useState();

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();

      console.log(visit, click);

      const res = await postReq(
        { siteId: siteId, click: click, visit: visit },
        "/api/site/form"
      );

      if (res.code != "ok") {
        notif(res.message ?? "Somethings went wrong");
        return;
      } else {
        notif(res.message ?? "Success");
        refetchSite();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSiteKeywordDelete = async (keyword, siteKwId, groupId) => {
    try {
      // console.log(keyword);
      const res = await postReq(
        { siteId: siteId, id: siteKwId, keyword: keyword },
        "/api/site-url/delete"
      );

      if (res.code != "ok") {
        notif(res.message ?? "Fail to delete object");
        return;
      }

      notif(res.messgae ?? "Object deleted successfully");

      if (groupId === "1") {
        console.log("refetching 1 after deletion");
        firstGroupQuery.refetch();
      } else if (groupId === "2") {
        console.log("refetching 2 after deletion");
        secondGroupQuery.refetch();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <>
      <div className="content-site">
        <div className="flex flex-col gap-5 m-5 ">
          <span>Target Keywords</span>
          <div className="site--container">
            <div className="wrapper-btn">
              <div className="actions flex items-center justify-start gap-8">
                <button
                  onClick={() =>
                    toggleModal({
                      action: "create",
                      groupId: firstGroupQuery.data?.docs?.groupId || "1",
                    })
                  }
                  className="btn btn-primary flex items-center justify-center gap-2"
                >
                  <BsPlusLg /> <p>Add new</p>
                </button>
              </div>
            </div>
          </div>

          <div className="">
            {firstGroupQuery.isError ? (
              <div className="mt-4">
                <Error />
              </div>
            ) : (
              <ul>
                {firstGroupQuery.isLoading &&
                  Array(4)
                    .fill("")
                    .map((_, index) => (
                      <li key={index} className="py-2">
                        <SectionLoadingSkeleton />
                      </li>
                    ))}
                {firstGroupQuery.isSuccess &&
                  firstGroupQuery.data?.docs?.urls?.map((keyword, index) => (
                    <li key={index} className="py-4 flex justify-between">
                      <span>{keyword}</span>
                      <button
                        onClick={() =>
                          handleSiteKeywordDelete(
                            keyword,
                            firstGroupQuery.data?.docs?._id,
                            firstGroupQuery.data?.docs?.groupId
                          )
                        }
                      >
                        <MdOutlineDelete className="text-xl hover:fill-red-500 transition-all" />
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-5 m-5 border-l-2 border-[#e3eaf4] pl-8">
          <span>Random Keywords</span>
          <div className="site--container">
            <div className="wrapper-btn">
              <div className="actions flex items-center justify-start gap-8">
                <button
                  onClick={() =>
                    toggleModal({
                      action: "create",
                      groupId: secondGroupQuery.data?.docs?.groupId || "2",
                    })
                  }
                  className="btn btn-primary flex items-center justify-center gap-2"
                >
                  <BsPlusLg /> <p>Add new</p>
                </button>
              </div>
            </div>
          </div>
          <div>
            <ul>
              {secondGroupQuery.isError ? (
                <div className="mt-4">
                  <Error />
                </div>
              ) : (
                <ul className="overflow-y-auto">
                  {secondGroupQuery.isLoading &&
                    Array(4)
                      .fill("")
                      .map((_, index) => (
                        <li key={index} className="py-2">
                          <SectionLoadingSkeleton />
                        </li>
                      ))}
                  {secondGroupQuery.isSuccess &&
                    secondGroupQuery.data?.docs?.urls?.map((keyword, index) => (
                      <li key={index} className="py-4 flex justify-between">
                        <span>{keyword}</span>
                        <button
                          onClick={() =>
                            handleSiteKeywordDelete(
                              keyword,
                              secondGroupQuery.data?.docs?._id,
                              secondGroupQuery.data?.docs?.groupId
                            )
                          }
                        >
                          <MdOutlineDelete className="text-xl hover:fill-red-500 transition-all" />
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </ul>
          </div>
        </div>
        <div className="border-l-2 border-[#e3eaf4] pl-4 m-5 ml-0">
          <div className="flex flex-col gap-10 bg-[#c6d3e5] rounded-lg items-center p-10">
            <div className="">
              <div className="wrapper-btn">
                <div className="actions flex items-center justify-start gap-8">
                  <button
                    onClick={(e) => {
                      status === "start" && setStatus("stop");
                      status === "stop" && setStatus("start");

                      handleStart(e);
                    }}
                    className="btn btn-accent flex items-center justify-center gap-2"
                  >
                    {status === "start" ? (
                      <>
                        <FaRegStopCircle />
                        <span>stop</span>
                      </>
                    ) : (
                      <>
                        <VscDebugStart />
                        <span>Start</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="">
              <div className="wrapper-btn">
                <div className="actions flex items-center justify-start gap-8">
                  <button
                    onClick={() => handleSiteUpdate(data)}
                    className="btn btn-info flex items-center justify-center gap-2"
                  >
                    <RxUpdate /> <span>Update</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="">
              <div className="wrapper-btn">
                <div className="actions flex items-center justify-start gap-8">
                  <button
                    onClick={() => handleDeleteSite(data._id)}
                    className="btn btn-error flex items-center justify-center gap-2"
                  >
                    <MdDeleteOutline /> <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-7">
            <form
              onSubmit={handleFormSubmit}
              method="POST"
              className="space-y-1"
              id="percentageForm"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="percentageInput">Visits</label>
                <div className="border-2 border-gray-500 border-solid rounded-[.3rem] flex">
                  <input
                    type="text"
                    id="percentageInput"
                    placeholder="5"
                    name="percentageInput"
                    required
                    value={visit ?? siteData?.visit}
                    onChange={(e) => setVisite(e.target.value)}
                    className="pl-3 p-1 outline-none border-none"
                  />
                </div>

                <label htmlFor="percentageInput">Clicks</label>
                <div className="border-2 border-gray-500 border-solid rounded-[.3rem] flex">
                  <input
                    type="text"
                    id="percentageInput"
                    placeholder="5"
                    name="percentageInput"
                    required
                    value={click ?? siteData?.click}
                    onChange={(e) => setClick(e.target.value)}
                    className="pl-3 p-1 outline-none border-none"
                  />
                </div>

                <button className="bg-teal-300 py-1 px-2 rounded-[.3rem] flex self-center mt-5">
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <CreateNewKwargs isOpen={isCreating} toggleModal={toggleModal} />
      <UpdateSite
        updateData={actionData}
        isOpen={isUpdating}
        toggleModal={toggleModal}
      />
      <DeleteSite
        data={actionData}
        isOpen={removing}
        toggleDeleteData={toggleDeleteData}
      />
    </>
  );
}

export default SiteKeyword;
