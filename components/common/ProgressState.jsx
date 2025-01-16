import React from "react";

const useStatusStyles = (status) => {
  switch (status) {
    case "Pending":
      return "text-yellow-600 bg-yellow-50";
    case "In Progress":
      return "text-blue-600 bg-blue-50";
    case "Completed":
      return "text-teal-600 bg-teal-50";
    case "On Hold":
      return "text-gray-500 bg-gray-50";
    case "Delivered":
      return "text-green-500 bg-green-50";
    default:
      return "text-gray-500 bg-gray-50";
  }
};

export const ProgressState = ({ status }) => {
  const statusStyle = useStatusStyles(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium ${statusStyle}`}
    >
      {status}
    </span>
  );
};
