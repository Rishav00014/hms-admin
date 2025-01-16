"use client";
import {
  fetchSupervisor,
  createHall
} from "@/lib/redux/slice/hall-slice";
import { errorToast, successToast } from "@/utils/toastMessage";

import { fetchServiceHistory } from "@/lib/redux/slice/trolley-slice";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";

const AddHall = ({
  onClose,
  eventId,
  initialState = {},
  trolleyId
}) => {
  const [requestData, setRequestData] = useState({
    hallNumber: "",
    supervisor: "",
    event: eventId
  });
  const { dataLoading,supervisor =[] } = useSelector(
    (state) => state.hall
  );
  const token = Cookies.get("access_token");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRequestData((prev) => ({ ...prev, [name]: value }));
  };

  const sendRequest = async (event, data) => {
    event.preventDefault();
    const resultAction =await dispatch(
      createHall({
        token,
        data,
        id: trolleyId
      })
    );

    if (createHall.fulfilled.match(resultAction)) {
      onClose();
      setRequestData({
        hallNumber: "",
        supervisor: "",
        event: eventId
      });
      if (trolleyId!=="") {
        successToast("Request updated");
      }
      dispatch(fetchServiceHistory({ token,trolleyId:eventId}));
    } else {
      const message = resultAction.payload||"Error in creating hall";
      errorToast(message);
    }
  };



  useEffect(() => {
    trolleyId && setRequestData(initialState);
    return () => { };
  }, [initialState, trolleyId]);

  useEffect(() => {
    token && dispatch(fetchSupervisor({ token }));
    return () => { };
  }, []);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
      <section className="w-1/3 bg-white text-gray-600 rounded-xl">
        <div className="bg-blue-400 text-white font-semibold p-4 rounded-t-xl flex items-center justify-between">
          <h1>Add Hall</h1>{" "}
        </div>
        <form
          onSubmit={(e) => sendRequest(e, requestData)}
          className="p-6 text-sm"
        >
          <div className="w-full grid  gap-4">
            <div className="flex  w-full flex-col gap-2 pb-4">
              <label>Supervisor</label>
              <select
                required
                name="supervisor"
                value={requestData?.supervisor}
                onChange={handleChange}
                className="w-full border bg-gray-100 p-2 rounded-lg outline-none disabled:opacity-50"
              >
                <option value="">Select trolley</option>
                {supervisor?.map((trolley, index) => {
                  const {
                    _id,
                    username,
                    name,
                    phoneNo,
                    role
                  } = trolley;
                  const display = `${username} | ${name}`;
                  return (
                    <option key={_id} value={_id}>
                      {display}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 pb-4">
            <label>Hall Number</label>
            <input
              className="border p-2 rounded-lg bg-gray-100 outline-none"
              type="text"
              required
              name="hallNumber"
              value={requestData?.hallNumber}
              onChange={handleChange}
            />
          </div>


          <div className="flex justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-400 w-[48%] text-white rounded-lg p-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-400 w-[48%] text-white rounded-lg p-2"
            >
              Save
            </button>
          </div>
        </form>

      </section >
    </div>
  );
};

export default AddHall;
