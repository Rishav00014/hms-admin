"use client";
import {
  fetchRepairRequest,
  raiseRequest,
} from "@/lib/redux/slice/trolley-repair-slice";
import { errorToast, successToast } from "@/utils/toastMessage";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const RepairRequest = ({
  onClose,
  trolleyId,
  initialState = {},
  trolleyList = [],
}) => {
  const [requestData, setRequestData] = useState({
    trolly: "",
    scopeOfWork: ["Service"],
    statusOfWork: "Pending",
    comment: "",
  });
  const token = Cookies.get("access_token");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRequestData((prev) => ({ ...prev, [name]: value }));
  };

  const sendRequest = async (event, data, id) => {
    event.preventDefault();
    const resultAction = await dispatch(
      raiseRequest({
        token,
        data,
        repairId: id,
      })
    );

    if (raiseRequest.fulfilled.match(resultAction)) {
      onClose();
      setRequestData({
        trolly: "",
        scopeOfWork: [],
        statusOfWork: "",
        comment: "",
      });
      if (id) {
        successToast("Request updated");
      }
      dispatch(fetchRepairRequest({ token }));
      router.replace("/repair");
    } else {
      const message = resultAction.payload;
      errorToast(message);
    }
  };

  const workScopes = ["Service", "Repair", "Paint", "Other"];

  const addWork = (work) => {
    setRequestData((prev) => {
      if (prev.scopeOfWork.includes(work)) {
        return {
          ...prev,
          scopeOfWork: prev.scopeOfWork.filter((item) => item !== work),
        };
      } else {
        return {
          ...prev,
          scopeOfWork: [...prev.scopeOfWork, work],
        };
      }
    });
  };

  const allStatus = [
    "Pending",
    "In Progress",
    "Completed",
    "On Hold",
    "Delivered",
  ];

  const allLocation = [
    {
      _id: "6771b0d9a3881b034e1219e7",
      name: "Delhi",
      createdAt: "2024-12-29T20:28:09.492Z",
      __v: 0,
    },
    {
      _id: "6771b166a3881b034e1219ed",
      name: "Banglore",
      createdAt: "2024-12-29T20:30:30.238Z",
      __v: 0,
    },
    {
      _id: "6771b177a3881b034e1219f0",
      name: "Bombay",
      createdAt: "2024-12-29T20:30:47.613Z",
      __v: 0,
    },
    {
      _id: "6771b224a3881b034e121a00",
      name: "Kochi",
      createdAt: "2024-12-29T20:33:40.182Z",
      __v: 0,
    },
  ];

  useEffect(() => {
    trolleyId && setRequestData(initialState);
    return () => {};
  }, [initialState, trolleyId]);

  return (
    <section className=" flex justify-center">
      <div className="w-full lg:w-2/3 bg-white text-gray-600 rounded-xl">
        <div className="bg-blue-400 text-white font-semibold p-4 rounded-t-xl flex items-center justify-between">
          <h1>Repair Request</h1>{" "}
        </div>
        <form
          onSubmit={(e) => sendRequest(e, requestData, trolleyId)}
          className="p-6 text-sm"
        >
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="flex  w-full flex-col gap-2 pb-4">
              <label>Sr. No</label>
              <select
                disabled={trolleyList?.length < 1}
                required
                name="trolly"
                value={requestData?.trolly}
                onChange={handleChange}
                className="border bg-gray-100 p-2 rounded-lg outline-none disabled:opacity-50"
              >
                <option value="">Select trolley</option>
                {trolleyList?.map((trolley, index) => {
                  const {
                    _id,
                    serialNumber,
                    location,
                    isWarranty,
                    scopeOfWork,
                  } = trolley;
                  const display = `${serialNumber}`;
                  return (
                    <option key={trolley?._id} value={trolley?._id}>
                      {display}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col gap-2 pb-4">
              <label>Assign Location</label>
              <select
                required
                name="location"
                className="border bg-gray-100 p-2 rounded-lg outline-none"
              >
                {allLocation?.map((item) => {
                  return (
                    <option key={item?._id} value={item?._id}>
                      {item?.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="flex  w-full flex-col gap-2 pb-4">
            <label>Scope Of Work</label>
            <div className="w-full flex flex-row flex-wrap gap-1.5">
              {workScopes?.map((scop, index) => {
                return (
                  <div
                    onClick={() => addWork(scop)}
                    key={index}
                    className={`${
                      requestData?.scopeOfWork?.includes(scop)
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    } px-1.5 py-1 rounded-full font-medium flex flex-row items-center gap-1.5 text-md`}
                  >
                    <i className="text-lg">
                      {!requestData?.scopeOfWork?.includes(scop) ? (
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm106.5 150.5L228.8 332.8h-.1c-1.7 1.7-6.3 5.5-11.6 5.5-3.8 0-8.1-2.1-11.7-5.7l-56-56c-1.6-1.6-1.6-4.1 0-5.7l17.8-17.8c.8-.8 1.8-1.2 2.8-1.2 1 0 2 .4 2.8 1.2l44.4 44.4 122-122.9c.8-.8 1.8-1.2 2.8-1.2 1.1 0 2.1.4 2.8 1.2l17.5 18.1c1.8 1.7 1.8 4.2.2 5.8z"></path>
                        </svg>
                      ) : (
                        <svg
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="0"
                          viewBox="0 0 15 15"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      )}
                    </i>{" "}
                    <span>{scop}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 pb-4">
            <label>Status</label>
            <select
              required
              name="statusOfWork"
              value={requestData?.statusOfWork}
              onChange={handleChange}
              className="border bg-gray-100 p-2 rounded-lg outline-none"
            >
              {allStatus?.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 pb-4">
            <label>Note/Comments</label>
            <textarea
              required
              name="comment"
              value={requestData?.comment}
              onChange={handleChange}
              className="border p-2 h-20 rounded-lg bg-gray-100 outline-none"
              type="text"
            />
          </div>
          <div className="flex justify-between gap-4 pt-4">
            <Link
              href="/repair"
              className="border text-center border-blue-400 w-[48%] text-blue-400 rounded-lg p-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-blue-400 w-[48%] text-white rounded-lg p-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RepairRequest;
