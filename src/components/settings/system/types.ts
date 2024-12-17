export interface GlobalSettingsData {
  site_name: string;
  contact_email: string;
  support_phone: string;
  logos: {
    admin: string | null;
    client: string | null;
  };
}