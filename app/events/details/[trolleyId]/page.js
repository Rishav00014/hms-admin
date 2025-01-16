import DashboardLayout from "@/components/layout/dashboard_layout";
import SingleTrolleyDetails from "@/components/section/trolley/single-trolley";

const TrolleyDetails = async ({ params, searchParams }) => {
  const { trolleyId } = await params;

  const { basicInfo = "{}" } = await searchParams;

  return (
    <DashboardLayout>
      <SingleTrolleyDetails
        basicInfo={JSON.parse(basicInfo)}
        trolleyId={trolleyId}
      />
    </DashboardLayout>
  );
};

export default TrolleyDetails;
