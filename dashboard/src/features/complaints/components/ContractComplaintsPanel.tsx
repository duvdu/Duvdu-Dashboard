import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import type { FilterDefinition } from "@/components/ui/filters";
import { UserSearchSelect } from "@/features/chat";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getComplaints } from "../api/complaint.api";
import { useComplaintColumns } from "../columns/complaint-columns";

function ContractComplaintsPanel({ id }: { id: string }) {
  const [complaintSearchParams, setComplaintSearchParams] = useSearchParams();
  const complaintPage = +complaintSearchParams.get("complaintPage") || 1;
  const complaintLimit = +complaintSearchParams.get("complaintLimit") || 10;
  const user = complaintSearchParams.get("complaint_user") || "";
  const isClosed = complaintSearchParams.get("complaint_isClosed") || "";

  const complaintFilters = {
    page: complaintPage,
    limit: complaintLimit,
    user: user || undefined,
    isClosed: isClosed || undefined,
    contract: id,
  };

  const {
    data: complaintsData,
    isLoading: complaintsLoading,
    error: complaintsError,
  } = useQuery({
    queryKey: ["contract-complaints", complaintFilters],
    queryFn: () => getComplaints(complaintFilters),
    enabled: !!id,
  });

  const complaintColumns = useComplaintColumns();
  const complaintPagesCount = complaintsData?.pagination.totalPages || 0;
  const complaintTotalCount = complaintsData?.pagination.resultCount || 0;

  // Filter definitions for complaints
  const complaintsFilterDefinitions: FilterDefinition[] = [
    {
      key: "user",
      label: "Reporter",
      type: "custom",
      customComponent: (
        <UserSearchSelect
          onSelectUser={(user) => {
            const newParams = new URLSearchParams(complaintSearchParams);
            if (user) {
              newParams.set("complaint_user", user._id);
            } else {
              newParams.delete("complaint_user");
            }
            newParams.set("complaintPage", "1");
            setComplaintSearchParams(newParams);
          }}
        />
      ),
    },
    {
      key: "isClosed",
      label: "Status",
      type: "select",
      options: [
        { label: "Open", value: "false" },
        { label: "Closed", value: "true" },
      ],
      placeholder: "Select Status",
    },
  ];

  const complaintFilterValues = {
    user: complaintFilters.user,
    isClosed: complaintFilters.isClosed,
  };

  const handleComplaintFiltersChange = (vals: Record<string, unknown>) => {
    const newParams = new URLSearchParams(complaintSearchParams);
    Object.entries(vals).forEach(([key, value]) => {
      if (value && value !== "") {
        newParams.set(`complaint_${key}`, value as string);
      } else {
        newParams.delete(`complaint_${key}`);
      }
    });
    newParams.set("complaintPage", "1");
    setComplaintSearchParams(newParams);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Complaints</CardTitle>
        <div className="text-sm text-muted-foreground">
          Total: {complaintTotalCount} complaints
        </div>
      </CardHeader>
      <CardContent>
        {complaintsError && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{complaintsError.message}</AlertDescription>
          </Alert>
        )}
        <DataTable
          columns={complaintColumns}
          data={complaintsData?.data || []}
          loading={complaintsLoading}
          pagesCount={complaintPagesCount}
          page={complaintPage}
          limit={complaintLimit}
          filters={complaintsFilterDefinitions}
          filterValues={complaintFilterValues}
          onFiltersChange={handleComplaintFiltersChange}
        />
      </CardContent>
    </Card>
  );
}

export default ContractComplaintsPanel;
