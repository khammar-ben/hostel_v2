import AdminSidebar from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Plus, Eye, Edit, Trash2, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import axiosClient from "../../api/axios";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

interface Guest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  nationality?: string;
  date_of_birth?: string;
  id_type?: string;
  id_number?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

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

interface Booking {
  id: number;
  booking_reference: string;
  guest_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_amount: number;
  status: string;
  special_requests?: string;
  confirmed_at?: string;
  checked_in_at?: string;
  checked_out_at?: string;
  created_at: string;
  updated_at: string;
  guest: Guest;
  room: Room;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Check authentication
  useAuth();

  // Fetch bookings from API
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await axiosClient.get("/api/bookings");
      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch bookings");
      }
    } catch (error: unknown) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await axiosClient.put(`/api/bookings/${bookingId}`, {
        status: newStatus
      });
      
      if (response.data.success) {
        toast.success("Booking status updated successfully!");
        fetchBookings(); // Refresh the list
      } else {
        throw new Error(response.data.message || "Failed to update booking");
      }
    } catch (error: unknown) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking. Please try again.");
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await axiosClient.delete(`/api/bookings/${bookingId}`);
      if (response.data.success) {
        toast.success("Booking deleted successfully!");
        fetchBookings(); // Refresh the list
      } else {
        throw new Error(response.data.message || "Failed to delete booking");
      }
    } catch (error: unknown) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking. Please try again.");
    }
  };

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guest.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guest.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "checked_in": return "bg-blue-100 text-blue-800";
      case "checked_out": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmed";
      case "pending": return "Pending";
      case "cancelled": return "Cancelled";
      case "checked_in": return "Checked In";
      case "checked_out": return "Checked Out";
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle size={16} />;
      case "pending": return <Clock size={16} />;
      case "cancelled": return <XCircle size={16} />;
      case "checked_in": return <CheckCircle size={16} />;
      case "checked_out": return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="flex bg-background min-h-screen">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Bookings Management</h1>
            <p className="text-muted-foreground">Manage guest reservations and booking details.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus size={16} className="mr-2" />
            New Booking
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <Input 
                placeholder="Search bookings..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="checked_out">Checked Out</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">All Rooms</SelectItem>
                <SelectItem value="dorm">Dormitory</SelectItem>
                <SelectItem value="private">Private Room</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter size={16} className="mr-2" />
              More Filters
            </Button>
          </div>
        </Card>

        {/* Bookings Table */}
        <Card className="shadow-soft">
          <div className="p-4 md:p-6">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Booking ID</TableHead>
                  <TableHead className="font-semibold">Guest</TableHead>
                  <TableHead className="font-semibold">Room</TableHead>
                  <TableHead className="font-semibold">Check-in</TableHead>
                  <TableHead className="font-semibold">Check-out</TableHead>
                  <TableHead className="font-semibold text-center">Guests</TableHead>
                  <TableHead className="font-semibold text-right">Total</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                  <TableHead className="font-semibold text-center">Payment</TableHead>
                  <TableHead className="font-semibold text-center w-48">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-muted-foreground">Loading bookings...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <p className="text-muted-foreground">No bookings found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium py-4">{booking.booking_reference}</TableCell>
                      <TableCell className="py-4">
                        <div>
                          <p className="font-medium">{booking.guest.first_name} {booking.guest.last_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.guest.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div>
                          <p className="font-medium">{booking.room.name}</p>
                          <p className="text-sm text-muted-foreground">{booking.room.room_number}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">{new Date(booking.check_in_date).toLocaleDateString()}</TableCell>
                      <TableCell className="py-4">{new Date(booking.check_out_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full font-medium">
                          {booking.number_of_guests}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium py-4">${booking.total_amount}</TableCell>
                      <TableCell className="text-center py-4">
                        <Badge className={`${getStatusColor(booking.status)} px-3 py-1 min-w-[100px] justify-center`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(booking.status)}
                            {getStatusText(booking.status)}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <div className="text-sm">
                          <p className="text-muted-foreground">Auto-calculated</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Select 
                            value={booking.status} 
                            onValueChange={(value) => handleUpdateBookingStatus(booking.id, value)}
                          >
                            <SelectTrigger className="w-32 h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirm</SelectItem>
                              <SelectItem value="checked_in">Check In</SelectItem>
                              <SelectItem value="checked_out">Check Out</SelectItem>
                              <SelectItem value="cancelled">Cancel</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="Delete Booking"
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="p-4 shadow-soft">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
          </Card>
          <Card className="p-4 shadow-soft">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter(booking => booking.status === 'confirmed').length}
            </p>
          </Card>
          <Card className="p-4 shadow-soft">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {bookings.filter(booking => booking.status === 'pending').length}
            </p>
          </Card>
          <Card className="p-4 shadow-soft">
            <p className="text-sm text-muted-foreground">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">
              {bookings.filter(booking => booking.status === 'cancelled').length}
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminBookings;