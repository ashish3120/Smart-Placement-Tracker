import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload, User, Bell, FileText } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      setUser(JSON.parse(u));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("Logged out");
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile & Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your info and preferences.</p>
        </div>
        <Button variant="destructive" size="sm" onClick={handleLogout}>Logout</Button>
      </div>

      {/* Student Info */}
      <Card className="border-0 card-elevated">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <h2 className="text-sm font-semibold">Student Information</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Full Name</Label>
                <Input defaultValue={user.name} className="h-9 rounded-xl" readOnly />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Roll Number</Label>
                <Input defaultValue="21CS1045" className="h-9 rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Branch</Label>
                <Input defaultValue="Computer Science" className="h-9 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">CGPA</Label>
                <Input defaultValue="8.2" className="h-9 rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Email</Label>
              <Input defaultValue={user.email} type="email" className="h-9 rounded-xl" readOnly />
            </div>
            <Button size="sm" className="rounded-xl h-9 px-5">Save Changes</Button>
            <p className="text-[11px] text-muted-foreground">Note: Name and Email updates are disabled in this demo.</p>
          </div>
        </CardContent>
      </Card>

      {/* Resume Upload */}
      <Card className="border-0 card-elevated">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <h2 className="text-sm font-semibold">Resume</h2>
          </div>
          <div className="border-2 border-dashed rounded-2xl p-10 text-center hover:border-[hsl(var(--primary)/0.4)] hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm">
              Drag & drop your resume, or <span className="text-[hsl(var(--primary))] font-semibold cursor-pointer">browse</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1.5">PDF, DOC up to 5MB</p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-0 card-elevated">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
              <Bell className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <h2 className="text-sm font-semibold">Notifications</h2>
          </div>
          <div className="space-y-1">
            {[
              { label: "Deadline reminders", desc: "Get notified 24 hours before application deadlines", defaultChecked: true },
              { label: "Interview reminders", desc: "Get notified before scheduled interviews", defaultChecked: true },
              { label: "New opportunity alerts", desc: "When new companies are added to the tracker", defaultChecked: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.defaultChecked} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
