import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getFundTransactionById } from "../api/fund-transaction.api";

export default function FundTransactionDetailsPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["fund-transaction", id],
    queryFn: () => getFundTransactionById(id),
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;
  return (
    <div>
      <h1>FundTransaction Details</h1>
      <div>Fund Amount: {data.fundAmount}</div>
      <div>Withdraw Method: {data.withdrawMethod}</div>
      <div>Status: {data.status}</div>
      <div>Created At: {data.createdAt}</div>
      <div>User: {data.user.name}</div>
      {data.fundAttachment && (
        <div>
          Attachment:{" "}
          <a
            href={data.fundAttachment}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
}
