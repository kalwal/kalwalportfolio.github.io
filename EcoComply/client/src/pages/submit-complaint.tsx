import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { insertComplaintSchema, type InsertComplaint } from "@shared/schema";
import { getCategoryIcon, getLocationString } from "@/lib/complaint-utils";
import { MapPin, Loader2, Upload, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

const categories = [
  { value: 'air', label: 'Air Pollution' },
  { value: 'water', label: 'Water Pollution' },
  { value: 'waste', label: 'Waste Management' },
  { value: 'noise', label: 'Noise Pollution' },
  { value: 'industrial', label: 'Industrial Pollution' },
  { value: 'other', label: 'Other' },
];

export default function SubmitComplaint() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<InsertComplaint & { image?: File }>({
    resolver: zodResolver(insertComplaintSchema),
    defaultValues: {
      category: 'air',
      description: '',
      latitude: 0,
      longitude: 0,
      status: 'submitted',
    },
  });

  const detectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const location = await getLocationString();
      form.setValue('latitude', location.latitude);
      form.setValue('longitude', location.longitude);
      toast({
        title: "Location detected",
        description: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      });
    } catch (error) {
      toast({
        title: "Location error",
        description: "Could not detect your location. Please enter manually.",
        variant: "destructive",
      });
    } finally {
      setIsDetectingLocation(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const mutation = useMutation({
    mutationFn: async (data: InsertComplaint & { image?: File }) => {
      const formData = new FormData();
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('latitude', data.latitude.toString());
      formData.append('longitude', data.longitude.toString());
      formData.append('status', data.status);
      if (data.image) {
        formData.append('image', data.image);
      }
      
      const response = await fetch('/api/complaints', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit complaint');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/complaints'] });
      queryClient.invalidateQueries({ queryKey: ['/api/complaints/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Complaint submitted",
        description: "Your complaint has been submitted successfully.",
      });
      setLocation('/complaints');
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertComplaint & { image?: File }) => {
    mutation.mutate({ ...data, image: selectedImage || undefined });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Only show preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For non-images, just show filename
        setImagePreview('');
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-page-title">Submit Complaint</h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Report an environmental concern with detailed information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => {
                          const Icon = getCategoryIcon(cat.value);
                          return (
                            <SelectItem key={cat.value} value={cat.value} data-testid={`option-${cat.value}`}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {cat.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the environmental issue in detail..."
                        className="min-h-32"
                        data-testid="textarea-description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Evidence (Optional)</FormLabel>
                <div className="border-2 border-dashed border-border rounded-md p-4">
                  {selectedImage ? (
                    <div className="relative">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-md" />
                      ) : (
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-md">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{selectedImage.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(selectedImage.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                        data-testid="button-remove-image"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                      <Input
                        type="file"
                        accept="image/*,.pdf,.csv"
                        onChange={handleImageChange}
                        data-testid="input-image"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Upload evidence (Images, PDF, CSV - Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <FormLabel>Location</FormLabel>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <input
                            type="number"
                            step="any"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            data-testid="input-latitude"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <input
                            type="number"
                            step="any"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            data-testid="input-longitude"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={detectLocation}
                  disabled={isDetectingLocation}
                  data-testid="button-detect-location"
                >
                  {isDetectingLocation ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4 mr-2" />
                  )}
                  Detect My Location
                </Button>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/complaints')}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  data-testid="button-submit"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Complaint'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
