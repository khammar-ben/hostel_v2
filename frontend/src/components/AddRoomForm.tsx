import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from "lucide-react";
import axiosClient from "../api/axios";
import { toast } from "sonner";

interface AddRoomFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddRoomForm = ({ onSuccess, onCancel }: AddRoomFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    room_number: "",
    name: "",
    type: "",
    capacity: "",
    floor: "",
    price: "",
    status: "available",
    description: "",
    amenities: [] as string[],
  });
  const [newAmenity, setNewAmenity] = useState("");

  const predefinedAmenities = [
    "Free WiFi",
    "Air Conditioning",
    "Individual Lockers",
    "Reading Lights",
    "Power Outlets",
    "Shared Bathroom",
    "Private Bathroom",
    "Hair Dryer",
    "TV",
    "Mini Fridge",
    "City View",
    "Garden View",
    "Balcony",
    "Desk",
    "Chair",
    "Wardrobe",
    "Bed Linens",
    "Towels",
    "Daily Cleaning",
    "Laundry Service",
    "Common Area Access",
    "Kitchen Access",
    "24/7 Reception",
    "Luggage Storage",
    "Security Cameras",
    "Key Card Access",
    "Elevator Access",
    "Parking Available",
    "Pet Friendly",
    "Non-Smoking"
  ];

  const roomTypes = [
    "Mixed Dormitory",
    "Female Dormitory", 
    "Male Dormitory",
    "Private Single",
    "Private Double",
    "Private Twin",
    "Family Room",
    "Deluxe Room"
  ];

  const statusOptions = [
    { value: "available", label: "Available" },
    { value: "occupied", label: "Occupied" },
    { value: "full", label: "Full" },
    { value: "maintenance", label: "Maintenance" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity("");
    }
  };

  const addPredefinedAmenity = (amenity: string) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        floor: parseInt(formData.floor),
        price: parseFloat(formData.price),
      };

      const response = await axiosClient.post("/api/rooms", submitData);
      
      if (response.data.success) {
        toast.success("Room added successfully!");
        onSuccess();
      } else {
        throw new Error(response.data.message || "Failed to add room");
      }
    } catch (error: unknown) {
      console.error("Error adding room:", error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
        if (axiosError.response?.data?.errors) {
          const errors = axiosError.response.data.errors;
          const errorMessages = Object.values(errors).flat();
          toast.error(errorMessages.join(", "));
        } else {
          toast.error(axiosError.response?.data?.message || "Failed to add room. Please try again.");
        }
      } else {
        toast.error("Failed to add room. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Add New Room</CardTitle>
          <CardDescription>
            Fill in the details to add a new room to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Number and Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room_number">Room Number *</Label>
                <Input
                  id="room_number"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleInputChange}
                  placeholder="e.g., R001, 101A"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Room Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., 4-Bed Mixed Dorm A"
                  required
                />
              </div>
            </div>

            {/* Type and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Room Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Capacity, Floor, and Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="e.g., 4"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor *</Label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  min="1"
                  value={formData.floor}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Night ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 25.00"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Room description, special features, etc."
                rows={3}
              />
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <Label>Amenities</Label>
              
              {/* Predefined Amenities */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Quick Select:</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                  {predefinedAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => addPredefinedAmenity(amenity)}
                      disabled={formData.amenities.includes(amenity)}
                      className={`text-xs p-1 rounded border text-left transition-colors ${
                        formData.amenities.includes(amenity)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-border'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amenity Input */}
              <div className="flex gap-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Add custom amenity"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                />
                <Button type="button" onClick={addAmenity} variant="outline" size="sm">
                  <Plus size={16} />
                </Button>
              </div>

              {/* Selected Amenities */}
              {formData.amenities.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Selected Amenities:</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Room...
                  </>
                ) : (
                  "Add Room"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRoomForm;
