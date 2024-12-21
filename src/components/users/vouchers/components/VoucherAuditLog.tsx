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
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface VoucherAuditLogProps {
  voucherId?: string;
}

export const VoucherAuditLog = ({ voucherId }: VoucherAuditLogProps) => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['voucher-audit-logs', voucherId],
    queryFn: async () => {
      const query = supabase
        .from('voucher_audit_logs')
        .select(`
          *,
          performer:performed_by(full_name)
        `)
        .order('created_at', { ascending: false });

      if (voucherId) {
        query.eq('voucher_id', voucherId);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Audit Log</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Performed By</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs?.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.action_type}</TableCell>
              <TableCell>{log.performer?.full_name}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
          {!logs?.length && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No audit logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};