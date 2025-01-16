import DashboardLayout from "@/components/layout/dashboard_layout";
import TrolleyMain from "@/components/section/trolley";

const ManageTrolleys = async ({ params, searchParams }) => {
  const { page = 1, location = "", date = null } = await searchParams;
  return (
    <DashboardLayout>
      <TrolleyMain page={parseInt(page)} location={location} date={date} />
    </DashboardLayout>
  );
};

export default ManageTrolleys;
