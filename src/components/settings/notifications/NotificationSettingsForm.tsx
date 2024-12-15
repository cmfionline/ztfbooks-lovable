import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { NotificationSettingSwitch } from "./NotificationSettingSwitch";

interface NotificationSettingsFormProps {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  isSaving: boolean;
  onEmailNotificationsChange: (checked: boolean) => void;
  onPushNotificationsChange: (checked: boolean) => void;
  onMarketingEmailsChange: (checked: boolean) => void;
  onSave: () => void;
}

export const NotificationSettingsForm = ({
  emailNotifications,
  pushNotifications,
  marketingEmails,
  isSaving,
  onEmailNotificationsChange,
  onPushNotificationsChange,
  onMarketingEmailsChange,
  onSave,
}: NotificationSettingsFormProps) => {
  return (
    <div className="space-y-6">
      <NotificationSettingSwitch
        id="email-notifications"
        label="Email Notifications"
        description="Receive important updates and notifications via email"
        checked={emailNotifications}
        onCheckedChange={onEmailNotificationsChange}
      />
      <NotificationSettingSwitch
        id="push-notifications"
        label="Push Notifications"
        description="Get instant notifications on your device"
        checked={pushNotifications}
        onCheckedChange={onPushNotificationsChange}
      />
      <NotificationSettingSwitch
        id="marketing-emails"
        label="Marketing Emails"
        description="Receive updates about new features and promotions"
        checked={marketingEmails}
        onCheckedChange={onMarketingEmailsChange}
      />
      <Button 
        onClick={onSave}
        disabled={isSaving}
        className="w-full bg-purple hover:bg-purple/90"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Changes...
          </>
        ) : (
          'Save Preferences'
        )}
      </Button>
    </div>
  );
};