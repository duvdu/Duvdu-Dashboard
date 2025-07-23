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

export async function getAllPayoutMethods({ user }) {
  const { data } = await api.get("/api/users/withdraw/crm", {
    params: {
      user,
    },
  });
  return data;
}
