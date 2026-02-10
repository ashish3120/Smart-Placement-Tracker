import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2 } from "lucide-react";
import api from "../lib/api";

const PreparationHub = () => {
  const [globalChecklist, setGlobalChecklist] = useState([
    { id: '1', label: 'Resume Review', completed: false },
    { id: '2', label: 'LinkedIn Profile Update', completed: false },
    { id: '3', label: 'Mock Interview 1', completed: false }
  ]);

  const [companyPrep, setCompanyPrep] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch applications to find active ones
        const appRes = await api.get('/applications');
        const applications = appRes.data.data.filter((a: any) =>
          ['Applied', 'Interview', 'Selected'].includes(a.status)
        );

        const prepList = [];
        for (const app of applications) {
          const oppId = app.opportunity_id._id || app.opportunity_id;
          // Fetch prep for each
          try {
            const prepRes = await api.get(`/preparation/${oppId}`);
            if (prepRes.data.data) {
              const p = prepRes.data.data;
              // Populate company name if possible, or we rely on app.opportunity_id populated
              // My Application service populates opportunity_id
              const companyName = app.opportunity_id.company_name || 'Unknown Company';
              const role = app.opportunity_id.role || 'Role';

              prepList.push({
                id: p._id,
                company: companyName,
                role: role,
                checklist: p.checklist_items
              });
            }
          } catch (e) {
            console.error("Failed to fetch prep for opp", oppId);
          }
        }
        setCompanyPrep(prepList);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedCount = globalChecklist.filter((c) => c.completed).length;
  const progress = Math.round((completedCount / globalChecklist.length) * 100);

  const toggleGlobalItem = (id: string) => {
    setGlobalChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  if (loading) return <div className="p-10 text-center">Loading preparation data...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Preparation Hub</h1>
        <p className="text-sm text-muted-foreground mt-1">Stop random prep. Make it intentional.</p>
      </div>

      {/* Overall Readiness (Static/Local for now) */}
      <Card className="border-0 card-elevated">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-status-success flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold">General Readiness</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">{progress}%</span>
              <p className="text-[11px] text-muted-foreground">{completedCount}/{globalChecklist.length} tasks</p>
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-4 mb-6" />
          <div className="space-y-0.5">
            {globalChecklist.map((item) => (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleGlobalItem(item.id)}
                  className="h-5 w-5"
                />
                <span className={`text-sm ${item.completed ? "line-through text-muted-foreground" : "font-medium"}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company-wise Prep */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Company-wise Preparation</h2>
        {companyPrep.length === 0 ? (
          <Card className="border-0 card-elevated">
            <CardContent className="py-12 text-center">
              <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No active opportunities to prepare for</p>
              <p className="text-xs text-muted-foreground mt-1">Apply to companies to start tracking prep</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {companyPrep.map((o) => {
              const prepItems = o.checklist || [];
              const done = prepItems.filter((i: any) => i.completed).length;
              const total = prepItems.length;
              const pct = total === 0 ? 0 : Math.round((done / total) * 100);

              return (
                <Card key={o.id} className="border-0 card-elevated">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                          {o.company.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{o.company}</p>
                          <p className="text-[11px] text-muted-foreground">{o.role}</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5 mb-3" />
                    <div className="space-y-1">
                      {prepItems.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${item.completed ? 'bg-status-success' : 'bg-muted'}`} />
                          <span className={`text-xs ${item.completed ? 'text-muted-foreground' : ''}`}>{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreparationHub;
