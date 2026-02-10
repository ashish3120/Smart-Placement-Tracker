import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Briefcase } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { DeadlineIndicator } from "@/components/DeadlineIndicator";
import api from "../lib/api";
import { toast } from "sonner";

// Define type based on backend standard
export interface Opportunity {
  id: string; // mapped from _id
  company: string; // mapped from company_name
  role: string;
  ctc: string;
  deadline: string;
  status: string; // Applied, Interview, etc.
  eligibility: string;
}

const Opportunities = () => {
  const [data, setData] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deadlineFilter, setDeadlineFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // New Opportunity Form State
  const [newOpp, setNewOpp] = useState({
    company_name: '',
    role: '',
    ctc: '',
    deadline: '',
    eligibility: ''
  });

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/opportunities');
      // Map backend fields to frontend expected fields
      const mapped = res.data.data.map((o: any) => ({
        id: o._id,
        company: o.company_name,
        role: o.role,
        ctc: o.ctc,
        deadline: o.deadline,
        status: 'Not Applied', // Default if not found in applications, but we need application status?
        // Wait, the backend Opportunities list doesn't return application status automatically unless we join them.
        // The dashboard fetched applications.
        // We might need to fetch applications to know the status of each opportunity.
        eligibility: o.eligibility
      }));

      // We also need applications to know the status
      const appRes = await api.get('/applications');
      const applications = appRes.data.data;
      const appMap: Record<string, string> = {};
      applications.forEach((a: any) => {
        // applications has opportunity_id as object (populated) or string? 
        // My service populates it.
        const oppId = a.opportunity_id._id || a.opportunity_id;
        appMap[oppId] = a.status;
      });

      const finalData = mapped.map((o: Opportunity) => ({
        ...o,
        status: appMap[o.id] || 'Not Applied'
      }));

      setData(finalData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleAddOpportunity = async () => {
    try {
      await api.post('/opportunities', newOpp);
      toast.success("Opportunity added successfully!");
      setDialogOpen(false);
      setNewOpp({ company_name: '', role: '', ctc: '', deadline: '', eligibility: '' });
      fetchOpportunities(); // Refresh
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add opportunity");
    }
  };

  const filtered = useMemo(() => {
    const now = new Date();
    return data.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (deadlineFilter === "upcoming" && new Date(o.deadline) <= now) return false;
      if (deadlineFilter === "past" && new Date(o.deadline) > now) return false;
      if (search && !o.company.toLowerCase().includes(search.toLowerCase()) && !o.role.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [data, statusFilter, deadlineFilter, search]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: data.length };
    data.forEach((o) => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return counts;
  }, [data]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Opportunities</h1>
          <p className="text-sm text-muted-foreground mt-1">{data.length} companies tracked</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 rounded-xl h-9 px-4 text-[13px]">
              <Plus className="h-4 w-4" /> Add Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Opportunity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Company</Label>
                  <Input
                    placeholder="e.g. Google"
                    className="h-9"
                    value={newOpp.company_name}
                    onChange={(e) => setNewOpp({ ...newOpp, company_name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Role</Label>
                  <Input
                    placeholder="e.g. SDE-1"
                    className="h-9"
                    value={newOpp.role}
                    onChange={(e) => setNewOpp({ ...newOpp, role: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">CTC</Label>
                  <Input
                    placeholder="e.g. ₹24 LPA"
                    className="h-9"
                    value={newOpp.ctc}
                    onChange={(e) => setNewOpp({ ...newOpp, ctc: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Deadline</Label>
                  <Input
                    type="date"
                    className="h-9"
                    value={newOpp.deadline}
                    onChange={(e) => setNewOpp({ ...newOpp, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Eligibility</Label>
                <Input
                  placeholder="e.g. CS/IT, 7.0+ CGPA"
                  className="h-9"
                  value={newOpp.eligibility}
                  onChange={(e) => setNewOpp({ ...newOpp, eligibility: e.target.value })}
                />
              </div>
              <Button className="w-full rounded-xl" onClick={handleAddOpportunity}>
                Add Opportunity
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies or roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] h-9 rounded-xl text-[13px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
            <SelectItem value="Not Applied">Not Applied</SelectItem>
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Interview">Interview</SelectItem>
            <SelectItem value="Selected">Selected</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deadlineFilter} onValueChange={setDeadlineFilter}>
          <SelectTrigger className="w-[150px] h-9 rounded-xl text-[13px]">
            <SelectValue placeholder="Deadline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Deadlines</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-[1fr_120px_100px_100px] gap-4 px-5 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
        <span>Company</span>
        <span>Status</span>
        <span>CTC</span>
        <span className="text-right">Deadline</span>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-10">Loading opportunities...</div>
      ) : filtered.length === 0 ? (
        <Card className="border-0 card-elevated">
          <CardContent className="py-16 text-center">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No opportunities match your filters</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((o) => (
            <Link to={`/opportunities/${o.id}`} key={o.id}>
              <Card className="border-0 card-interactive cursor-pointer">
                <CardContent className="p-4 md:grid md:grid-cols-[1fr_120px_100px_100px] md:gap-4 md:items-center flex flex-col gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-muted-foreground">{o.company.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{o.company}</p>
                      <p className="text-xs text-muted-foreground">{o.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={o.status} />
                  <span className="text-sm font-medium">{o.ctc}</span>
                  <div className="text-right">
                    <DeadlineIndicator deadline={o.deadline} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Opportunities;
