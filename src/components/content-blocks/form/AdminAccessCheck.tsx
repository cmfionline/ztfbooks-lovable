import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AdminAccessCheckProps {
  onAccessGranted: (isAdmin: boolean) => void;
}

export const AdminAccessCheck = ({ onAccessGranted }: AdminAccessCheckProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error("No active session");
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          throw error;
        }

        if (profile && ["admin", "super_admin"].includes(profile.role)) {
          onAccessGranted(true);
          return;
        }

        throw new Error("Insufficient permissions");
      } catch (error) {
        toast({
          title: "Access denied",
          description: "You need admin privileges to manage content blocks",
          variant: "destructive",
        });
        navigate("/");
        onAccessGranted(false);
      }
    };

    checkAdminAccess();
  }, [navigate, toast, onAccessGranted]);

  return null;
};