import DashboardLayout from "@/components/layout/dashboard_layout";
import TrolleyMain from "@/components/section/trolley";
import { Suspense } from "react";

const ManageTrolleys = () => {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <TrolleyMain modalStatus={true} />
      </Suspense>
    </DashboardLayout>
  );
};

export default ManageTrolleys;
