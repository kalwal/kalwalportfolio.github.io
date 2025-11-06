import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndustryWithOwner } from "@shared/schema";
import { Building2, MapPin, TrendingUp } from "lucide-react";

export default function AdminIndustries() {
  const { data: industries = [], isLoading } = useQuery<IndustryWithOwner[]>({
    queryKey: ['/api/industries'],
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-page-title">Industries</h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Monitor registered industries and compliance scores
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-40" />
            </Card>
          ))}
        </div>
      ) : industries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2" data-testid="text-no-industries">No industries registered</h3>
            <p className="text-sm text-muted-foreground">
              Industries will appear here once they register
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <Card key={industry.id} className="hover-elevate" data-testid={`card-industry-${industry.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate" data-testid={`text-name-${industry.id}`}>
                        {industry.name}
                      </h3>
                      <p className="text-xs text-muted-foreground capitalize" data-testid={`text-sector-${industry.id}`}>
                        {industry.sector}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={industry.complianceScore && industry.complianceScore >= 80 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}
                    data-testid={`badge-score-${industry.id}`}
                  >
                    {industry.complianceScore || 100}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate" data-testid={`text-location-${industry.id}`}>{industry.location}</span>
                </div>
                {industry.owner && (
                  <p className="text-xs text-muted-foreground" data-testid={`text-owner-${industry.id}`}>
                    Owner: {industry.owner.firstName} {industry.owner.lastName}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
