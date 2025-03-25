import { getUser } from "@/action";
import AdminTab from "./_components/AdminTab";
// import AnalyticsDashboard from './_components/Analytic'
import { forbidden } from "next/navigation";

const AdminDashboard = async () => {
  const users = await getUser();
  if (users.data && users.data.role !== "admin") return forbidden();

  return (
    <>
      <h1 className='text-4xl primary-text'>Admin Panel</h1>
      <AdminTab />
      {/* <AnalyticsDashboard /> */}
    </>
  );
};

export default AdminDashboard;
