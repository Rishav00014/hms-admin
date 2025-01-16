"use client";
import { useEffect, useState } from "react";
import ModalOverlay from "@/components/common/modals/modal_overlay";
import RepairRequest from "@/components/section/RepairRequest";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRequest,
  fetchRepairRequest,
} from "@/lib/redux/slice/trolley-repair-slice";
import moment from "moment";
import { useRouter } from "next/navigation";
import { errorToast, successToast } from "@/utils/toastMessage";
import Link from "next/link";
import { fetchTrolley } from "@/lib/redux/slice/trolley-slice";
import { ProgressState } from "@/components/common/ProgressState";
import * as XLSX from "xlsx";
import LineLoader from "@/components/loader/line_loader";

const AllRepairRequest = ({
  trolleyId = null,
  modalStatus = false,
  details = {},
}) => {
  const token = Cookies.get("access_token");
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    dataLoading,
    loading,
    pagination,
    requestList = [],
  } = useSelector((state) => state.repair);
  const [currentPage, setCurrentPage] = useState(1);

  const [isRequest, setIsRequest] = useState(false);
  const { trolleyList = [] } = useSelector((state) => state.trolley);
  const { user, userLoading = true } = useSelector((state) => state.auth);

  const deleteRequestById = async (id) => {
    const isDelete = confirm(
      "Are you sure want to delete this Repair Request?"
    );

    if (!isDelete) {
      return;
    }
    const resultAction = await dispatch(
      deleteRequest({
        token,
        requestId: id,
      })
    );
    if (deleteRequest.fulfilled.match(resultAction)) {
      if (id) {
        successToast("Trolley deleted");
        router.replace("/repair");
      }
      dispatch(fetchRepairRequest({ token }));
    } else {
      const message = resultAction.payload;
      errorToast(message);
    }
  };

  const handlePagination = (count) => {
    dispatch(fetchRepairRequest({ token, currentPage: count }));
    setCurrentPage(count);
  };

  // export

  const onGetExportProduct = async (title, worksheetname) => {
    try {
      const dataToExport = requestList.map((requestInfo, index) => {
        const {
          comment,
          createdAt,
          scopeOfWork = [],
          statusOfWork,
          location = {},
          trolly = {},
        } = requestInfo;
        return {
          "S/N": index + 1,
          "Trolley Serial no.": trolly?.serialNumber,
          Location: location?.name,
          "Received Date": createdAt,
          "Notes/Comment": comment || "N/A",
          "Status Of Work": statusOfWork || "N/A",
          "Scope Of Work": scopeOfWork || "N/A",
        };
      });
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils?.json_to_sheet(dataToExport);
      XLSX.utils.book_append_sheet(workbook, worksheet, worksheetname);
      XLSX.writeFile(workbook, `${title}.xlsx`);
    } catch (error) {
      errorToast("Failed to export.");
    }
  };

  // end

  useEffect(() => {
    token && dispatch(fetchRepairRequest({ token }));
    return () => {};
  }, [token]);

  useEffect(() => {
    setIsRequest(modalStatus);
    return () => {};
  }, [modalStatus]);

  useEffect(() => {
    token && trolleyList?.length < 1 && dispatch(fetchTrolley({ token }));
    return () => {};
  }, [token]);

  const actionAccess = ["Super Admin", "Service Person"];
  const deleteAccess = ["Super Admin"];
  const hasAccess = actionAccess?.includes(user?.role) || false;
  const hasDeleteAccess = deleteAccess?.includes(user?.role) || false;

  return (
    <section className="text-gray-600">
      {/* add trolley request*/}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center text-sm text-gray-50 w-full bg-blue-400 px-8 py-4 rounded-xl">
        <div className="">
          <h1 className="font-bold  text-4xl pb-2">
            Add New Repair Trolley Request
          </h1>
          <p>Streamline Maintenance Operations</p>
        </div>
        <Link
          href={!hasAccess ? "#" : "/repair/add"}
          className={`bg-orange-400 font-bold px-4 py-2 h-fit rounded-lg ${
            !hasAccess ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Raise Request
        </Link>
      </div>
      {/* export button  */}
      <div className="w-full flex justify-end  my-6 ">
        <button
          disabled={dataLoading || requestList?.length < 1}
          onClick={() =>
            onGetExportProduct(
              `Repair Trolley Request (Showing ${currentPage} of ${pagination?.totalPages} Pages)`,
              "Repair Trolley Request"
            )
          }
          className="disabled:opacity-50 disabled:cursor-not-allowed bg-blue-400 w-fit py-2.5 px-4 rounded text-white flex flex-row items-center gap-2 hover:bg-opacity-80 transition-all"
        >
          <i className="ri-import-fill ri-lg "></i> Export .xlsx file
        </button>
      </div>
      {/* end  */}
      <div className="w-full bg-white rounded-xl mt-6 pb-6 shadow">
        {!dataLoading && requestList?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full font-medium text-nowrap">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="text-left font-medium px-4 py-3">
                    Trolley Sr. No.
                  </th>
                  <th className="text-left font-medium px-4 py-3">LOCATION</th>
                  <th className="text-left font-medium px-4 py-3">SCOPE</th>
                  <th className="text-left font-medium px-4 py-3">
                    RECEIVE DATE
                  </th>

                  <th className=" font-medium px-4 py-3 text-center">STATUS</th>
                  <th className="text-end font-medium px-4 py-3">ACTION</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {requestList.map((requestInfo, index) => {
                  const {
                    _id,
                    comment,
                    createdAt,
                    createdBy,
                    scopeOfWork = [],
                    statusOfWork,
                    location = {},
                    trolly = {},
                  } = requestInfo;
                  const date = moment(createdAt).format("D MMM YY");
                  return (
                    <tr key={_id} className="border-b">
                      <td className="px-4 py-3">{trolly?.serialNumber}</td>
                      <td className="px-4 py-3 text-left">
                        {location?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-left capitalize">
                        {scopeOfWork?.join(" | ")}
                      </td>
                      <td className="px-4 py-3 text-left">{date}</td>

                      <td className="px-4 py-3 text-center">
                        <ProgressState status={statusOfWork} />
                      </td>
                      <td className="px-4 py-3 flex justify-end">
                        <div className="border p-1 w-fit rounded-xl px-4">
                          <Link
                            href={
                              !hasAccess
                                ? "#"
                                : `/repair/update/${_id}?details=${JSON.stringify(
                                    requestInfo
                                  )}`
                            }
                            className={
                              !hasAccess ? "opacity-40 cursor-not-allowed" : ""
                            }
                          >
                            <i className="ri-edit-box-line ri-lg border-r pe-2"></i>
                          </Link>
                          <button
                            className={
                              !hasDeleteAccess
                                ? "opacity-40 cursor-not-allowed"
                                : ""
                            }
                            disabled={userLoading || !hasDeleteAccess}
                            onClick={() => deleteRequestById(_id)}
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

            <span className="font-medium text-gray-400">No request found.</span>
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* raise request */}
      {isRequest && (
        <ModalOverlay
          content={
            <RepairRequest
              initialState={{
                trolly: details?.trolly?._id,
                scopeOfWork: details?.scopeOfWork,
                statusOfWork: details?.statusOfWork,
                comment: details?.comment,
              }}
              trolleyId={trolleyId}
              trolleyList={trolleyList}
              onClose={() => setIsRequest(false)}
            />
          }
        />
      )}
    </section>
  );
};

export default AllRepairRequest;
