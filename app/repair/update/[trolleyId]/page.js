import DashboardLayout from "@/components/layout/dashboard_layout";
import AllRepairRequest from "@/components/section/trolley/repair";

const UpdateRepairRequest = async ({ params, searchParams }) => {
  const { trolleyId } = await params;
  const { details } = await searchParams;

  return (
    <DashboardLayout>
      <AllRepairRequest
        details={JSON.parse(details) || {}}
        trolleyId={trolleyId}
        modalStatus={true}
      />
    </DashboardLayout>
  );
};

export default UpdateRepairRequest;
