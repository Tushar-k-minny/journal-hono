"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type ApiClientError, apiClient } from "@/lib/api-client";
import { ROUTES } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";
import type {
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileData,
} from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    user,
    token,
    isAuthenticated,
    setUser,
    updateUser,
    logout: logoutStore,
  } = useAuthStore();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.getProfile(),
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginCredentials) => apiClient.login(data),
    onSuccess: (response) => {
      setUser(response.user, response.token);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.push(ROUTES.DASHBOARD);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterCredentials) => apiClient.register(data),
    onSuccess: (response) => {
      setUser(response.user, response.token);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.push(ROUTES.DASHBOARD);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      router.push(ROUTES.HOME);
    },
    onError: () => {
      logoutStore();
      queryClient.clear();
      router.push(ROUTES.HOME);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => apiClient.updateProfile(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.setQueryData(["profile"], updatedUser);
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading: profileQuery.isLoading,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error as ApiClientError | null,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    registerError: registerMutation.error as ApiClientError | null,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
}
