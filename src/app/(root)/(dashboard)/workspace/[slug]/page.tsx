import MeetingTypeList from "@/components/MeetingTypeList";
import ProfileCard from "@/components/ProfileCard";
import { checkWorkspaceAccess } from "@/lib/workspace-auth";

const Home = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  await checkWorkspaceAccess(slug);

  const now = new Date();
  const time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(
    now,
  );

  return (
    <section className="flex size-full flex-col gap-5 justify-between text-white py-4 px-2 xl:p-2 h-full">
      <div className="h-[300px] w-full bg-cover xl:p-0 py-5 px-3">
        <div className="flex h-full flex-col-reverse xl:flex-row sm:gap-4 justify-center xl:justify-between rounded-lg border-4 w-full bg-[url('/images/hero-background.png')] card dark:bg-gray-600/50 dark:border-white border-black max-md:p-5 lg:p-4">
          <ProfileCard />
          <div className="flex h-full items-start gap-4 pl-4 xl:p-0 flex-col justify-between">
            <h2 className="dark:bg-linear-to-br max-w-[273px] p-2 rounded text-center text-semibold bg-black font-normal">
              Upcoming Meeting at: 12:30 PM
            </h2>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-extrabold lg:text-6xl text-white">
                {time.toUpperCase()}
              </h1>
              <p className="md:text-lg text-sm font-medium text-sky-1 lg:text-2xl">
                {date}
              </p>
            </div>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
};

export default Home;
