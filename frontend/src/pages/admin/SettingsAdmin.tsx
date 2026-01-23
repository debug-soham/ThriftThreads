import { Settings } from 'lucide-react';

const SettingsAdmin = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings</p>
      </div>

      <div className="bg-background rounded-sm border border-border p-12 text-center">
        <Settings size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="font-display text-lg font-semibold mb-2">Settings Coming Soon</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Store settings, payment configuration, shipping options, and more will be available here.
        </p>
      </div>
    </div>
  );
};

export default SettingsAdmin;
