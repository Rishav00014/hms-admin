import DashboardLayout from "@/components/layout/dashboard_layout";
import TrolleyMain from "@/components/section/trolley";

const UpdateTrolleys = async ({ params, searchParams }) => {
  const { trolleyId } = await params;
  const { details } = await searchParams;

  return (
    <DashboardLayout>
      <TrolleyMain
        trolleyDetails={JSON.parse(details) || {}}
        trolleyId={trolleyId}
        modalStatus={true}
      />
    </DashboardLayout>
  );
};

export default UpdateTrolleys;
