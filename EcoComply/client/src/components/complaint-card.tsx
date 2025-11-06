import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComplaintWithUser } from "@shared/schema";
import { MapPin, Calendar, Eye } from "lucide-react";
import { getCategoryIcon, getCategoryColor, getStatusColor } from "@/lib/complaint-utils";
import { formatDistanceToNow } from "date-fns";

interface ComplaintCardProps {
  complaint: ComplaintWithUser;
  onViewDetails?: () => void;
}

export function ComplaintCard({ complaint, onViewDetails }: ComplaintCardProps) {
  const CategoryIcon = getCategoryIcon(complaint.category);
  const categoryColor = getCategoryColor(complaint.category);
  const statusColor = getStatusColor(complaint.status);

  return (
    <Card className="hover-elevate" data-testid={`card-complaint-${complaint.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${categoryColor}`}>
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold capitalize text-sm" data-testid={`text-category-${complaint.id}`}>
                {complaint.category} Pollution
              </h3>
            </div>
            <p className="text-xs text-muted-foreground" data-testid={`text-id-${complaint.id}`}>
              ID: {complaint.id.slice(0, 8)}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className={statusColor} data-testid={`badge-status-${complaint.id}`}>
          {complaint.status.replace('_', ' ')}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm line-clamp-2" data-testid={`text-description-${complaint.id}`}>
          {complaint.description}
        </p>
        
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span data-testid={`text-location-${complaint.id}`}>
              {complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span data-testid={`text-date-${complaint.id}`}>
              {formatDistanceToNow(new Date(complaint.createdAt!), { addSuffix: true })}
            </span>
          </div>
        </div>

        {complaint.user && (
          <p className="text-xs text-muted-foreground" data-testid={`text-reporter-${complaint.id}`}>
            Reported by: {complaint.user.firstName} {complaint.user.lastName}
          </p>
        )}

        {onViewDetails && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={onViewDetails}
            data-testid={`button-view-${complaint.id}`}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
