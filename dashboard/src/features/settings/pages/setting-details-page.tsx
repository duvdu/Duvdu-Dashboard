import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardLoader from "@/components/layout/DashboardLoader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createSettings,
  getSettings,
  updateSettings,
} from "../api/setting.api";
import { SettingsForm } from "../components/setting-form";

export default function SettingsPage() {
  const [settingsId, setSettingsId] = useState<string | undefined>(undefined);

  const {
    data: settingsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: () => getSettings({}),
  });

  useEffect(() => {
    if (settingsData?._id) setSettingsId(settingsData._id);
  }, [settingsData]);

  const { mutateAsync: createSettingsMutation, isPending: isCreating } =
    useMutation({
      mutationFn: (formData: FormData) => createSettings(formData),
      onSuccess: () => {
        toast.success("Settings created successfully");
        refetch();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.errors?.[0]?.message ||
            "Failed to create settings"
        );
      },
    });

  const { mutateAsync: updateSettingsMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
        updateSettings(id, formData),
      onSuccess: () => {
        toast.success("Settings updated successfully");
        refetch();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.errors?.[0]?.message ||
            "Failed to update settings"
        );
      },
    });

  if (isLoading) return <DashboardLoader />;
  if (error)
    return (
      <DashboardLayout className="text-red-500 p-4">
        {error?.response?.data?.errors?.[0]?.message ||
          "Failed to fetch settings"}
      </DashboardLayout>
    );

  // Prepare default values for the form
  const defaultValues = settingsData
    ? {
        expirationTime: settingsData.expirationTime?.map((e) => e.time) || [],
        contractSubscriptionPercentage:
          settingsData.contractSubscriptionPercentage || 0,
        default_profile: settingsData.default_profile || "",
        default_cover: settingsData.default_cover || "",
      }
    : {
        expirationTime: [],
        contractSubscriptionPercentage: 0,
        default_profile: "",
        default_cover: "",
      };

  // Helper to compare and get only changed fields
  function getChangedFields(values: any, defaults: any) {
    const changed: Record<string, any> = {};
    if (
      JSON.stringify(values.expirationTime) !==
      JSON.stringify(defaults.expirationTime)
    ) {
      changed.expirationTime = values.expirationTime;
    }
    if (
      values.contractSubscriptionPercentage !==
      defaults.contractSubscriptionPercentage
    ) {
      changed.contractSubscriptionPercentage =
        values.contractSubscriptionPercentage;
    }
    if (
      values.default_profile &&
      values.default_profile !== defaults.default_profile
    ) {
      changed.default_profile = values.default_profile;
    }
    if (
      values.default_cover &&
      values.default_cover !== defaults.default_cover
    ) {
      changed.default_cover = values.default_cover;
    }
    return changed;
  }

  async function handleSubmit(values: any) {
    if (settingsId) {
      const changedFields = getChangedFields(values, defaultValues);
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected");
        return;
      }
      const formData = new FormData();
      if (changedFields.contractSubscriptionPercentage !== undefined) {
        formData.append(
          "contractSubscriptionPercentage",
          changedFields.contractSubscriptionPercentage
        );
      }
      if (changedFields.expirationTime !== undefined) {
        changedFields.expirationTime.forEach((time: number) => {
          formData.append("expirationTime[]", JSON.stringify({ time }));
        });
      }
      if (changedFields.default_profile !== undefined) {
        formData.append("default_profile", changedFields.default_profile);
      }
      if (changedFields.default_cover !== undefined) {
        formData.append("default_cover", changedFields.default_cover);
      }
      await updateSettingsMutation({ id: settingsId, formData });
    } else {
      const formData = new FormData();
      formData.append(
        "contractSubscriptionPercentage",
        values.contractSubscriptionPercentage
      );
      values.expirationTime.forEach((time: number) => {
        formData.append("expirationTime[]", JSON.stringify({ time }));
      });
      if (values.default_profile)
        formData.append("default_profile", values.default_profile);
      if (values.default_cover)
        formData.append("default_cover", values.default_cover);
      await createSettingsMutation(formData);
    }
  }

  return (
    <DashboardLayout className="flex-1 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
      </div>
      <SettingsForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
        submitLabel={settingsId ? "Update" : "Create"}
        settingsId={settingsId}
        expirationTimes={settingsData?.expirationTime || []}
      />
    </DashboardLayout>
  );
}
