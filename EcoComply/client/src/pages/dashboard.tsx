import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComplaintCard } from "@/components/complaint-card";
import { Complaint, Industry } from "@shared/schema";
import { FileText, Building2, CheckCircle, Clock, Plus, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: complaints = [] } = useQuery<Complaint[]>({
    queryKey: user?.role === 'citizen' ? ['/api/complaints/my'] : ['/api/complaints'],
  });

  const { data: industries = [] } = useQuery<Industry[]>({
    queryKey: user?.role === 'industry' ? ['/api/industries/my'] : ['/api/industries'],
    enabled: user?.role === 'industry' || user?.role === 'admin',
  });

  const { data: stats } = useQuery<{
    totalComplaints: number;
    resolvedComplaints: number;
    pendingComplaints: number;
    totalIndustries?: number;
  }>({
    queryKey: ['/api/stats'],
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-welcome">
          {getGreeting()}, {user?.firstName || user?.email}!
        </h1>
        <p className="text-muted-foreground" data-testid="text-dashboard-subtitle">
          {user?.role === 'admin' 
            ? 'Monitor and manage environmental compliance across all sectors'
            : user?.role === 'industry'
            ? 'Track your compliance reports and environmental performance'
            : 'Track your complaints and environmental concerns'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="stat-total-complaints">
              {stats?.totalComplaints || complaints.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.role === 'citizen' ? 'Your submissions' : 'All submissions'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="stat-resolved">
              {stats?.resolvedComplaints || complaints.filter(c => c.status === 'resolved').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="stat-pending">
              {stats?.pendingComplaints || complaints.filter(c => c.status !== 'resolved').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting action
            </p>
          </CardContent>
        </Card>

        {(user?.role === 'industry' || user?.role === 'admin') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
              <CardTitle className="text-sm font-medium">Industries</CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="stat-industries">
                {stats?.totalIndustries || industries.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {user?.role === 'industry' ? 'Your businesses' : 'Registered businesses'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {user?.role === 'citizen' && (
          <Card className="hover-elevate cursor-pointer" onClick={() => setLocation('/submit-complaint')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-quick-action-submit">Submit Complaint</h3>
                  <p className="text-sm text-muted-foreground">Report a new issue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user?.role === 'industry' && (
          <Card className="hover-elevate cursor-pointer" onClick={() => setLocation('/compliance/submit')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-quick-action-report">Submit Report</h3>
                  <p className="text-sm text-muted-foreground">Upload compliance docs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user?.role === 'admin' && (
          <Card className="hover-elevate cursor-pointer" onClick={() => setLocation('/admin/analytics')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-quick-action-analytics">View Analytics</h3>
                  <p className="text-sm text-muted-foreground">Data insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Complaints */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" data-testid="text-recent-complaints">Recent Complaints</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLocation(user?.role === 'citizen' ? '/complaints' : '/admin/complaints')}
            data-testid="button-view-all"
          >
            View All
          </Button>
        </div>
        
        {recentComplaints.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2" data-testid="text-no-complaints">No complaints yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {user?.role === 'citizen' 
                  ? "Submit your first complaint to get started"
                  : "No complaints have been submitted yet"}
              </p>
              {user?.role === 'citizen' && (
                <Button onClick={() => setLocation('/submit-complaint')} data-testid="button-submit-first">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Complaint
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentComplaints.map((complaint) => (
              <ComplaintCard 
                key={complaint.id} 
                complaint={complaint}
                onViewDetails={() => setLocation(`/complaints/${complaint.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
