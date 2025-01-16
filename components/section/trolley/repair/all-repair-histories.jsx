"use client";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { fetchRepairRequest } from "@/lib/redux/slice/trolley-repair-slice";
import { useEffect, useState } from "react";
import moment from "moment";
import LineLoader from "@/components/loader/line_loader";

const AllHistories = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    dataLoading,
    loading,
    pagination,
    requestList = [],
  } = useSelector((state) => state.repair);
  const token = Cookies.get("access_token");
  const dispatch = useDispatch();

  const handlePagination = (count) => {
    dispatch(fetchRepairRequest({ token, currentPage: count }));
    setCurrentPage(count);
  };
  useEffect(() => {
    token && dispatch(fetchRepairRequest({ token }));
    return () => {};
  }, [token]);
  return (
    <section className="text-gray-600">
      <div className="w-full bg-white rounded-xl mt-6 pb-6 shadow">
        {!dataLoading && requestList?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full font-medium text-nowrap">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="text-left font-medium  px-4 py-3">Sr No.</th>

                  <th className="text-left font-medium px-4 py-3">
                    Received date
                  </th>
                  <th className="text-left font-medium  px-4 py-3">Status</th>
                  <th className="text-left font-medium  px-4 py-3">Scope</th>
                  <th className="text-left font-medium  px-4 py-3">Location</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {requestList.map((requestInfo, index) => {
                  const {
                    _id,
                    comment,
                    createdAt,
                    createdBy,
                    scopeOfWork,
                    statusOfWork,
                    location = {},
                    trolly = {},
                  } = requestInfo;
                  const date = moment(createdAt).format("D MMM YY");

                  return (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">{trolly?.serialNumber}</td>

                      <td className="px-4 py-3 text-left">{date}</td>
                      <td className="px-4 py-3 text-left">{statusOfWork}</td>
                      <td className="px-4 py-3 text-left">{scopeOfWork}</td>

                      <td className="px-4 py-3 text-left">
                        {location?.name || "N/A"}
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
              No Repair History found.
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
    </section>
  );
};

export default AllHistories;
