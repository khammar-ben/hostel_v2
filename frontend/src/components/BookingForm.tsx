import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Loader2, Calendar, Users, CreditCard } from "lucide-react";
import axiosClient from "../api/axios";
import { toast } from "sonner";

interface Room {
  id: number;
  room_number: string;
  name: string;
  type: string;
  capacity: number;
  occupied: number;
  floor: number;
  price: number;
  status: string;
  description?: string;
  amenities?: string[];
  last_cleaned?: string;
  created_at: string;
  updated_at: string;
}

interface BookingFormProps {
  room: Room;
  onSuccess: () => void;
  onCancel: () => void;
}

const BookingForm = ({ room, onSuccess, onCancel }: BookingFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Guest information
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nationality: "",
    date_of_birth: "",
    id_type: "",
    id_number: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    
    // Booking information
    check_in_date: "",
    check_out_date: "",
    number_of_guests: 1,
    special_requests: "",
  });

  const idTypes = [
    "Passport",
    "National ID",
    "Driver's License",
    "Other"
  ];

  const nationalities = [
    "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahrain", "Bangladesh", "Belarus", "Belgium", "Brazil", "Bulgaria", "Cambodia", "Canada",
    "Chile", "China", "Colombia", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Egypt",
    "Estonia", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland",
    "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Lithuania", "Luxembourg", "Malaysia",
    "Mexico", "Morocco", "Netherlands", "New Zealand", "Norway", "Pakistan", "Philippines",
    "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore", "Slovakia",
    "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland",
    "Thailand", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
    "Vietnam", "Other"
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

  const calculateTotal = () => {
    if (!formData.check_in_date || !formData.check_out_date) return 0;
    
    const checkIn = new Date(formData.check_in_date);
    const checkOut = new Date(formData.check_out_date);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return nights * room.price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        room_id: room.id,
        number_of_guests: parseInt(formData.number_of_guests.toString()),
      };

      const response = await axiosClient.post("/api/bookings", submitData);
      
      if (response.data.success) {
        toast.success("Booking request submitted successfully!");
        onSuccess();
      } else {
        throw new Error(response.data.message || "Failed to submit booking");
      }
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        toast.error(errorMessages.join(", "));
      } else {
        toast.error(error.response?.data?.message || "Failed to submit booking. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Book Room - {room.name}</span>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X size={20} />
            </Button>
          </CardTitle>
          <CardDescription>
            Complete the form below to submit your booking request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Room Information */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Room Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Room:</span>
                  <p className="font-medium">{room.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium">{room.type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Price per night:</span>
                  <p className="font-medium">${room.price}</p>
                </div>
              </div>
            </div>

            {/* Booking Dates */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Booking Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="check_in_date">Check-in Date *</Label>
                  <Input
                    id="check_in_date"
                    name="check_in_date"
                    type="date"
                    value={formData.check_in_date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check_out_date">Check-out Date *</Label>
                  <Input
                    id="check_out_date"
                    name="check_out_date"
                    type="date"
                    value={formData.check_out_date}
                    onChange={handleInputChange}
                    min={formData.check_in_date || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number_of_guests">Number of Guests *</Label>
                  <Select 
                    value={formData.number_of_guests.toString()} 
                    onValueChange={(value) => handleSelectChange("number_of_guests", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: room.capacity }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Guest Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select 
                    value={formData.nationality} 
                    onValueChange={(value) => handleSelectChange("nationality", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {nationalities.map((nationality) => (
                        <SelectItem key={nationality} value={nationality}>
                          {nationality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* ID Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Identification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id_type">ID Type</Label>
                  <Select 
                    value={formData.id_type} 
                    onValueChange={(value) => handleSelectChange("id_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      {idTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_number">ID Number</Label>
                  <Input
                    id="id_number"
                    name="id_number"
                    value={formData.id_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="special_requests">Special Requests</Label>
              <Textarea
                id="special_requests"
                name="special_requests"
                value={formData.special_requests}
                onChange={handleInputChange}
                placeholder="Any special requests or notes..."
                rows={3}
              />
            </div>

            {/* Total Cost */}
            {formData.check_in_date && formData.check_out_date && (
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Total Cost
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {Math.ceil((new Date(formData.check_out_date).getTime() - new Date(formData.check_in_date).getTime()) / (1000 * 60 * 60 * 24))} nights × ${room.price}/night
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${calculateTotal().toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total amount</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Booking Request"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;
