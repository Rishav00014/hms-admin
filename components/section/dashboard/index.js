import Stat from "@/components/section/Stat";
import stats from "../../../public/database/stats.json";
import LineChart from "@/components/section/LineChart";
import CustomPieChart from "@/components/section/PieChart";
import DashboardLayout from "@/components/layout/dashboard_layout";
const Analytics = () => {
  return (
    <DashboardLayout>
      <main className="text-gray-600">
        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-2">
          {stats.map((stat, index) => {
            return <Stat key={index} {...stat} />;
          })}
        </div>

        {/* charts */}

        <div className="flex lg:flex-row flex-col mt-6 gap-6">
          <div className="w-full lg:w-1/2 bg-white p-4 rounded-xl">
            <h2 className="pb-4">Scope Of Work</h2>
            <CustomPieChart />
          </div>
          <div className="w-full lg:w-1/2 bg-white p-4 rounded-xl">
            <h2 className="lg:mb-10 mb-4">Trolley Repair</h2>
            <LineChart />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Analytics;
