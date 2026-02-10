import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Calendar, Clock, Trophy, AlertTriangle, ArrowUpRight, TrendingUp } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { DeadlineIndicator } from "@/components/DeadlineIndicator";
import api from "../lib/api";
import { toast } from "sonner";

interface DashboardSummary {
  applied: number;
  interviews: number;
  selected: number; // offers
  rejected: number;
  upcoming_deadlines: any[];
}

interface DashboardToday {
  interviews_today: any[];
  urgent_deadlines: any[];
}

const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [today, setToday] = useState<DashboardToday | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = localStorage.getItem('user');
        if (u) setUser(JSON.parse(u));

        const [summaryRes, todayRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/today')
        ]);

        setSummary(summaryRes.data.data);
        setToday(todayRes.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        toast.error("Failed to load dashboard data. Please make sure you are logged in.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  const now = new Date();

  // Default values if API fails or returns null
  const stats = [
    { label: "Applied", value: summary?.applied || 0, icon: Briefcase, accent: "bg-status-info" },
    { label: "Interviews", value: summary?.interviews || 0, icon: Calendar, accent: "bg-status-warning" },
    { label: "Upcoming Deadlines", value: summary?.upcoming_deadlines?.length || 0, icon: Clock, accent: "bg-muted text-muted-foreground" },
    { label: "Offers", value: summary?.selected || 0, icon: Trophy, accent: "bg-status-success" },
  ];

  const urgent = today?.urgent_deadlines || [];
  const todayInterviews = today?.interviews_today || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Good {now.getHours() < 12 ? "morning" : now.getHours() < 17 ? "afternoon" : "evening"}, {user?.name || 'Student'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {now.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="card-elevated border-0">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${s.accent}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="text-3xl font-bold tracking-tight">{s.value}</span>
              </div>
              <p className="text-[13px] text-muted-foreground mt-3 font-medium">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Urgent Section */}
      {urgent.length > 0 && (
        <Card className="border-[hsl(var(--status-urgent)/0.2)] card-elevated border-0 bg-[hsl(var(--status-urgent)/0.03)]">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-status-urgent flex items-center justify-center">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-sm font-semibold">Deadline within 24 hours</h2>
              <span className="ml-auto text-xs text-muted-foreground">{urgent.length} {urgent.length === 1 ? "company" : "companies"}</span>
            </div>
            <div className="space-y-2">
              {urgent.map((o: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-card hover:bg-accent transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {o.company_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-[hsl(var(--primary))] transition-colors">{o.company_name}</p>
                      <p className="text-xs text-muted-foreground">{o.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DeadlineIndicator deadline={o.deadline} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Today's Interviews */}
        <Card className="card-elevated border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-status-warning flex items-center justify-center">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-sm font-semibold">Today's Interviews</h2>
            </div>
            {todayInterviews.length === 0 ? (
              <div className="py-6 text-center">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No interviews today</p>
                <p className="text-xs text-muted-foreground mt-1">Good time to prepare for upcoming ones</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayInterviews.map((o: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-card flex items-center justify-center text-sm font-bold text-muted-foreground border">
                        {o.opportunity_id?.company_name.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{o.opportunity_id?.company_name}</p>
                        <p className="text-xs text-muted-foreground">{o.opportunity_id?.role}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-card px-2.5 py-1 rounded-full border">
                      {o.interview_date && new Date(o.interview_date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Tasks (Placeholder for now as per plan) */}
        <Card className="card-elevated border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <h2 className="text-sm font-semibold">Pending Tasks</h2>
              <span className="ml-auto text-xs text-muted-foreground font-medium">0 remaining</span>
            </div>
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">All caught up! 🎉</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
