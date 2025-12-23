import { Settings, Bell, Shield, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function AdminSettings() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your LMS platform</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* General Settings */}
        <div className="content-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
              <p className="text-sm text-muted-foreground">Basic platform configuration</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" defaultValue="English Learning Platform" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxGroupSize">Max Group Size</Label>
              <Input id="maxGroupSize" type="number" defaultValue="20" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="content-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Configure email notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">New Student Registration</p>
                <p className="text-sm text-muted-foreground">Get notified when students register</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Payment Expiry Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified before payments expire</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Low Attendance Alerts</p>
                <p className="text-sm text-muted-foreground">Alert when attendance drops below 60%</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="content-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Security</h2>
              <p className="text-sm text-muted-foreground">Security and access settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Auto-block Expired Payments</p>
                <p className="text-sm text-muted-foreground">Automatically restrict access when payment expires</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="content-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Data Management</h2>
              <p className="text-sm text-muted-foreground">Export and backup options</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">Export Students</Button>
            <Button variant="outline">Export Groups</Button>
            <Button variant="outline">Export Attendance</Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
