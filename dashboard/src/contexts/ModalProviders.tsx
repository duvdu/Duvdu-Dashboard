import { SendMessageModal } from "@/components/modals/SendMessageModal";
import { SendNotificationModal } from "@/components/modals/SendNotificationModal";
import { CreateAdminModal } from "@/features/admins/components/CreateAdminModal";
import { UpdateAdminModal } from "@/features/admins/components/UpdateAdminModal";
import { DeleteCategoryModal } from "@/features/categories/components/DeleteCategoryModal";
import { ApproveProjectModal } from "@/features/cycles-projects/components/ApproveProjectModal";
import { DeleteProjectModal } from "@/features/cycles-projects/components/DeleteProjectModal";
import { PauseProjectModal } from "@/features/cycles-projects/components/PauseProjectModal";
import { RejectProjectModal } from "@/features/cycles-projects/components/RejectProjectModal";
import DeleteRoleModal from "@/features/roles/components/DeleteRoleModal";
import RoleFormModal from "@/features/roles/components/RoleFormModal";
import { BlockUnblockUserModal } from "@/features/users/components/BlockUnblockUserModal";
import { useModal, type ModalType } from "@/store/modal-store";
import { useEffect, useState, type JSX } from "react";

export const ModalProvider = () => {
  const { type } = useModal();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const modals: Record<ModalType, JSX.Element> = {
    sendNotification: <SendNotificationModal />,
    sendMessage: <SendMessageModal />,
    deleteCategory: <DeleteCategoryModal />,
    createRole: <RoleFormModal />,
    updateRole: <RoleFormModal />,
    deleteRole: <DeleteRoleModal />,
    blockUnblockUser: <BlockUnblockUserModal />,
    createAdmin: <CreateAdminModal />,
    updateAdmin: <UpdateAdminModal />,
    deleteProject: <DeleteProjectModal />,
    approveProject: <ApproveProjectModal />,
    rejectProject: <RejectProjectModal />,
    pauseProject: <PauseProjectModal />,
    pinChat: <div>Pin Chat Modal</div>,
    archiveChat: <div>Archive Chat Modal</div>,
    muteChat: <div>Mute Chat Modal</div>,
    deleteChat: <div>Delete Chat Modal</div>,
  };

  return <>{type && modals[type]}</>;
};
