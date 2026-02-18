import ProjectNavbar from "@/components/global/project-navbar/project-navbar";
import ReactQueryProvider from "@/react-query/query-provider";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="w-full px-10 h-screen flex flex-col gap-6">
      <ProjectNavbar />
      <div className="flex-1 overflow-hidden">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </div>
    </div>
  );
}
