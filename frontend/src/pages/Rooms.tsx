import Navigation from "@/components/Navigation";
import BookingForm from "@/components/BookingForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Bed, Wifi, Coffee, Lock, Bath, Loader2, Calendar, MapPin, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
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
  is_available_for_booking?: boolean;
  can_accommodate_more: boolean;
  created_at: string;
  updated_at: string;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  // Booking form state
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("1");
  const [preferredRoomType, setPreferredRoomType] = useState("all");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Fetch rooms from API
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await axiosClient.get("/api/rooms/public");
      if (response.data.success) {
        setRooms(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch rooms");
      }
    } catch (error: unknown) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    setSelectedRoom(null);
    toast.success("Booking request submitted successfully!");
  };

  const checkAvailability = async () => {
    if (!checkInDate || !checkOutDate || !numberOfGuests) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsCheckingAvailability(true);
      const response = await axiosClient.get("/api/available-rooms", {
        params: {
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          number_of_guests: numberOfGuests,
        }
      });

      if (response.data.success) {
        const availableRooms = response.data.data;
        if (availableRooms.length === 0) {
          toast.info("No rooms available for the selected dates. Please try different dates.");
        } else {
          toast.success(`Found ${availableRooms.length} available room(s) for your dates!`);
          // Filter rooms to show only available ones
          setRooms(availableRooms);
        }
      } else {
        throw new Error(response.data.message || "Failed to check availability");
      }
    } catch (error: unknown) {
      console.error("Error checking availability:", error);
      toast.error("Failed to check availability. Please try again.");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || room.type === typeFilter;
    const matchesPrice = priceFilter === "all" || 
      (priceFilter === "budget" && room.price <= 25) ||
      (priceFilter === "mid" && room.price > 25 && room.price <= 50) ||
      (priceFilter === "luxury" && room.price > 50);
    
    return matchesSearch && matchesType && matchesPrice;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "occupied": return "bg-blue-100 text-blue-800";
      case "full": return "bg-orange-100 text-orange-800";
      case "maintenance": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available": return "Available";
      case "occupied": return "Occupied";
      case "full": return "Full";
      case "maintenance": return "Maintenance";
      default: return status;
    }
  };

  const canAddGuests = (room: Room, requestedGuests: number) => {
    return room.can_accommodate_more;
  };




  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Rooms & Booking
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our comfortable accommodation options. All rooms include free WiFi, 
            breakfast, and access to our common areas.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-soft sticky top-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Book Your Stay</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="checkin">Check-in Date</Label>
                  <Input 
                    type="date" 
                    id="checkin" 
                    className="mt-1" 
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <Label htmlFor="checkout">Check-out Date</Label>
                  <Input 
                    type="date" 
                    id="checkout" 
                    className="mt-1" 
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Select value={numberOfGuests} onValueChange={setNumberOfGuests}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Guest{num > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="room-type">Preferred Room Type</Label>
                  <Select value={preferredRoomType} onValueChange={setPreferredRoomType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Any room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any room type</SelectItem>
                      <SelectItem value="dorm">Dormitory</SelectItem>
                      <SelectItem value="private">Private Room</SelectItem>
                      <SelectItem value="female">Female Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 mt-6"
                  onClick={checkAvailability}
                  disabled={isCheckingAvailability}
                >
                  {isCheckingAvailability ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check Availability"
                  )}
                </Button>
                
                <div className="mt-2">
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      fetchRooms();
                      setCheckInDate("");
                      setCheckOutDate("");
                      setNumberOfGuests("1");
                      setPreferredRoomType("all");
                    }}
                  >
                    Reset Search
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Included in All Bookings</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Free Breakfast</Badge>
                  <Badge variant="secondary" className="text-xs">Free WiFi</Badge>
                  <Badge variant="secondary" className="text-xs">24/7 Reception</Badge>
                  <Badge variant="secondary" className="text-xs">Common Areas</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Room Types */}
          <div className="lg:col-span-2">
            <div className="grid gap-6">
              {isLoading ? (
                <div className="col-span-2 flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading rooms...</p>
                  </div>
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <p className="text-muted-foreground">No rooms found matching your criteria.</p>
                </div>
              ) : (
                filteredRooms.map((room) => (
                  <Card key={room.id} className="p-6 shadow-soft">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{room.name}</h3>
                        <div className="flex items-center space-x-4 text-muted-foreground mb-2">
                          <div className="flex items-center space-x-1">
                            <Users size={16} />
                            <span className="text-sm">Up to {room.capacity} guests</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Bed size={16} />
                            <span className="text-sm">{room.capacity} beds</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin size={16} />
                            <span className="text-sm">Floor {room.floor}</span>
                          </div>
                        </div>
                        
                        {/* Simple Availability Status */}
                        <div className="mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              room.status === 'available' ? 'bg-green-500' :
                              room.status === 'occupied' && room.can_accommodate_more ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></div>
                            <span className="text-sm text-muted-foreground">
                              {room.status === 'available' ? 'Spaces Available' :
                               room.status === 'occupied' && room.can_accommodate_more ? 'Limited Availability' :
                               'Currently Full'}
                            </span>
                          </div>
                        </div>
                        
                      {/* Room Status */}
                      <div className="mb-3">
                        <Badge className={getStatusColor(room.status)}>
                          {getStatusText(room.status)}
                        </Badge>
                        
                        {/* Simple alert for limited availability */}
                        {room.status === 'occupied' && room.can_accommodate_more && (
                          <div className="flex items-center mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                            <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                            <span className="text-sm text-yellow-700">
                              Limited availability - Book soon!
                            </span>
                          </div>
                        )}
                      </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${room.price}</div>
                        <div className="text-sm text-muted-foreground">per night</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-foreground mb-2">Room Features:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {room.amenities?.map((amenity, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            {amenity.includes("WiFi") && <Wifi size={14} className="text-primary" />}
                            {amenity.includes("Locker") && <Lock size={14} className="text-primary" />}
                            {amenity.includes("Bathroom") && <Bath size={14} className="text-primary" />}
                            {!amenity.includes("WiFi") && !amenity.includes("Locker") && !amenity.includes("Bathroom") && (
                              <Coffee size={14} className="text-primary" />
                            )}
                            <span className="text-sm text-muted-foreground">{amenity}</span>
                          </div>
                        )) || (
                          <div className="text-sm text-muted-foreground">No amenities listed</div>
                        )}
                      </div>
                    </div>

                    {room.description && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">{room.description}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {checkInDate && checkOutDate ? (
                          <>
                            Total for {Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))} nights: 
                            <span className="font-semibold">${(room.price * Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))).toFixed(2)}</span>
                          </>
                        ) : (
                          <>
                            Total for 1 night: <span className="font-semibold">${room.price}</span>
                          </>
                        )}
                      </div>
                      
                      <Button 
                        disabled={!room.can_accommodate_more || room.status === 'full' || room.status === 'maintenance'}
                        onClick={() => handleBookRoom(room)}
                        className="bg-primary hover:bg-primary/90 disabled:opacity-50"
                      >
                        {room.status === 'maintenance' ? "Unavailable" :
                         !room.can_accommodate_more || room.status === 'full' ? "Fully Booked" :
                         "Book Now"}
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && selectedRoom && (
        <BookingForm
          room={selectedRoom}
          onSuccess={handleBookingSuccess}
          onCancel={() => {
            setShowBookingForm(false);
            setSelectedRoom(null);
          }}
        />
      )}
    </div>
  );
};

export default Rooms;