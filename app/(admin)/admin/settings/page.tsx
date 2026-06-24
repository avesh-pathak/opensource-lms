'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Settings,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Save,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

export default function PlatformSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  // Platform settings state
  const [settings, setSettings] = useState({
    siteName: 'Babua DSA',
    supportEmail: 'support@babuadsa.com',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    mentorshipEnabled: true,
    hackathonsEnabled: true,
    razorpayEnabled: true,
    defaultSessionPrice: 399,
  })

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save (in real app, call API)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success('Settings saved successfully!')
    setIsSaving(false)
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
              Platform Settings
            </h1>
            <p className="text-muted-foreground font-medium">
              Configure global platform settings and features.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase italic">
              <Globe className="h-5 w-5 text-primary" />
              General
            </CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">
                  Site Name
                </Label>
                <Input
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">
                  Support Email
                </Label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, supportEmail: e.target.value })
                  }
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-bold">Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Disable access for non-admin users
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, maintenanceMode: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-bold">Allow Registration</Label>
                <p className="text-xs text-muted-foreground">
                  Allow new users to sign up
                </p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, allowRegistration: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase italic">
              <Shield className="h-5 w-5 text-primary" />
              Features
            </CardTitle>
            <CardDescription>
              Enable or disable platform features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-bold">Mentorship System</Label>
                <p className="text-xs text-muted-foreground">
                  Allow booking mentorship sessions
                </p>
              </div>
              <Switch
                checked={settings.mentorshipEnabled}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, mentorshipEnabled: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-bold">Hackathons</Label>
                <p className="text-xs text-muted-foreground">
                  Enable hackathon listings and submissions
                </p>
              </div>
              <Switch
                checked={settings.hackathonsEnabled}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, hackathonsEnabled: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase italic">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Configure notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-bold">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Send booking confirmations via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Payments */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase italic">
              <CreditCard className="h-5 w-5 text-primary" />
              Payments
            </CardTitle>
            <CardDescription>Payment gateway configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-bold">Razorpay Integration</Label>
                <p className="text-xs text-muted-foreground">
                  Enable payment processing
                </p>
              </div>
              <Switch
                checked={settings.razorpayEnabled}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, razorpayEnabled: checked })
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">
                Default Session Price (₹)
              </Label>
              <Input
                type="number"
                value={settings.defaultSessionPrice}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultSessionPrice: parseInt(e.target.value) || 0,
                  })
                }
                className="h-11 rounded-xl max-w-[200px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-12 px-8 rounded-xl font-black italic uppercase tracking-widest"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
