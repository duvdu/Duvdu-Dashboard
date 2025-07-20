import { SendMessageModal } from "@/components/modals/SendMessageModal";
import { SendNotificationModal } from "@/components/modals/SendNotificationModal";
import { CreateAdminModal } from "@/features/admins/components/CreateAdminModal";
import { UpdateAdminModal } from "@/features/admins/components/UpdateAdminModal";
import { DeleteCategoryModal } from "@/features/categories/components/DeleteCategoryModal";
import { FeedbackModal } from "@/features/complaints/components/FeedbackModal";
import { ApproveProjectModal } from "@/features/cycles-projects/components/ApproveProjectModal";
import { DeleteProjectModal } from "@/features/cycles-projects/components/DeleteProjectModal";
import { PauseProjectModal } from "@/features/cycles-projects/components/PauseProjectModal";
import { RejectProjectModal } from "@/features/cycles-projects/components/RejectProjectModal";
import { CreateRoleModal } from "@/features/roles/components/CreateRoleModal";
import DeleteRoleModal from "@/features/roles/components/DeleteRoleModal";
import { UpdateRoleModal } from "@/features/roles/components/UpdateRoleModal";
import { DeleteTicketModal } from "@/features/tickets/components/DeleteTicketModal";
import { FeedbackModal as TicketFeedbackModal } from "@/features/tickets/components/FeedbackModal";
import { ActivateDeactivatePayoutMethodModal } from "@/features/users/components/ActivateDeactivatePayoutMethodModal";
import { BlockUnblockUserModal } from "@/features/users/components/BlockUnblockUserModal";
import { DeleteUserModal } from "@/features/users/components/DeleteUserModal";
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
    createRole: <CreateRoleModal />,
    updateRole: <UpdateRoleModal />,
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
    deleteUser: <DeleteUserModal />,
    activateDeactivatePayoutMethod: <ActivateDeactivatePayoutMethodModal />,
    addComplaintFeedback: <FeedbackModal />,
    addTicketFeedback: <TicketFeedbackModal />,
    deleteTicket: <DeleteTicketModal />,
  };

  return <>{type && modals[type]}</>;
};
