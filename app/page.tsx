import { Frame } from "./Frame";
import { Powerbald } from "./Powerbald";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <div>
      <Powerbald />
      <Frame searchParams={searchParams} />
    </div>
  );
}
