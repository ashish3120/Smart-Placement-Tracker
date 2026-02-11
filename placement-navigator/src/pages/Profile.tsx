import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload, User, Bell, FileText } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    roll_number: "",
    branch: "",
    cgpa: ""
  });

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      const parsed = JSON.parse(u);
      setUser(parsed);
      setProfileData({
        roll_number: parsed.roll_number || "",
        branch: parsed.branch || "",
        cgpa: parsed.cgpa || ""
      });
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploading(true);
      const res = await api.post('/auth/upload-resume', formData);

      if (res.data.success) {
        const updatedUser = { ...user, resume_path: res.data.filePath };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('user-updated'));
        toast.success("Resume uploaded successfully!");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.error || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatedUser = { ...user, ...profileData };
      // Save to local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      // Notify sidebar
      window.dispatchEvent(new Event('user-updated'));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
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
                <Input
                  value={profileData.roll_number}
                  onChange={e => setProfileData({ ...profileData, roll_number: e.target.value })}
                  className="h-9 rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Branch</Label>
                <Input
                  value={profileData.branch}
                  onChange={e => setProfileData({ ...profileData, branch: e.target.value })}
                  className="h-9 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">CGPA</Label>
                <Input
                  value={profileData.cgpa}
                  onChange={e => setProfileData({ ...profileData, cgpa: e.target.value })}
                  className="h-9 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Email</Label>
              <Input defaultValue={user.email} type="email" className="h-9 rounded-xl" readOnly />
            </div>
            <Button size="sm" className="rounded-xl h-9 px-5" onClick={handleSave}>Save Changes</Button>
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

          <div className="space-y-4">
            {user.resume_path && (
              <div className="flex items-center justify-between p-4 bg-accent/30 rounded-2xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-status-info/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-[hsl(var(--status-info))]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Current Resume</p>
                    <a
                      href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.resume_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[hsl(var(--primary))] hover:underline"
                    >
                      View uploaded PDF
                    </a>
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider bg-background px-2 py-1 rounded-md border">
                  PDF
                </div>
              </div>
            )}

            <div
              className="border-2 border-dashed rounded-2xl p-10 text-center hover:border-[hsl(var(--primary)/0.4)] hover:bg-accent/50 transition-colors cursor-pointer relative group"
              onClick={() => document.getElementById('resume-upload')?.click()}
            >
              <input
                id="resume-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 group-hover:bg-[hsl(var(--primary)/0.1)] transition-colors">
                <Upload className={`h-5 w-5 ${uploading ? 'animate-bounce' : 'text-muted-foreground group-hover:text-[hsl(var(--primary))]'}`} />
              </div>
              <p className="text-sm">
                {uploading ? "Uploading..." : user.resume_path ? "Replace your resume, or browse" : "Drag & drop your resume, or browse"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1.5">PDF, DOC up to 5MB</p>
            </div>
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
