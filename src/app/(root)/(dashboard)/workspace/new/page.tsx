import NewWorkspaceForm from "@/lib/form/new-workspace-form";

const NewWorksapceFormPage = () => {
  return (
    <div className="flex h-full flex-col py-15 items-center justify-center rounded-sm">
      <h1 className="text-xl font-bold">New Workspace</h1>
      <NewWorkspaceForm />
    </div>
  );
};

export default NewWorksapceFormPage;
