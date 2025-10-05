import { useEffect, useState, useCallback } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axiosClient from "../../api/axios";
import { Users, Bed, DollarSign, Calendar, TrendingUp, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "../../hooks/useAuth";

interface RecentBooking {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  status: string;
}

interface Alert {
  type: string;
  message: string;
  priority: string;
}

interface DashboardStats {
  totalBookings: number;
  currentGuests: number;
  availableBeds: number;
  monthlyRevenue: number;
  recentBookings: RecentBooking[];
  alerts: Alert[];
}

const AdminDashboard = () => {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    currentGuests: 0,
    availableBeds: 0,
    monthlyRevenue: 0,
    recentBookings: [],
    alerts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastBookingId, setLastBookingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  
  // Check authentication
  useAuth();

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch bookings data
      const bookingsResponse = await axiosClient.get('/api/bookings');
      const roomsResponse = await axiosClient.get('/api/rooms');
      
      if (bookingsResponse.data.success && roomsResponse.data.success) {
        const bookings = bookingsResponse.data.data;
        const rooms = roomsResponse.data.data;
        
        // Calculate stats
        const totalBookings = bookings.length;
        const currentGuests = bookings.filter(booking => 
          booking.status === 'checked_in' || booking.status === 'confirmed'
        ).length;
        
        const totalCapacity = rooms.reduce((sum: number, room: { capacity: number }) => sum + room.capacity, 0);
        const totalOccupied = rooms.reduce((sum: number, room: { occupied: number }) => sum + room.occupied, 0);
        const availableBeds = totalCapacity - totalOccupied;
        
        // Calculate monthly revenue based on check-in dates (when revenue is actually earned)
        const currentMonth = new Date();
        const currentYear = currentMonth.getFullYear();
        const currentMonthNum = currentMonth.getMonth();
        
        const monthlyRevenue = bookings
          .filter((booking: { check_in_date: string; status: string; total_amount: number }) => {
            // Only count confirmed, checked_in, or checked_out bookings
            const validStatuses = ['confirmed', 'checked_in', 'checked_out'];
            if (!validStatuses.includes(booking.status) || !booking.total_amount || booking.total_amount <= 0) {
              return false;
            }
            
            // Check if check-in date is in current month
            const checkInDate = new Date(booking.check_in_date);
            return checkInDate.getMonth() === currentMonthNum && 
                   checkInDate.getFullYear() === currentYear;
          })
          .reduce((sum: number, booking: { total_amount: number }) => {
            // Ensure total_amount is a number and add it properly
            const amount = typeof booking.total_amount === 'number' ? booking.total_amount : parseFloat(booking.total_amount) || 0;
            return sum + amount;
          }, 0);
        
        
        // Get recent bookings (last 5)
        const recentBookings = bookings
          .sort((a: { created_at: string }, b: { created_at: string }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map((booking: { booking_reference: string; guest: { first_name: string; last_name: string }; room: { name: string }; check_in_date: string; status: string }) => ({
            id: booking.booking_reference,
            guest: `${booking.guest.first_name} ${booking.guest.last_name}`,
            room: booking.room.name,
            checkIn: booking.check_in_date,
            status: booking.status
          }));
        
        // Generate alerts
        const alerts = [];
        
        // Check for maintenance rooms
        const maintenanceRooms = rooms.filter((room: { status: string }) => room.status === 'maintenance');
        if (maintenanceRooms.length > 0) {
          alerts.push({
            type: "warning",
            message: `${maintenanceRooms.length} room(s) need maintenance`,
            priority: "medium"
          });
        }
        
        // Check for overdue checkouts
        const today = new Date().toISOString().split('T')[0];
        const overdueCheckouts = bookings.filter((booking: { check_out_date: string; status: string }) => 
          booking.check_out_date < today && booking.status !== 'checked_out'
        );
        if (overdueCheckouts.length > 0) {
          alerts.push({
            type: "error",
            message: `${overdueCheckouts.length} guest(s) overdue for checkout`,
            priority: "high"
          });
        }
        
        // Check for low occupancy
        const occupancyRate = (totalOccupied / totalCapacity) * 100;
        if (occupancyRate < 30) {
          alerts.push({
            type: "info",
            message: "Low occupancy rate - consider promotional offers",
            priority: "low"
          });
        }
        
        setStats({
          totalBookings,
          currentGuests,
          availableBeds,
          monthlyRevenue,
          recentBookings,
          alerts
        });

        // Set the latest booking ID for polling
        if (bookings.length > 0) {
          setLastBookingId(bookings[0].id);
        }
        
        
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (error: unknown) {
      console.error('Error fetching dashboard data:', error);
      addNotification({
        type: 'error',
        title: 'Dashboard Error',
        message: 'Failed to load dashboard data. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user data
    axiosClient.get('/api/user')
      .then(response => {
        if (response.data.success) {
          setUser(response.data.user);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

    // Fetch dashboard data
    fetchDashboardData();
    
  }, [navigate, fetchDashboardData, addNotification]);

  // Poll for new bookings every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axiosClient.get('/api/bookings');
        if (response.data.success) {
          const bookings = response.data.data;
          const latestBooking = bookings[0]; // Assuming bookings are sorted by created_at desc
          
          if (latestBooking && lastBookingId && latestBooking.id > lastBookingId) {
            // New booking detected
            addNotification({
              type: 'success',
              title: 'New Booking Request',
              message: `New booking from ${latestBooking.guest.first_name} ${latestBooking.guest.last_name} for ${latestBooking.room.name}`
            });
            
            // Update the last booking ID
            setLastBookingId(latestBooking.id);
            
            // Refresh dashboard data
            fetchDashboardData();
          }
        }
      } catch (error) {
        console.error('Error checking for new bookings:', error);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [lastBookingId, addNotification, fetchDashboardData]);

  const statsCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings.toString(),
      change: "+12%",
      trend: "up",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Current Guests",
      value: stats.currentGuests.toString(),
      change: "+5%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Available Beds",
      value: stats.availableBeds.toString(),
      change: "-8%",
      trend: "down",
      icon: Bed,
      color: "text-orange-600",
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+18%",
      trend: "up",
      icon: DollarSign,
      color: "text-primary",
    },
  ];

  return (
    <div className="flex bg-background min-h-screen">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening at Happy Hostel today.</p>
          </div>
          <Button
            variant="outline"
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </Button>
        </div>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                  </div>
                  <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
                </div>
              </Card>
            ))
          ) : (
            statsCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="p-6 shadow-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`${stat.color} opacity-80`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Bookings */}
          <Card className="p-6 shadow-soft">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Bookings</h2>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-muted rounded animate-pulse mb-1 w-3/4"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentBookings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recent bookings</p>
                ) : (
                  stats.recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{booking.guest}</p>
                        <p className="text-sm text-muted-foreground">{booking.room}</p>
                        <p className="text-xs text-muted-foreground">Check-in: {booking.checkIn}</p>
                      </div>
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                        className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>

          {/* Alerts */}
          <Card className="p-6 shadow-soft">
            <h2 className="text-xl font-bold text-foreground mb-4">Alerts & Notifications</h2>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="h-4 w-4 bg-muted rounded animate-pulse mt-0.5"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                      <div className="h-5 w-20 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {stats.alerts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No alerts at this time</p>
                ) : (
                  stats.alerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                      <AlertCircle 
                        size={16} 
                        className={`mt-0.5 ${
                          alert.type === 'error' ? 'text-red-500' : 
                          alert.type === 'warning' ? 'text-yellow-500' : 
                          'text-blue-500'
                        }`} 
                      />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{alert.message}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 ${
                            alert.priority === 'high' ? 'border-red-300 text-red-700' :
                            alert.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                            'border-blue-300 text-blue-700'
                          }`}
                        >
                          {alert.priority} priority
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 shadow-soft">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="ghost" 
              className="p-4 h-auto flex-col space-y-2 bg-primary/10 hover:bg-primary/20"
              onClick={() => navigate('/admin/bookings')}
            >
              <Calendar className="w-6 h-6 text-primary" />
              <p className="text-sm font-medium text-foreground">New Booking</p>
            </Button>
            <Button 
              variant="ghost" 
              className="p-4 h-auto flex-col space-y-2 bg-primary/10 hover:bg-primary/20"
              onClick={() => navigate('/admin/guests')}
            >
              <Users className="w-6 h-6 text-primary" />
              <p className="text-sm font-medium text-foreground">Check-in Guest</p>
            </Button>
            <Button 
              variant="ghost" 
              className="p-4 h-auto flex-col space-y-2 bg-primary/10 hover:bg-primary/20"
              onClick={() => navigate('/admin/rooms')}
            >
              <Bed className="w-6 h-6 text-primary" />
              <p className="text-sm font-medium text-foreground">Room Status</p>
            </Button>
            <Button 
              variant="ghost" 
              className="p-4 h-auto flex-col space-y-2 bg-primary/10 hover:bg-primary/20"
              onClick={() => navigate('/admin/payments')}
            >
              <TrendingUp className="w-6 h-6 text-primary" />
              <p className="text-sm font-medium text-foreground">View Reports</p>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;

