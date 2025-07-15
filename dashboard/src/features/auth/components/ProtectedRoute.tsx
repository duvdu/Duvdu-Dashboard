import { PageLoader } from "@/components/ui/page-loader";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useProfileQuery } from "../api/auth.api";
import { useAuthStore } from "../store";

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();

  const { data, isLoading, isError } = useProfileQuery({
    queryKey: ["profile"],
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data?.data?.data || null);
      console.log(data?.data?.data, "data");
    }
  }, [data?.data?.data, setUser]);

  if (isLoading) return <PageLoader />;

  if (isError && !isLoading) {
    navigate("/auth/login", { state: { from: location }, replace: true });
  }

  return <Outlet />;
}
