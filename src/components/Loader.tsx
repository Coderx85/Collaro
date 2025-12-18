import { LoaderCircleIcon } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex-center h-screen mx-auto w-full">
      <LoaderCircleIcon className="animate-spin" size={50} />
    </div>
  );
};

export default Loader;
