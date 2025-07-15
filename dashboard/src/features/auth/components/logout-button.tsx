import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../api/auth.api";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { mutateAsync: logoutMutation, isPending: loading } = useLogoutMutation(
    {
      onSuccess: () => {
        navigate("/auth/login");
      },
    }
  );

  const handleLogout = async () => {
    logoutMutation();
  };

  return (
    <Button
      variant="ghost"
      className="text-destructive"
      loading={loading}
      onClick={handleLogout}
      disabled={loading}
    >
      Logout
      <LogOut className="w-4 h-4" />
    </Button>
  );
}
