"use client";

import DashboardLayout from "@/components/layout/dashboard_layout";
import Cookies from "js-cookie";
import moment from "moment";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";
import { errorToast, successToast } from "@/utils/toastMessage";
import { useEffect, useState } from "react";

const ReportsAndAnalytics = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

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

  const handleClick = async (e) => {
    e.preventDefault();

    if (!selectedEvent) {
      errorToast("Select an event");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_BASE_URL}/api/super-admin/reports/${selectedEvent}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.error) {
        errorToast(data.error);
        return;
      }

      const events = data.data;

      // Create a new workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Events");

      // Add headers
      worksheet.columns = [
        { header: "Hall", key: "hall", width: 15 },
        { header: "Name", key: "name", width: 20 },
        { header: "Mobile No", key: "mobileNo", width: 15 },
        { header: "Position", key: "position", width: 20 },
        { header: "Designation", key: "designation", width: 20 },
        { header: "Supervisor Name", key: "supervisorName", width: 20 },
        { header: "Supervisor Mobile No", key: "supervisorMobileNo", width: 20 },
        { header: "Date", key: "date", width: 15 },
        { header: "Shift", key: "shift", width: 15 },
        { header: "Image", key: "image", width: 30 },
        { header: "ImageUrl", key: "imageUrl", width: 30 },
      ];

      // Add rows and images
      for (const [index, event] of events.entries()) {
        let row = worksheet.addRow({
          hall: event.hall,
          name: event.name,
          mobileNo: event.mobileNo,
          position: event.position,
          designation: event.designation,
          supervisorName: event.supervisorName,
          supervisorMobileNo: event.supervisorMobileNo,
          date: new Date(event.date).toISOString().split("T")[0],
          shift: event.shift,
          imageUrl: event.image,
          image: ""
        });
        row.height = 100;
        try {
          const imageResponse = await axios.get(event.image, {
            responseType: "arraybuffer",
          });
          const imageId = workbook.addImage({
            buffer: imageResponse.data,
            extension: "jpg", // Adjust based on the image type
          });

          worksheet.addImage(imageId, {
            tl: { col: 9, row: index + 1 },
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
      saveAs(blob, "events_with_images.xlsx");
    } catch (error) {
      errorToast("An error occurred");
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <section className="w-full text-gray-600">
        <div className="w-full bg-white rounded-xl mt-6 pb-6 shadow">
          <div className="p-5 flex lg:flex-row flex-col gap-4 lg:gap-0 items-center justify-between w-full">
            <div className="flex w-full gap-4">
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
              <div className="flex items-center">
                <i className="ri-filter-2-line ri-lg"></i>
                <p className="text-sm text-gray-400">Filter</p>
              </div>
            </div>
            <div className="text-sm w-full flex justify-end gap-4">
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
