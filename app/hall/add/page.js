import DashboardLayout from "@/components/layout/dashboard_layout";
import AllHall from "@/components/section/hall/all-hall";
import { Suspense } from "react";

const ManageHall = () => {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <AllHall modalStatus={true} />
      </Suspense>
    </DashboardLayout>
  );
};

export default ManageHall;
