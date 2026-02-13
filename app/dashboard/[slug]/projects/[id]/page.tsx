import React from "react";

type Props = {
  params: { id: string };
};

const Page = async ({ params }: Props) => {
  const projectId = await params.id;
  return <div>{projectId}</div>;
};

export default Page;
