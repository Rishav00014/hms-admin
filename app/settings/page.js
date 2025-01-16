import DashboardLayout from "@/components/layout/dashboard_layout";

const Settings = () => {
  return (
    <DashboardLayout>
      <section className="text-gray-600  text-sm bg-white h-[80vh] rounded-xl p-6 lgp-10">
        <div className="flex flex-col gap-3">
          <label>Time Zone</label>
          <select className="w-full bg-gray-100 lg:w-1/3 outline-none border rounded-lg p-2">
            <option value="UTC-8">
              GMT-12:00 International Date Line West
            </option>
            <option value="UTC-7">
              GMT-12:00 International Date Line West
            </option>
            <option value="UTC-6">
              GMT-12:00 International Date Line West
            </option>
            <option value="UTC-5">
              GMT-12:00 International Date Line West
            </option>
            <option value="UTC-4">
              GMT-12:00 International Date Line West
            </option>
          </select>
        </div>

        <div className="flex flex-col gap-3 my-10">
          <h5>Notification</h5>
          <p>
            <i className="ri-toggle-fill ri-2x align-middle pe-2 lg:pe-4 text-blue-400"></i>
            I receive all notification from any user
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h5>Two-factor Authentication</h5>
          <p>
            <i className="ri-toggle-fill ri-2x align-middle pe-2 lg:pe-4 text-blue-400"></i>
            Enable or disable two factor authentication
          </p>
        </div>
        <div className="w-full flex justify-center pt-20 ">
          <button className="text-white bg-blue-400 px-20 py-3 rounded-lg font-medium">
            Save Now
          </button>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Settings;
