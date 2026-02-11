import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, IndianRupee, Calendar, GraduationCap, Building2, Check } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import api from "../lib/api";
import { toast } from "sonner";
import { Opportunity } from "./Opportunities"; // Import type

interface Preparation {
  _id: string;
  checklist_items: { title: string; completed: boolean }[];
  notes: string;
}

const OpportunityDetail = () => {
  const { id } = useParams();
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  // Application State
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Not Applied");
  const [interviewDate, setInterviewDate] = useState<string | null>(null); // For future use if we add date picker

  // Preparation State
  const [prepData, setPrepData] = useState<Preparation | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // 1. Fetch Opportunity
        const oppRes = await api.get(`/opportunities/${id}`);
        const o = oppRes.data.data;
        setOpp({
          id: o._id,
          company: o.company_name,
          role: o.role,
          ctc: o.ctc,
          deadline: o.deadline,
          status: 'Not Applied', // Placeholder
          eligibility: o.eligibility
        });

        // 2. Fetch Application Status
        const appRes = await api.get('/applications');
        const myApps = appRes.data.data;
        // Handle both populated object and string ID
        const myApp = myApps.find((a: any) => {
          if (!a.opportunity_id) return false;
          const aOppId = String(a.opportunity_id._id || a.opportunity_id);
          return aOppId === String(id);
        });

        if (myApp) {
          setApplicationId(myApp._id);
          setStatus(myApp.status);
        }

        // 3. Fetch Preparation
        // Only if applied or interested? API handles creation if not exists usually.
        // My backend auto-creates preparation on GET if it doesn't exist?
        // Let's check backend logic. Yes, `getPreparation` creates it if missing.
        const prepRes = await api.get(`/preparation/${id}`);
        if (prepRes.data.data) {
          setPrepData(prepRes.data.data);
          setNotes(prepRes.data.data.notes || "");
        }

      } catch (error) {
        console.error("Error fetching detail:", error);
        // toast.error("Failed to load opportunity details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);


  const handleStatusChange = async (newStatus: string) => {
    try {
      if (newStatus === "Not Applied") {
        // We can't really "delete" application via this UI easily without a delete endpoint logic or just leave it.
        // Backend doesn't support deleting application easily in my implementation (I have delete route but...)
        // Let's assume user wants to 'Delete' application if they select 'Not Applied'?
        // For now, I'll just show warning or disable reverting to Not Applied if configured.
        // But let's support "Applied" -> "Interview" etc.
        return;
      }

      if (!applicationId && newStatus === "Applied") {
        // Create Application
        const res = await api.post('/applications', { opportunity_id: id });
        setApplicationId(res.data.data._id);
        setStatus("Applied");
        toast.success("Application created!");
      } else if (applicationId) {
        // Update Application
        await api.put(`/applications/${applicationId}/status`, { status: newStatus });
        setStatus(newStatus);
        toast.success("Status updated!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update status");
    }
  };

  const handleNoteChange = async (newNotes: string) => {
    setNotes(newNotes);
    // Debounce or save on blur usually. For simplicity, save on blur or separate button?
    // I'll add a "Save Notes" effect or just save on every change is too much api calls.
    // Let's save on blur (onBlur event). But Textarea onChange updates state.
  };

  const savePreparation = async () => {
    if (!id || !prepData) return;
    try {
      await api.put(`/preparation/${id}`, {
        checklist_items: prepData.checklist_items,
        notes: notes
      });
      //   toast.success("Preparation saved");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleChecklist = (idx: number, checked: boolean) => {
    if (!prepData) return;
    const newItems = [...prepData.checklist_items];
    newItems[idx].completed = checked;
    setPrepData({ ...prepData, checklist_items: newItems });

    // Auto save
    api.put(`/preparation/${id}`, {
      checklist_items: newItems,
      notes: notes
    }).catch(err => console.error(err));
  };


  if (loading) return <div className="p-10 text-center">Loading details...</div>;

  if (!opp) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <Link to="/opportunities" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <p className="text-muted-foreground">Opportunity not found.</p>
      </div>
    );
  }

  const deadline = new Date(opp.deadline);
  const isPast = deadline < new Date();

  const timelineSteps = ["Applied", "Interview", "Selected"] as const;
  const statusIndex = timelineSteps.indexOf(status as any);

  const checklist = prepData?.checklist_items || [];
  const prepDone = checklist.filter(i => i.completed).length;
  const prepTotal = checklist.length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link to="/opportunities" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Opportunities
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
            {opp.company.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{opp.company}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{opp.role}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={status as any} />
          {status === "Not Applied" && !isPast && (
            <Button
              onClick={() => handleStatusChange("Applied")}
              size="sm"
              className="rounded-xl px-6 h-9 bg-[hsl(var(--primary))] hover:opacity-90 transition-opacity"
            >
              Apply Now
            </Button>
          )}
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: IndianRupee, label: "CTC", value: opp.ctc },
          { icon: GraduationCap, label: "Eligibility", value: opp.eligibility },
          { icon: Calendar, label: "Deadline", value: deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
          { icon: Building2, label: "Status", value: isPast ? "Deadline passed" : "Active" },
        ].map((item) => (
          <Card key={item.label} className="border-0 card-elevated">
            <CardContent className="p-4">
              <item.icon className="h-4 w-4 text-muted-foreground mb-2" />
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{item.label}</p>
              <p className="text-sm font-semibold mt-1">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline */}
      <Card className="border-0 card-elevated">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold mb-5">Application Timeline</h3>
          <div className="flex items-center">
            {timelineSteps.map((step, i) => {
              const isCompleted = status !== "Rejected" && i <= statusIndex;
              const isCurrent = status !== "Rejected" && i === statusIndex;
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${status === "Rejected"
                        ? "bg-muted text-muted-foreground"
                        : isCompleted
                          ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={`text-[11px] font-medium ${isCurrent ? "text-[hsl(var(--primary))]" : "text-muted-foreground"}`}>
                      {step}
                    </span>
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded-full ${status !== "Rejected" && i < statusIndex ? "bg-[hsl(var(--primary))]" : "bg-border"
                      }`} />
                  )}
                </div>
              );
            })}
          </div>
          {status === "Rejected" && (
            <p className="text-xs status-urgent mt-4 bg-status-urgent px-3 py-1.5 rounded-lg inline-block">Application rejected</p>
          )}
          <div className="mt-5 pt-5 border-t">
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium block mb-2">Update Status</label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px] h-9 rounded-xl text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Applied">Not Applied</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Selected">Selected</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Preparation Checklist */}
      <Card className="border-0 card-elevated">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold">Preparation Checklist</h3>
            <span className="text-xs font-medium text-muted-foreground">{prepDone}/{prepTotal} complete</span>
          </div>
          <div className="space-y-1">
            {checklist.map((item, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={(checked) => toggleChecklist(idx, !!checked)}
                  className="h-5 w-5"
                />
                <div>
                  <span className={`text-sm font-medium block ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                    {item.title}
                  </span>
                </div>
              </label>
            ))}
            {checklist.length === 0 && <p className="text-sm text-muted-foreground">No checklist items found.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="border-0 card-elevated">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Notes</h3>
            <Button
              size="sm"
              variant="outline"
              className="h-8 rounded-lg text-xs"
              onClick={async () => {
                await savePreparation();
                toast.success("Preparation details saved!");
              }}
            >
              Save All Progress
            </Button>
          </div>
          <Textarea
            value={notes}
            onChange={(e) => handleNoteChange(e.target.value)}
            onBlur={savePreparation}
            placeholder="Add preparation notes, interview tips, company research..."
            className="min-h-[140px] resize-none rounded-xl border-0 bg-muted/50 focus-visible:bg-background"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OpportunityDetail;
