import api from "@/lib/axios";

export async function updatePayoutMethodStatus(payoutMethodId, status) {
  const { data } = await api.patch(
    `/api/users/withdraw/crm/${payoutMethodId}`,
    {
      status,
    }
  );
  return data;
}
