import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import api from "../../../lib/axios";

export async function login(login: string, password: string) {
  return api.post("/api/users/auth/signin", { login, password });
}

export async function logout() {
  return api.post("/api/users/auth/logout");
}

export async function getProfile() {
  return api.get("/api/users/auth/profile");
}

export function useLoginMutation<
  TData = unknown,
  TError = unknown,
  TVariables extends { username: string; password: string } = {
    username: string;
    password: string;
  },
  TContext = unknown
>(options: object = {}) {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: (variables: TVariables) =>
      loginRequest(variables.username, variables.password) as Promise<TData>,
    ...options,
  });
}

function loginRequest(loginValue: string, password: string) {
  return login(loginValue, password);
}

type LogoutMutationOptions = UseMutationOptions<
  AxiosResponse<void>,
  unknown,
  void,
  unknown
>;
export function useLogoutMutation(options?: LogoutMutationOptions) {
  return useMutation({
    mutationFn: logout,
    ...options,
  });
}

type ProfileUseQueryOptions = UseQueryOptions<
  AxiosResponse<{
    data: {
      _id: string;
      name: string;
    };
  }>
>;
export function useProfileQuery(options: ProfileUseQueryOptions) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    ...options,
  });
}
