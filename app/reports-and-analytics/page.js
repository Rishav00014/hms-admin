import DashboardLayout from "@/components/layout/dashboard_layout";
import reports from "../../public/database/reports.json";

const ReportsAndAnalytics = () => {
  return (
    <DashboardLayout>
      <section className="w-full text-gray-600">
        {/* manage */}
        <div className="flex flex-wrap gap-4 mt-2">
          <div className="w-full lg:w-1/4 bg-white rounded-xl flex flex-col items-center justify-center gap-3 p-4 hover:border hover:border-blue-400 shadow">
            <div className="bg-blue-100 w-fit p-3 rounded-full">
              <i className="ri-group-line ri-xl text-blue-400"></i>
            </div>
            <p className="text-sm font-medium">Manage Report</p>
          </div>
          <div className="w-full lg:w-1/4 bg-white rounded-xl flex flex-col items-center justify-center gap-3 p-4 hover:border hover:border-amber-400 shadow">
            <div className="bg-amber-100 w-fit p-3 rounded-full">
              <i className="ri-box-2-line ri-xl text-amber-400"></i>
            </div>
            <p className="text-sm font-medium">Maintenance Report</p>
          </div>
        </div>
        {/* manage inventory */}
        <div className="w-full bg-white rounded-xl mt-6 pb-6 shadow">
          <div className="p-5 flex lg:flex-row flex-col gap-4 lg:gap-0 items-center justify-between w-full">
            <div className="flex w-full gap-4">
              <input
                className="bg-gray-100 rounded-full px-6 py-2 w-[80%] lg:w-80 text-sm outline-none"
                type="text"
                placeholder="Search ID/Location"
              />
              <div className=" flex items-center">
                <i className="ri-filter-2-line ri-lg "></i>
                <p className="text-sm text-gray-400">Filter</p>
              </div>
            </div>
            <div className="text-sm w-full flex justify-end gap-4">
              <button className="bg-violet-100 w-1/2 lg:w-fit p-2 rounded-lg text-violet-800">
                <i className="ri-share-fill ri-lg "></i> Share
              </button>
              <button className="bg-violet-100 w-1/2 lg:w-fit p-2 rounded-lg text-violet-800">
                <i className="ri-import-fill ri-lg "></i> Download
              </button>
            </div>
          </div>
          {/* trolley tracker */}
          <div className="overflow-x-auto">
            <table className="w-full font-medium text-nowrap">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="text-left font-medium  px-4 py-3">ID</th>
                  <th className="text-left font-medium px-4 py-3">LOCATION</th>
                  <th className="text-left font-medium px-4 py-3">SCOPE</th>
                  <th className="text-left font-medium px-4 py-3">
                    RECEIVE DATE
                  </th>
                  <th className="text-left font-medium px-4 py-3">
                    REPAIR DATE
                  </th>
                  <th className="text-left font-medium px-4 py-3">STATUS</th>
                  <th className="text-left font-medium px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {reports.map((item, index) => {
                  return (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">{item.id}</td>
                      <td className="px-4 py-3 text-left">{item.location}</td>
                      <td className="px-4 py-3 text-left capitalize">
                        {item.scope}
                      </td>
                      <td className="px-4 py-3 text-left">
                        {item.receive_date}
                      </td>
                      <td className="px-4 py-3 text-left">
                        {item.repair_date}
                      </td>
                      <td className="px-4 py-3 text-left">
                        <p
                          className={` ${
                            item.status === "pending"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          } w-[80%] capitalize text-center rounded py-1`}
                        >
                          {item.status}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default ReportsAndAnalytics;
