"use client";

import { ProgressState } from "@/components/common/ProgressState";
import { fetchServiceHistory } from "@/lib/redux/slice/trolley-slice";
import { deleteHall } from "@/lib/redux/slice/hall-slice";

import Cookies from "js-cookie";
import moment from "moment";

import { errorToast, successToast } from "@/utils/toastMessage";
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddHall from "../AddHall";

const SingleTrolleyDetails = ({ basicInfo = {}, trolleyId }) => {
  const [model, setModel] = useState({
    visibility: false,
    hallId: "",
    updateData: {}
  });

  const { dataLoading, serviceHistory = [] } = useSelector(
    (state) => state.trolley
  );
  const dispatch = useDispatch();

  const token = Cookies.get("access_token");

  const {
    _id,
    name,
    startDate,
    endDate,
    createdAt,
    description,
  } = basicInfo;

  const onUpdate = (data, id) => {
    let newData = {
      hallNumber: data?.hallNumber || "",
      supervisor: data?.supervisor?._id || "",
      event: data?.event?._id || trolleyId
    }
    setModel({
      visibility: true,
      hallId: id,
      updateData: newData
    })
  }
  const deleteTrolleyById = async (id) => {
    
    const isDelete = confirm("Are you sure want to delete this Hall ?");

    if (!isDelete) {
      return;
    }
    const resultAction = await dispatch(deleteHall({ token, id }));
    if (deleteHall.fulfilled.match(resultAction)) {
      successToast("Hall Deleted");
      dispatch(fetchServiceHistory({ token, trolleyId }));
    } else {
      const message = resultAction.payload || "Error in deleting hall";
      errorToast(message);
    };
  }

  useEffect(() => {
    token && trolleyId && dispatch(fetchServiceHistory({ token, trolleyId }));
    return () => { };
  }, [token, trolleyId]);
  return (
    <section className="bg-white rounded-xl text-gray-600 text-sm p-3 lg:p-10">
      <div>
        <div>
          <div className="flex flex-wrap gap-4">
            <div className="w-[46%]">
              <h2 className=" pb-3 font-bold text-black ">Event name :</h2>
              <p className="font-medium">{name}</p>
            </div>
            <div className="w-[46%]">
              <h2 className=" pb-3 font-bold text-black">Event Creation Date:</h2>
              <p className="font-medium">{moment(createdAt).format("D MMM YY")}</p>
            </div>
            <div className="w-[46%]">
              <h2 className=" pb-3 font-bold text-black">Start Date :</h2>
              <p className="font-medium capitalize">{moment(startDate).format("D MMM YY")}</p>
            </div>
            <div className="w-[46%]">
              <h2 className=" pb-3 font-bold text-black">End date :</h2>
              <p className="font-medium">{moment(endDate).format("D MMM YY")}</p>
            </div>
            <div>
              <h2 className=" pb-3 font-bold text-black">Description :</h2>
              <p className="font-medium">{description || "N/A"}</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 mt-3 justify-between items-center text-sm text-gray-50 w-full bg-blue-400 px-8 py-4 rounded-xl">
            <div className="">
              <h1 className="font-bold  text-4xl pb-2">
                Add New Event
              </h1>
              <p>Streamline Your Events Today</p>
            </div>
            <button
              className="bg-orange-400 font-bold px-4 py-2 h-fit rounded-lg text-white"
              onClick={() => onUpdate({}, "")}
            >
              Add Hall
            </button>
          </div>
          {/* history */}
          {!dataLoading && serviceHistory?.length > 0 && (
            <div className="w-full bg-blue-100 rounded-xl mt-3 pb-6 shadow">
              <div className="p-5 flex flex-row gap-4 justify-between w-full">
                <h1 className="font-semibold  text-xl">Halls</h1>

                {/* <div className="flex gap-4">
                <input
                  className="bg-white rounded-full px-6 py-2 w-[80%] lg:w-80 text-sm outline-none"
                  type="text"
                  placeholder="Search ID/Location"
                />
                <div className=" flex items-center">
                  <i className="ri-filter-2-line ri-lg "></i>
                  <p className="text-sm text-gray-400">Filter</p>
                </div>
              </div> */}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full font-medium text-nowrap">
                  <thead className="bg-white text-sm">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">
                        S. No.
                      </th>
                      <th className="text-left font-medium  px-4 py-3">Hall Number</th>
                      <th className="text-left font-medium  px-4 py-3">Supervisor Name</th>
                      <th className="text-left font-medium px-4 py-3">Phone No.</th>
                      <th className="text-left font-medium px-4 py-3">Created</th>
                      <th className="text-center font-medium px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {serviceHistory?.map((data, index) => {
                      const {
                        _id,
                        hallNumber,
                        createdAt,
                        supervisor = {}
                      } = data;
                      const date = moment(createdAt).format("D MMM YY");

                      return (
                        <tr key={_id} className="border-b border-b-white">
                          <td className="px-4 py-3 text-left">{index + 1}</td>

                          <td className="px-4 py-3 capitalize">
                            <ProgressState status={hallNumber} />
                          </td>
                          <td className="px-4 py-3 capitalize">
                            {supervisor?.name || supervisor?.username}
                          </td>

                          <td className="px-4 py-3 text-left first-letter:capitalize">
                            {supervisor?.phoneNo}
                          </td>
                          <td className="px-4 py-3 text-left">{date}</td>
                          <td className="px-4 py-3 flex items-center justify-center">
                            <div className="border py-1.5 w-fit rounded-full px-4">
                              <button
                                onClick={() => onUpdate(data, _id)}
                              >
                                <i className="ri-edit-box-line ri-lg border-r pe-2"></i>
                              </button>
                              <button
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
            </div>
          )}
        </div>
        {!dataLoading && serviceHistory?.length < 1 && (
          <div className="text-center py-10 font-medium text-gray-300">
            No History Found!
          </div>
        )}

        {dataLoading && (
          <div className="text-center py-10 font-medium text-gray-300">
            Loading histories...
          </div>
        )}
      </div>
      {
        model.visibility && <AddHall
          onClose={() => setModel({ visibility: false })}
          initialState={model.updateData}
          trolleyId={model.hallId}
          eventId={trolleyId}
        />
      }
    </section>
  );
};

export default SingleTrolleyDetails;
