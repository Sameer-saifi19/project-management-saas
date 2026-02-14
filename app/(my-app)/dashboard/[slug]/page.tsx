import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <h1>{slug}</h1>
      <Button>
        <Link href={`/dashboard/${slug}/projects`}>
          All projects
        </Link>
      </Button>
    </>
  );
}
