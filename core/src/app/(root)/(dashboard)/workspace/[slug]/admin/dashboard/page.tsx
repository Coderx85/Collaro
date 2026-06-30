import WeeklyMeetingsChart from "@/components/workspace/admin/charts/weekly-meeting-chart";
import DailyMeetingsChart from "@/components/workspace/admin/charts/weekly-meeting-chart";

const AdminDashboardPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      </div>

      <p className="text-muted-foreground">
        This is the admin dashboard where workspace admins can manage settings,
        view analytics, and oversee user activities.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4 bg-card/80 rounded-lg">
          <WeeklyMeetingsChart slug={slug} />
        </div>

        <div className="card p-4 bg-card/80 rounded-lg">
          <DailyMeetingsChart slug={slug} />
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
