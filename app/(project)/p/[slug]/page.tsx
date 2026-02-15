type Props = {
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <h1>{slug}</h1>
    </>
  );
}
