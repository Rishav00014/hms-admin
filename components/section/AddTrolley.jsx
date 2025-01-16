"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const AddTrolley = ({ onClose, onSubmit, initialState = {} }) => {
  const [trollyData, setTrolleyData] = useState({
    name: initialState?.name || "",
    startDate: initialState?.startDate?.substring(0,10) || "",
    endDate: initialState?.endDate?.substring(0,10) || "",
    description:initialState?.description || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTrolleyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event, data) => {
    event.preventDefault();
    onSubmit(data);
  };

  return (
    <section className=" flex justify-center ">
      <div className="w-full lg:w-2/3 bg-white text-gray-600 rounded-xl">
        <div className="bg-blue-400 text-white font-semibold p-4 rounded-t-xl flex items-center justify-between">
          <h1>Add New Event</h1>
        </div>

        <form
          onSubmit={(e) => handleSubmit(e, trollyData)}
          className="p-6 text-sm"
        >
          <div className="w-full flex flex-col gap-2 pb-4">
              <label>Name</label>
              <input
                className="border p-2 rounded-lg bg-gray-100 outline-none"
                type="text"
                required
                name="name"
                value={trollyData?.name}
                onChange={handleChange}
              />
            </div>
          <div className="w-full grid grid-cols-2 gap-4 capitalize">
            <div className="flex flex-col gap-2 pb-4">
              <label>Start Date</label>
              <input
                className="border p-2 rounded-lg bg-gray-100 outline-none"
                type="date"
                name="startDate"
                value={trollyData?.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2 pb-4">
              <label>End Date</label>
              <input
                className="border p-2 rounded-lg bg-gray-100 outline-none"
                type="date"
                name="endDate"
                value={trollyData?.endDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 pb-4">
            <label>Note/Comments</label>
            <textarea
              name="description"
              value={trollyData?.description}
              onChange={handleChange}
              className="border p-2 h-20 rounded-lg bg-gray-100 outline-none"
              type="text"
            />
          </div>
          {/* end  */}

          <div className="flex justify-between gap-4 pt-4">
            <Link
              href="/events"
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

export default AddTrolley;
