import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRankById } from "../api/rank.api";

export default function RankDetailsPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["rank", id],
    queryFn: () => getRankById(id),
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;
  return (
    <div>
      <h1>Rank Details</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
