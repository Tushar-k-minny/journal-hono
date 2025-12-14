"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, subDays } from "date-fns";
import {
  Calendar,
  Download,
  Loader2,
  LogOut,
  Mail,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(120, "Display name must be 120 characters or less"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileView() {
  const { user, logout, isLoggingOut, updateProfile, isUpdatingProfile } =
    useAuth();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: zodResolver type mismatch
    resolver: zodResolver(profileSchema as any),
    defaultValues: {
      displayName: user?.displayName || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({ displayName: data.displayName });
      setIsEditing(false);
    } catch {
      // Error handled by mutation
    }
  };

  const handleCancel = () => {
    reset({ displayName: user?.displayName || "" });
    setIsEditing(false);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const fromDate = subDays(new Date(), 120);

      // response itself is the array
      const response = await apiClient.getEntries({
        limit: 120,
        from: fromDate.toISOString(),
      });

      if (!Array.isArray(response)) {
        throw new Error("API did not return an array.");
      }

      if (response.length === 0) {
        toast("No entries to export.");
        return;
      }

      const data = JSON.stringify(response, null, 2);

      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `journal-export-${format(new Date(), "yyyy-MM-dd")}.json`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Export completed successfully");
    } catch (error) {
      console.error("Failed to export data:", error);
      toast.error("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const initials =
    user?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bold text-3xl sm:text-4xl">
            <span className="brutal-border brutal-shadow-sm bg-chart-3 px-2 text-chart-3-foreground">
              Profile
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="brutal-border brutal-shadow mb-6 bg-card p-6 sm:p-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            {/* Avatar */}
            <Avatar className="brutal-border brutal-shadow-sm h-24 w-24">
              <AvatarImage
                alt={user?.displayName}
                src={user?.avatarUrl || undefined}
              />
              <AvatarFallback className="bg-primary font-bold text-2xl text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="w-full flex-1">
              {isEditing ? (
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-2">
                    <Label className="font-medium" htmlFor="displayName">
                      Display Name
                    </Label>
                    <Input
                      className="brutal-border"
                      id="displayName"
                      {...register("displayName")}
                    />
                    {errors.displayName && (
                      <p className="text-destructive text-sm">
                        {errors.displayName.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="brutal-border brutal-shadow-sm brutal-hover bg-primary text-primary-foreground"
                      disabled={isUpdatingProfile}
                      type="submit"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      className="brutal-border brutal-shadow-sm brutal-hover bg-transparent"
                      onClick={handleCancel}
                      type="button"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="mb-1 font-bold text-2xl">
                    {user?.displayName}
                  </h2>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Joined{" "}
                      {user?.createdAt
                        ? format(new Date(user.createdAt), "MMMM yyyy")
                        : "-"}
                    </p>
                  </div>
                  <Button
                    className="brutal-border brutal-shadow-sm brutal-hover mt-4"
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="brutal-border brutal-shadow mb-6 bg-card p-6 sm:p-8">
          <h3 className="mb-4 font-bold text-lg">Preferences</h3>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between border-border border-b py-4">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-muted-foreground text-sm">
                Choose your preferred color scheme
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className={cn(
                  "brutal-border brutal-hover",
                  theme === "light" &&
                    "brutal-shadow-sm bg-primary text-primary-foreground"
                )}
                onClick={() => setTheme("light")}
                size="sm"
                variant="outline"
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </Button>
              <Button
                className={cn(
                  "brutal-border brutal-hover",
                  theme === "dark" &&
                    "brutal-shadow-sm bg-primary text-primary-foreground"
                )}
                onClick={() => setTheme("dark")}
                size="sm"
                variant="outline"
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </Button>
            </div>
          </div>

          {/* Export Data */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-muted-foreground text-sm">
                Download your journal entries from the last 120 days as JSON
              </p>
            </div>
            <Button
              className="brutal-border brutal-shadow-sm brutal-hover bg-transparent"
              disabled={isExporting}
              onClick={handleExport}
              variant="outline"
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="brutal-border brutal-shadow bg-card p-6 sm:p-8">
          <h3 className="mb-4 font-bold text-destructive text-lg">Account</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sign Out</p>
              <p className="text-muted-foreground text-sm">
                Sign out from your account on this device
              </p>
            </div>
            <Button
              className="brutal-border brutal-shadow-sm brutal-hover text-destructive hover:bg-destructive hover:text-destructive-foreground"
              disabled={isLoggingOut}
              onClick={() => logout()}
              variant="outline"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
