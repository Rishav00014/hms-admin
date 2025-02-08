"use client";

import DashboardLayout from "@/components/layout/dashboard_layout";
import Cookies from "js-cookie";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";
import { errorToast, successToast } from "@/utils/toastMessage";
import { use, useEffect, useState } from "react";

const ReportsAndAnalytics = () => {
  const [events, setEvents] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [shift, setShift] = useState([{
    id: "day",
    value: "Day"
  },
  {
    id: "night",
    value: "Night"
  }, {
    id: "all",
    value: "All"
  }
  ]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [date, setDate] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [selecteDesignation, setSelectedDesignation] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.BACKEND_API_BASE_URL}/api/super-admin/events/all`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
          }
        );
        const data = await response.json();

        console.log("Fetched data:", data); // Debugging log

        if (data.error) {
          errorToast(data.error);
        } else if (Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          errorToast("Unexpected data format");
          setEvents([]);
        }
      } catch (error) {
        errorToast("An error occurred while fetching events.");
        console.error(error);
      }
    };

    fetchEvents();
  }, []);
  useEffect(() => {
    const fetchDesignation = async () => {
      try {
        const response = await fetch(
          `${process.env.BACKEND_API_BASE_URL}/api/super-admin/designations/all`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
          }
        );
        const data = await response.json();

        console.log("Fetched data:", data); // Debugging log

        if (data.error) {
          errorToast(data.error);
        } else if (Array.isArray(data.data)) {
          setDesignation([{
            _id: "all",
            title: "All"
          }, ...data.data]);
        } else {
          errorToast("Unexpected data format");
          setDesignation([]);
        }
      } catch (error) {
        errorToast("An error occurred while fetching events.");
        console.error(error);
      }
    };

    fetchDesignation();
  }, []);
  const handleClick = async (e) => {
    e.preventDefault();

    if (!selectedEvent) {
      errorToast("Select an event");
      return;
    }

    try {
      const params = { createdAt: date, shift: selectedShift, designation: selecteDesignation };

      const response = await axios.get(
        `${process.env.BACKEND_API_BASE_URL}/api/super-admin/reports/${selectedEvent}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
          params,
        }
      );
      let data = response.data;
      const attendances = data.data;
      const eventDetails = data.event[0];
      console.log("eventDetails", eventDetails);
      // Create a new workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Events");
      ///
      // add 4 rows 
      worksheet.addRow(["Event Name :", eventDetails.name]);
      worksheet.addRow(["Event Date :", date]);
      worksheet.addRow(["Event Shift :", selectedShift]);
      let designationTitle = "All";
      for (let i = 0; i < designation.length; i++) {
        if (designation[i]._id === selecteDesignation) {
          designationTitle = designation[i].title;
          break;
        }
      };
      worksheet.addRow(["Event Designation :", designationTitle]);
      // Add headers
      worksheet.addRow(["S. No.", "Vender Code", "Name", "Position", "Designation", "Hall", "Shift", "Image"]);
      worksheet.getColumn(3).width = 20;
      worksheet.getColumn(4).width = 20;
      worksheet.getColumn(5).width = 20;
      worksheet.getColumn(6).width = 20;
      worksheet.getColumn(7).width = 20;
      worksheet.getColumn(8).width = 40;
      for (let i = 0; i < attendances.length; i++) {
        let row = worksheet.addRow([i + 1, attendances[i].vendorCode, attendances[i].name, attendances[i].position, attendances[i].designation, attendances[i].hall, attendances[i].shift, , attendances[i].imageUrl]);
        row.height = 100;
        try {
          let imgUrl = attendances[i].image.replace("http", "https");
          const imageResponse = await axios.get(imgUrl, {
            responseType: "arraybuffer",
          });
          const imageId = workbook.addImage({
            buffer: imageResponse.data,
            extension: "jpg", // Adjust based on the image type
          });

          worksheet.addImage(imageId, {
            tl: { col: 7, row: i + 5 },
            ext: { width: 100, height: 100 },
          });
        } catch (error) {
          console.error(`Failed to fetch image: ${event.image}`, error);
        }
      }
      // Save workbook
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "report " + eventDetails.name + ".xlsx");
    } catch (error) {
      errorToast("An error occurred");
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <section className="w-full text-gray-600 ">
        <div className="w-full bg-white rounded-xl mt-6 pb-6 shadow flex justify-center items-center">
          <div className="flex w-1/2 gap-2 flex-col m-10">
            <div className="flex w-full flex-col gap-2 pb-4">
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full border bg-gray-100 p-2 rounded-lg outline-none disabled:opacity-50"
              >
                <option value="">Select Event</option>
                {Array.isArray(events) &&
                  events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex w-full flex-col gap-2 pb-4">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border bg-gray-100 p-2 rounded-lg outline-none"
              />
            </div>
            <div className="flex w-full flex-col gap-2 pb-4">
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full border bg-gray-100 p-2 rounded-lg outline-none"
              >
                <option value="">Select Shift</option>
                {shift.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.value}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-full flex-col gap-2 pb-4">
              <select
                value={selecteDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
                className="w-full border bg-gray-100 p-2 rounded-lg outline-none"
              >
                <option value="">Select Designation</option>
                {designation.map((designation) => (
                  <option key={designation._id} value={designation._id}>
                    {designation.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm w-full flex justify-center  gap-4">
              <button
                className="bg-violet-100 w-1/2 lg:w-fit p-2 rounded-lg text-violet-800"
                onClick={handleClick}
              >
                <i className="ri-import-fill ri-lg"></i> Download
              </button>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default ReportsAndAnalytics;
