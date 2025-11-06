import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComplaintWithUser } from "@shared/schema";
import { getCategoryIcon, getCategoryColor, getStatusColor } from "@/lib/complaint-utils";
import { MapPin, Calendar, User, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ComplaintDetail() {
  const [, params] = useRoute("/complaints/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState<string>("");
  const [resolutionNotes, setResolutionNotes] = useState<string>("");

  const { data: complaint, isLoading } = useQuery<ComplaintWithUser>({
    queryKey: ['/api/complaints', params?.id],
    enabled: !!params?.id,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ status, notes }: { status: string; notes?: string }) => {
      return await apiRequest('PATCH', `/api/complaints/${params?.id}`, { 
        status, 
        resolutionNotes: notes 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/complaints'] });
      queryClient.invalidateQueries({ queryKey: ['/api/complaints', params?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Complaint updated",
        description: "Status has been updated successfully.",
      });
      setNewStatus("");
      setResolutionNotes("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update complaint.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground mb-4">Complaint not found</p>
        <Button onClick={() => setLocation('/complaints')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Complaints
        </Button>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(complaint.category);
  const categoryColor = getCategoryColor(complaint.category);
  const statusColor = getStatusColor(complaint.status);
  const isAdmin = user?.role === 'admin';

  const handleUpdateStatus = () => {
    if (newStatus) {
      updateMutation.mutate({ 
        status: newStatus, 
        notes: newStatus === 'resolved' ? resolutionNotes : undefined 
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => setLocation('/complaints')}
        className="mb-6"
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Complaints
      </Button>

      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 ${categoryColor}`}>
                  <CategoryIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="capitalize mb-2" data-testid="text-complaint-category">
                    {complaint.category} Pollution
                  </CardTitle>
                  <p className="text-sm text-muted-foreground" data-testid="text-complaint-id">
                    ID: {complaint.id}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className={statusColor} data-testid="badge-complaint-status">
                {complaint.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-sm" data-testid="text-complaint-description">
                {complaint.description}
              </p>
            </div>

            {complaint.imageUrl && (
              <div>
                <h3 className="text-sm font-medium mb-2">Evidence</h3>
                <img 
                  src={complaint.imageUrl} 
                  alt="Complaint evidence" 
                  className="rounded-md max-w-md"
                  data-testid="img-complaint-evidence"
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium" data-testid="text-complaint-location">
                    {complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="text-sm font-medium" data-testid="text-complaint-date">
                    {format(new Date(complaint.createdAt!), 'PPP')}
                  </p>
                </div>
              </div>

              {complaint.user && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Reported by</p>
                    <p className="text-sm font-medium" data-testid="text-complaint-reporter">
                      {complaint.user.firstName} {complaint.user.lastName}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {complaint.resolvedAt && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Resolution</h3>
                <p className="text-sm mb-2" data-testid="text-resolution-notes">
                  {complaint.resolutionNotes || 'No notes provided'}
                </p>
                <p className="text-xs text-muted-foreground" data-testid="text-resolution-date">
                  Resolved on {format(new Date(complaint.resolvedAt), 'PPP')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Actions */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Update Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger data-testid="select-new-status">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newStatus === 'resolved' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Resolution Notes</label>
                  <Textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Enter resolution notes..."
                    data-testid="textarea-resolution-notes"
                  />
                </div>
              )}

              <Button
                onClick={handleUpdateStatus}
                disabled={!newStatus || updateMutation.isPending}
                data-testid="button-update-status"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
