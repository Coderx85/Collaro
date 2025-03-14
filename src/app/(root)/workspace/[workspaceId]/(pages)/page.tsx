"use client"
import MeetingTypeList from '@/components/MeetingTypeList';
import { useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

const Home = () => {
  const now = new Date();
  const user = useUser();
  const pathname = usePathname()
  const workspaceId = pathname.split('/')[2]
  const username = user.user?.username
  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const date = (new Intl.DateTimeFormat('en-IN', { dateStyle: 'full' })).format(now);

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="h-[303px] w-full rounded-[20px] bg-cover">
        <div className="flex h-full flex-row justify-between rounded-[20px] border-2 border-white max-md:px-5 max-md:py-8 lg:p-11">
          <div className='flex h-full flex-col justify-between p-0'>
            <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
              Upcoming Meeting at: 12:30 PM  
            </h2>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
              <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
            </div>
            </div>
            <div className=" start-0 content-start items-start justify-start gap-2">
              {/* 
              <h2 className='py-2 text-3xl font-bold text-primary'>
                Team: {'Workspace'}
              </h2> 
              */}
              <h3 className='text-xl font-medium'>
                Username: {username} <br/>
                Name: {user.user?.firstName?.toString().toLocaleUpperCase()} <br/>
                Email: {user.user?.emailAddresses[0].emailAddress} <br/>
                WorkspaceId: {workspaceId} <br/>
              </h3>
            </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
