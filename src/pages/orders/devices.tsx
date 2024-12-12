import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const DevicesPage = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const { data: devices, isLoading } = useQuery({
    queryKey: ["devices", search],
    queryFn: async () => {
      let query = supabase
        .from("authorized_devices")
        .select(`
          *,
          profiles:profiles(full_name)
        `)
        .order("last_active", { ascending: false });

      if (search) {
        query = query.or(`profiles.full_name.ilike.%${search}%,device_id.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching devices",
          description: error.message,
        });
        throw error;
      }

      return data;
    },
  });

  const handleDeviceStatusToggle = async (deviceId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("authorized_devices")
      .update({ is_active: !currentStatus })
      .eq("id", deviceId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating device status",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Device status updated",
      description: `Device has been ${!currentStatus ? "activated" : "deactivated"}`,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Device Management</h1>
          <p className="text-muted-foreground">
            Manage authorized devices for ebook access
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <div className="bg-background rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Device Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices?.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-mono">{device.device_id}</TableCell>
                <TableCell>{device.profiles?.full_name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    {device.device_name || "Unknown Device"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={device.is_active ? "default" : "secondary"}
                  >
                    {device.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {device.last_active
                    ? new Date(device.last_active).toLocaleString()
                    : "Never"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeviceStatusToggle(device.id, device.is_active)}
                  >
                    {device.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DevicesPage;