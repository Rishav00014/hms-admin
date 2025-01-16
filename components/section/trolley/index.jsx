"use client";
import { useEffect, useState } from "react";
import AddTrolley from "@/components/section/AddTrolley";
import ModalOverlay from "@/components/common/modals/modal_overlay";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import {
  createTrolley,
  fetchTrolley,
  deleteTrolley,
} from "@/lib/redux/slice/trolley-slice";
import moment from "moment";
import { errorToast, successToast } from "@/utils/toastMessage";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LineLoader from "@/components/loader/line_loader";

const TrolleyMain = ({
  trolleyId = null,
  trolleyDetails = {},
  modalStatus = false,
  page = 1,
  location = null,
  date = null,
}) => {
  const [isAddTrolley, setIsAddTrolley] = useState(false);

  const { user, userLoading = true } = useSelector((state) => state.auth);
  const pathname = usePathname();
  const {
    dataLoading = true,
    trolleyList = [],
    pagination,
  } = useSelector((state) => state.trolley);

  const [sortedTrolleyList, setSortedTrolleyList] = useState([]);

  const token = Cookies.get("access_token");

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const addTrolley = async (data, id) => {
    const resultAction = await dispatch(
      createTrolley({
        token,
        data,
        trolleyId: id,
      })
    );

    if (createTrolley.fulfilled.match(resultAction)) {
      setIsAddTrolley(false);
      if (id) {
        successToast("Trolley updated");
      }
      dispatch(fetchTrolley({ token }));
      router.replace("/trolleys");
    } else {
      const message = resultAction.payload;
      errorToast(message);
    }
  };
  const deleteTrolleyById = async (id) => {
    const isDelete = confirm("Are you sure want to delete this Trolley?");

    if (!isDelete) {
      return;
    }
    const resultAction = await dispatch(
      deleteTrolley({
        token,
        trolleyId: id,
      })
    );
    if (deleteTrolley.fulfilled.match(resultAction)) {
      if (id) {
        successToast("Trolley deleted");
        router.replace("/trolleys");
      }
      dispatch(fetchTrolley({ token }));
    } else {
      const message = resultAction.payload;
      errorToast(message);
    }
  };

  const handlePagination = (count) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", count);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const sortByLocation = (id) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", 1);

    if (id && id?.length > 2) {
      params.set("location", id);
    } else {
      params.delete("location");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const sortByDate = (dateTime) => {
    const params = new URLSearchParams(searchParams);

    if (dateTime) {
      params.set("date", dateTime);
    } else {
      params.delete("date");
    }
    params.set("page", 1);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const searchBySrNo = (keyword) => {
    setTimeout(() => {
      dispatch(
        fetchTrolley({
          token,
          query: keyword,
          currentPage: page || 1,
          location: location || null,
          reciveDate: date || null,
        })
      );
    }, 1000);
  };

  // end

  useEffect(() => {
    token &&
      dispatch(
        fetchTrolley({
          token,
          currentPage: page || 1,
          location: location || null,
          reciveDate: date || null,
        })
      );
    return () => {};
  }, [token, page, location, date]);

  useEffect(() => {
    modalStatus && setIsAddTrolley(modalStatus);
    return () => {};
  }, [modalStatus]);

  const actionAccess = ["Super Admin", "Service Person"];
  const deleteAccess = ["Super Admin"];
  const hasAccess = actionAccess?.includes(user?.role) || false;
  const hasDeleteAccess = deleteAccess?.includes(user?.role) || false;

  useEffect(() => {
    setSortedTrolleyList(trolleyList);
    return () => {};
  }, [trolleyList]);

  return (
    <section className="w-full text-gray-600">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center text-sm text-gray-50 w-full bg-blue-400 px-8 py-4 rounded-xl">
        <div className="">
          <h1 className="font-bold  text-4xl pb-2">
            Add New Event
          </h1>
          <p>Streamline Your Events Today</p>
        </div>
        <Link
          href={!hasAccess ? "#" : "/trolleys/add"}
          className={`bg-orange-400 font-bold px-4 py-2 h-fit rounded-lg ${
            !hasAccess ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Add Events
        </Link>
      </div>

      {/* end  */}

      <div className="w-full bg-white rounded-xl shadow">
        {/* search / filter */}
        <div className="p-5 flex flex-col lg:flex-row gap-4 lg:gap-0 items-center justify-between w-full">
          <input
            onChange={(e) => searchBySrNo(e.target.value)}
            className="bg-gray-100 rounded-full px-6 py-2 w-full lg:w-80 text-sm outline-none h-[45px]"
            type="search"
            placeholder="Search by serial number.."
          />
        </div>

        {/* table if no loading */}
        {!dataLoading && trolleyList?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full font-medium text-nowrap">
              <thead className="bg-gray-100 text-sm capitalize">
                <tr>
                  <th className="text-center font-medium  px-4 py-3">
                    Sr. No.
                  </th>
                  <th className="text-center font-medium  px-4 py-3">
                    Name
                  </th>
                  <th className="text-center font-medium px-4 py-3">
                    Start Date
                  </th>
                  <th className="text-center font-medium px-4 py-3">
                    End Date
                  </th>
                  <th className="text-center font-medium px-4 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {sortedTrolleyList?.map((trolleyData, index) => {
                  const {
                    _id,
                    name,
                    startDate,
                    endDate,
                    createdAt
                  } = trolleyData;
                  return (
                    <tr
                      key={_id}
                      className={
                        trolleyList?.length - 1 !== index && "border-b"
                      }
                    >
                      <td className="px-4 py-3 text-center  ">
                        
                          {((page-1)*8)+index+1}
                      </td>
                      <td className="text-center px-4 py-3">
                      <Link
                          href={`/trolleys/details/${_id}?basicInfo=${JSON.stringify(
                            trolleyData
                          )}`}
                          className="text-blue-400 hover:text-orange-500"
                        >
                        {name || "N/A"}
                        </Link>
                      </td>
                      <td className="text-center px-4 py-3">
                        {moment(startDate).format("D MMM YY") || "N/A"}
                      </td>

                      <td className="px-4 py-3 text-center capitalize">
                      {moment(endDate).format("D MMM YY") || "N/A"}
                      </td>
                      
                      <td className="px-4 py-3 flex items-center justify-center">
                        <div className="border py-1.5 w-fit rounded-full px-4">
                          <Link
                            href={
                              !hasAccess
                                ? "#"
                                : `/trolleys/update/${_id}?details=${JSON.stringify(
                                    trolleyData
                                  )}`
                            }
                            className={
                              !hasAccess ? "opacity-40 cursor-not-allowed" : ""
                            }
                          >
                            <i className="ri-edit-box-line ri-lg border-r pe-2"></i>
                          </Link>
                          <button
                            disabled={userLoading || !hasDeleteAccess}
                            className={
                              !hasDeleteAccess
                                ? "opacity-40 cursor-not-allowed"
                                : ""
                            }
                            onClick={() => deleteTrolleyById(_id)}
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
        {!dataLoading && trolleyList?.length < 1 && (
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

            <span className="font-medium text-gray-400">No trolley found.</span>
          </div>
        )}
      </div>

      {/* pagination  */}
      <div className="w-full flex flex-row items-center justify-between">
        <span className="text-sm text-gray-700 ">
          Showing <span className="font-semibold text-gray-900 ">{page}</span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 ">
            {pagination?.totalPages} ({pagination?.documentCount})
          </span>{" "}
          Pages
        </span>
        <div className="inline-flex mt-2 xs:mt-0">
          <button
            onClick={() => handlePagination(page - 1)}
            disabled={dataLoading || page < 2}
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
            onClick={() => handlePagination(page + 1)}
            disabled={dataLoading || page == pagination?.totalPages}
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

      {/* add trolley modal */}
      {isAddTrolley && (
        <ModalOverlay
          content={
            <AddTrolley
              initialState={trolleyDetails}
              onSubmit={(data) => addTrolley(data, trolleyId)}
              onClose={() => setIsAddTrolley(false)}
            />
          }
        />
      )}
    </section>
  );
};

export default TrolleyMain;
