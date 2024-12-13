import { NotificationForm } from "@/components/notifications/NotificationForm";
import { NotificationHistory } from "@/components/notifications/NotificationHistory";

const Notifications = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <div className="grid gap-8">
        <NotificationForm />
        <NotificationHistory />
      </div>
    </div>
  );
};

export default Notifications;