"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DeleteAccountButton from "@/components/settings/delete-account-button";

export default function AccountTab() {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-2xl">Account Settings</CardTitle>
        <CardDescription>
          Manage your account details and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h3>
          <p className="text-sm text-gray-500 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <DeleteAccountButton />
        </div>
      </CardContent>
    </Card>
  );
}
