import { getUser, validateWorkspaceAccess } from '@/action';
import MeetingTypeList from '@/components/MeetingTypeList';
// import { redirect } from 'next/navigation';

type Params = Promise<{ workspaceId: string }>

const Home = async (props: {
  params: Params
}) => {
  const now = new Date();
  const user = await getUser();
  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const date = (new Intl.DateTimeFormat('en-IN', { dateStyle: 'full' })).format(now);
  const userId = user.data?.id;
  console.log('userId \n', userId)
  const workspaceId = await props.params;
  console.log('workspaceId \n', workspaceId.workspaceId)
  await validateWorkspaceAccess(workspaceId.workspaceId, userId!);

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="h-[303px] w-full rounded-[20px] bg-cover">
        <div className="flex h-full flex-row justify-between rounded-[20px] border-2 border-white max-md:px-5 max-md:py-8 lg:p-11">
        <div className=" start-0 content-start items-start justify-start gap-2">
              
              <h2 className='py-2 text-3xl font-bold text-primary'>
                Welcome, {user && user.data && user.data.name} <br />
                {/* Team: {workspace && workspace.data && workspace.data.name}  */}
              </h2> 
             
              {/* <h3 className='text-xl font-medium'> */}
                {/* {user && user.data && (
                  <>
                    <span className='text-md font-bold text-white/50'>
                      Username: {user.data.userName} <br />    
                      Role: {user.data.role}

                    </span>
                  </>
                )} */}
              {/* </h3> */}
            </div>
          <div className='flex h-full items-start flex-col justify-between p-0'>
            <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
              Upcoming Meeting at: 12:30 PM  
            </h2>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-extrabold lg:text-7xl">{time.toUpperCase()}</h1>
              <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
            </div>
            </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
