import { useQuery } from "@tanstack/react-query";
import { ComplaintCard } from "@/components/complaint-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Complaint } from "@shared/schema";
import { Plus, Filter, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Complaints() {
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { data: complaints = [], isLoading } = useQuery<Complaint[]>({
    queryKey: ['/api/complaints/my'],
  });

  const filteredComplaints = complaints.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2" data-testid="text-page-title">My Complaints</h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            Track all your environmental complaints
          </p>
        </div>
        <Button onClick={() => setLocation('/submit-complaint')} data-testid="button-submit-new">
          <Plus className="w-4 h-4 mr-2" />
          Submit New
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40" data-testid="select-category-filter">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="air">Air</SelectItem>
            <SelectItem value="water">Water</SelectItem>
            <SelectItem value="waste">Waste</SelectItem>
            <SelectItem value="noise">Noise</SelectItem>
            <SelectItem value="industrial">Industrial</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Complaints Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-48" />
            </Card>
          ))}
        </div>
      ) : filteredComplaints.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2" data-testid="text-no-complaints">
              {complaints.length === 0 ? 'No complaints yet' : 'No complaints match your filters'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {complaints.length === 0 
                ? "Submit your first complaint to get started"
                : "Try adjusting your filters"}
            </p>
            {complaints.length === 0 && (
              <Button onClick={() => setLocation('/submit-complaint')} data-testid="button-submit-first">
                <Plus className="w-4 h-4 mr-2" />
                Submit Complaint
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onViewDetails={() => setLocation(`/complaints/${complaint.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
