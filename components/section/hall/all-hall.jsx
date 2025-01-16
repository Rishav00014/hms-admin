"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { createHall, fetchHall, deleteHall } from "@/lib/redux/slice/hall-slice";
import { useEffect, useState } from "react";
import moment from "moment";

import AddTrolley from "@/components/section/AddHall";
import LineLoader from "@/components/loader/line_loader";
import { errorToast, successToast } from "@/utils/toastMessage";

const AllHall = ({
  hallId = null,
  hallDetails = {},
  modalStatus = false,
  page = 1,
  location = null,
  date = null,
}) => {
  const [currentPage, setCurrentPage] = useState(page);
  const [isAddHall, setIsAddHall] = useState(false);
  const {
    dataLoading,
    loading,
    pagination,
    requestList = [],
  } = useSelector((state) => state.hall);
  const token = Cookies.get("access_token");
  const dispatch = useDispatch();

  const handlePagination = (count) => {
    dispatch(fetchHall({ token, currentPage: count }));
    setCurrentPage(count);
  };
  const addHall = async (data, id) => {
    const resultAction = dispatch(
      createHall({
        token,
        data,
        id,
      })
    );

    if (createHall.fulfilled.match(resultAction)) {
      setIsAddHall(false);
      if (id) {
        successToast("Hall updated");
      }
      dispatch(fetchTrolley({ token }));
      router.replace("/hall");
    } else {
      const message = resultAction.payload;
      errorToast(message);
    }
  };

  const deleteHallById = async (id) => {
    const isDelete = confirm("Are you sure want to delete this Trolley?");

    if (!isDelete) {
      return;
    }
    const resultAction = dispatch(
      deleteHall({
        token,
        id,
      })
    );
    if (deleteHall.fulfilled.match(resultAction)) {
      if (id) {
        successToast("Trolley deleted");
        router.replace("/hall");
      }
      dispatch(fetchTrolley({ token }));
    } else {
      const message = resultAction.payload;
      errorToast(message);
    }
  };
  useEffect(() => {
    token && dispatch(fetchHall({ token }));
    return () => { };
  }, [token]);

  useEffect(() => {
    modalStatus && setIsAddHall(modalStatus);
    return () => { };
  }, [modalStatus]);

  return (
    <section className="text-gray-600">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center text-sm text-gray-50 w-full bg-blue-400 px-8 py-4 rounded-xl">
        <div className="">
          <h1 className="font-bold  text-4xl pb-2">
            Add New Hall
          </h1>
          <p>Streamline Your Event Today</p>
        </div>
        <Link
          href="/hall/add"
          className={`bg-orange-400 font-bold px-4 py-2 h-fit rounded-lg`}
        >
          Add Trolley
        </Link>
      </div>
      <div className="w-full bg-white rounded-xl mt-6 pb-6 shadow">
        {!dataLoading && requestList?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full font-medium text-nowrap">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="text-left font-medium  px-4 py-3">Hall</th>
                  <th className="text-left font-medium px-4 py-3">Created date</th>
                  <th className="text-left font-medium  px-4 py-3">Supervisor</th>
                  <th className="text-left font-medium  px-4 py-3">Phone No.</th>
                  <th className="text-left font-medium  px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {requestList.map((hallInfo, index) => {
                  const {
                    _id,
                    createdAt,
                    hallNumber,
                    supervisor = {},
                  } = hallInfo;
                  const date = moment(createdAt).format("D MMM YY");
                  return (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">{hallNumber}</td>
                      <td className="px-4 py-3 text-left">{date}</td>
                      <td className="px-4 py-3 text-left">{supervisor?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-left">{supervisor?.phoneNo || "N/A"}</td>
                      <td className="px-4 py-3 flex items-center justify-center">
                        <div className="border py-1.5 w-fit rounded-full px-4">
                          <Link
                            href={
                              `/hall/update/${_id}?details=${JSON.stringify(
                                hallInfo
                              )}`
                            }

                          >
                            <i className="ri-edit-box-line ri-lg border-r pe-2"></i>
                          </Link>
                          <button
                            onClick={() => deleteHallById(_id)}
                          >
                            <i className="ri-delete-bin-6-line ri-lg text-red-400 ps-2"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* loader if loading  */}
        {dataLoading && (
          <div className="w-full min-h-[50vh] p-10 rounded-xl  bg-white flex flex-col items-center justify-center">
            <LineLoader bg="bg-gray-300" />
          </div>
        )}

        {/* not found   */}
        {!dataLoading && requestList?.length < 1 && (
          <div className="w-full min-h-[50vh] p-10 rounded-xl bg-white flex flex-col gap-4 items-center justify-center">
            <div className="p-6 rounded-3xl bg-red-50 animate-pulse">
              <span className="text-red-400 text-[2.5rem]">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6c0 1.657 3.582 3 8 3s8 -1.343 8 -3s-3.582 -3 -8 -3s-8 1.343 -8 3"></path>
                  <path d="M4 6v6c0 1.657 3.582 3 8 3c1.118 0 2.182 -.086 3.148 -.241m4.852 -2.759v-6"></path>
                  <path d="M4 12v6c0 1.657 3.582 3 8 3c1.064 0 2.079 -.078 3.007 -.22"></path>
                  <path d="M19 16v3"></path>
                  <path d="M19 22v.01"></path>
                </svg>
              </span>
            </div>

            <span className="font-medium text-gray-400">
              No Hall found.
            </span>
          </div>
        )}
      </div>

      {/* pagination  */}
      <div className="w-full flex flex-row items-center justify-between">
        <span className="text-sm text-gray-700 ">
          Showing{" "}
          <span className="font-semibold text-gray-900 ">{currentPage}</span> of{" "}
          <span className="font-semibold text-gray-900 ">
            {pagination?.totalPages} ({pagination?.documentCount})
          </span>{" "}
          Pages
        </span>
        <div className="inline-flex mt-2 xs:mt-0">
          <button
            onClick={() => handlePagination(currentPage - 1)}
            disabled={dataLoading || currentPage < 2}
            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 rounded-s"
          >
            <svg
              className="w-3.5 h-3.5 me-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
            Prev
          </button>
          <button
            onClick={() => handlePagination(currentPage + 1)}
            disabled={dataLoading || currentPage == pagination?.totalPages}
            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 border-0 border-s border-gray-300 rounded-e"
          >
            Next
            <svg
              className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* add hall modal */}
      {isAddHall && (
        <ModalOverlay
          content={
            <AddTrolley
              initialState={hallDetails}
              onSubmit={(data) => addHall(data, hallId)}
              onClose={() => setIsAddHall(false)}
            />
          }
        />
      )}
    </section>
  );
};

export default AllHall;
