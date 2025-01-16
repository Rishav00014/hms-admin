import DashboardLayout from "@/components/layout/dashboard_layout";
import AllRepairRequest from "@/components/section/trolley/repair";

const UpdateRepairRequest = async () => {
  return (
    <DashboardLayout>
      <AllRepairRequest modalStatus={true} />
    </DashboardLayout>
  );
};

export default UpdateRepairRequest;
