// MongoDB data import script for hostel_booking database
// Run this with: mongo hostel_booking import_mongodb_data.js

print("Starting MongoDB data import for hostel_booking database...");

// Switch to hostel_booking database
db = db.getSiblingDB('hostel_booking');

// Clear existing collections
print("Clearing existing collections...");
db.users.drop();
db.rooms.drop();
db.activities.drop();
db.offers.drop();
db.guests.drop();
db.bookings.drop();
db.activity_bookings.drop();

// Insert Users
print("Inserting users...");
db.users.insertMany([
    {
        name: "Admin User",
        email: "admin@hostel.com",
        password: "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // admin123
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        name: "John Smith",
        email: "john@example.com",
        password: "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    }
]);

// Insert Rooms
print("Inserting rooms...");
db.rooms.insertMany([
    {
        room_number: "R001",
        name: "4-Bed Mixed Dorm A",
        type: "Mixed Dormitory",
        capacity: 4,
        occupied: 3,
        floor: 1,
        price: 25.00,
        status: "available",
        description: "Comfortable mixed dormitory with individual lockers and reading lights.",
        amenities: ["Free WiFi", "AC", "Individual Lockers", "Reading Lights", "Power Outlets"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R002",
        name: "6-Bed Female Dorm B",
        type: "Female Dormitory",
        capacity: 6,
        occupied: 6,
        floor: 1,
        price: 23.00,
        status: "full",
        description: "Female-only dormitory with shared bathroom facilities.",
        amenities: ["Free WiFi", "AC", "Individual Lockers", "Hair Dryer", "Shared Bathroom"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R003",
        name: "8-Bed Male Dorm C",
        type: "Male Dormitory",
        capacity: 8,
        occupied: 5,
        floor: 1,
        price: 22.00,
        status: "available",
        description: "Male-only dormitory with shared facilities and common area.",
        amenities: ["Free WiFi", "AC", "Individual Lockers", "Shared Bathroom", "Common Area"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R004",
        name: "Private Single 101",
        type: "Private Single",
        capacity: 1,
        occupied: 1,
        floor: 1,
        price: 45.00,
        status: "occupied",
        description: "Private single room with shared bathroom facilities.",
        amenities: ["Private Space", "Shared Bathroom", "Free WiFi", "Quiet Area", "Reading Desk"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R201",
        name: "Private Double 201",
        type: "Private Double",
        capacity: 2,
        occupied: 0,
        floor: 2,
        price: 65.00,
        status: "available",
        description: "Private double room with private bathroom and city view.",
        amenities: ["Private Bathroom", "Free WiFi", "TV", "City View", "Mini Fridge"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R202",
        name: "6-Bed Mixed Dorm D",
        type: "Mixed Dormitory",
        capacity: 6,
        occupied: 4,
        floor: 2,
        price: 24.00,
        status: "available",
        description: "Mixed dormitory with modern amenities and city view.",
        amenities: ["Free WiFi", "AC", "Individual Lockers", "City View", "Reading Lights"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R203",
        name: "Private Twin 203",
        type: "Private Twin",
        capacity: 2,
        occupied: 2,
        floor: 2,
        price: 55.00,
        status: "occupied",
        description: "Private twin room with two single beds and shared bathroom.",
        amenities: ["Two Single Beds", "Shared Bathroom", "Free WiFi", "Reading Desk", "Storage"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R204",
        name: "10-Bed Mixed Dorm E",
        type: "Mixed Dormitory",
        capacity: 10,
        occupied: 7,
        floor: 2,
        price: 19.00,
        status: "available",
        description: "Large mixed dormitory perfect for groups.",
        amenities: ["Free WiFi", "AC", "Individual Lockers", "Large Windows", "Group Area"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R301",
        name: "Private Triple 301",
        type: "Private Triple",
        capacity: 3,
        occupied: 0,
        floor: 3,
        price: 75.00,
        status: "maintenance",
        description: "Private triple room with private bathroom and balcony.",
        amenities: ["Private Bathroom", "Balcony", "Free WiFi", "TV", "Mini Fridge", "City View"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R302",
        name: "12-Bed Mixed Dorm F",
        type: "Mixed Dormitory",
        capacity: 12,
        occupied: 8,
        floor: 3,
        price: 18.00,
        status: "available",
        description: "Economy option with basic amenities and large windows.",
        amenities: ["Free WiFi", "Individual Lockers", "Large Windows", "Reading Lights"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R303",
        name: "Private Family 303",
        type: "Private Family",
        capacity: 4,
        occupied: 4,
        floor: 3,
        price: 85.00,
        status: "occupied",
        description: "Family room with private bathroom and kitchenette.",
        amenities: ["Private Bathroom", "Kitchenette", "Free WiFi", "TV", "Family Area", "Balcony"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R304",
        name: "8-Bed Female Dorm G",
        type: "Female Dormitory",
        capacity: 8,
        occupied: 6,
        floor: 3,
        price: 21.00,
        status: "available",
        description: "Female-only dormitory with modern facilities.",
        amenities: ["Free WiFi", "AC", "Individual Lockers", "Hair Dryer", "Shared Bathroom", "City View"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R401",
        name: "Deluxe Private 401",
        type: "Deluxe Private",
        capacity: 2,
        occupied: 0,
        floor: 4,
        price: 95.00,
        status: "available",
        description: "Deluxe private room with premium amenities and panoramic view.",
        amenities: ["Private Bathroom", "Balcony", "Free WiFi", "Smart TV", "Mini Bar", "Panoramic View", "Air Conditioning"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R402",
        name: "Private Quad 402",
        type: "Private Quad",
        capacity: 4,
        occupied: 0,
        floor: 4,
        price: 80.00,
        status: "available",
        description: "Private quad room perfect for groups of friends.",
        amenities: ["Private Bathroom", "Free WiFi", "TV", "Group Area", "Storage", "City View"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        room_number: "R403",
        name: "6-Bed Mixed Dorm H",
        type: "Mixed Dormitory",
        capacity: 6,
        occupied: 3,
        floor: 4,
        price: 26.00,
        status: "available",
        description: "Premium mixed dormitory with rooftop access.",
        amenities: ["Free WiFi", "AC", "Individual Lockers", "Rooftop Access", "City View", "Reading Lights"],
        last_cleaned: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    }
]);

// Insert Activities
print("Inserting activities...");
db.activities.insertMany([
    {
        name: "City Walking Tour",
        description: "Explore the historic city center with our knowledgeable local guide. Discover hidden gems, learn about local history, and experience the authentic culture of our beautiful city.",
        short_description: "Guided walking tour through the historic city center",
        price: 25.00,
        duration_minutes: 120,
        max_participants: 15,
        min_participants: 3,
        difficulty_level: "easy",
        location: "City Center",
        meeting_point: "Hostel Reception",
        available_days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
        start_time: "10:00",
        end_time: "12:00",
        image_url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
        is_active: true,
        advance_booking_hours: 24,
        what_to_bring: "Comfortable walking shoes, water bottle, camera",
        rating: 4.8,
        total_reviews: 127,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        name: "Mountain Hiking Adventure",
        description: "Challenge yourself with a guided hike through scenic mountain trails. Enjoy breathtaking views, fresh mountain air, and the satisfaction of reaching the summit.",
        short_description: "Guided mountain hike with stunning views",
        price: 45.00,
        duration_minutes: 300,
        max_participants: 8,
        min_participants: 2,
        difficulty_level: "hard",
        location: "Mountain Trail",
        meeting_point: "Hostel Reception (Transport Provided)",
        available_days: ["saturday", "sunday"],
        start_time: "08:00",
        end_time: "13:00",
        image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
        is_active: true,
        advance_booking_hours: 48,
        what_to_bring: "Hiking boots, backpack, water (2L), snacks, weather-appropriate clothing",
        rating: 4.9,
        total_reviews: 89,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        name: "Cooking Class Experience",
        description: "Learn to cook traditional local dishes with our expert chef. Hands-on cooking experience followed by enjoying the delicious meal you prepared.",
        short_description: "Learn traditional cooking with local chef",
        price: 35.00,
        duration_minutes: 180,
        max_participants: 12,
        min_participants: 4,
        difficulty_level: "easy",
        location: "Hostel Kitchen",
        meeting_point: "Hostel Kitchen",
        available_days: ["tuesday", "thursday", "saturday"],
        start_time: "18:00",
        end_time: "21:00",
        image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
        is_active: true,
        advance_booking_hours: 24,
        what_to_bring: "Apron (provided), appetite for learning",
        rating: 4.7,
        total_reviews: 156,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        name: "Bike City Tour",
        description: "Explore the city on two wheels! Cycle through parks, along rivers, and discover the best spots that are perfect for biking. Suitable for all fitness levels.",
        short_description: "Guided bicycle tour around the city",
        price: 30.00,
        duration_minutes: 150,
        max_participants: 10,
        min_participants: 3,
        difficulty_level: "moderate",
        location: "City Parks & Riverside",
        meeting_point: "Hostel Courtyard",
        available_days: ["monday", "wednesday", "friday", "sunday"],
        start_time: "14:00",
        end_time: "16:30",
        image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        is_active: true,
        advance_booking_hours: 12,
        what_to_bring: "Comfortable clothes, helmet (provided), water bottle",
        rating: 4.6,
        total_reviews: 203,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        name: "Photography Workshop",
        description: "Improve your photography skills while exploring photogenic locations around the city. Learn composition, lighting, and editing techniques from a professional photographer.",
        short_description: "Learn photography while exploring the city",
        price: 40.00,
        duration_minutes: 240,
        max_participants: 6,
        min_participants: 2,
        difficulty_level: "moderate",
        location: "Various City Locations",
        meeting_point: "Hostel Lobby",
        available_days: ["saturday", "sunday"],
        start_time: "09:00",
        end_time: "13:00",
        image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
        is_active: true,
        advance_booking_hours: 24,
        what_to_bring: "Camera (DSLR or smartphone), comfortable walking shoes",
        rating: 4.9,
        total_reviews: 74,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        name: "Pub Crawl Night",
        description: "Experience the local nightlife with fellow travelers! Visit the best pubs and bars in the city, enjoy drink specials, and make new friends.",
        short_description: "Guided tour of local pubs and bars",
        price: 20.00,
        duration_minutes: 240,
        max_participants: 20,
        min_participants: 5,
        difficulty_level: "easy",
        location: "City Center Pubs",
        meeting_point: "Hostel Reception",
        available_days: ["friday", "saturday"],
        start_time: "20:00",
        end_time: "00:00",
        image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
        is_active: true,
        advance_booking_hours: 6,
        what_to_bring: "Valid ID, comfortable shoes, good mood",
        rating: 4.5,
        total_reviews: 312,
        created_at: new Date(),
        updated_at: new Date()
    }
]);

// Insert Offers
print("Inserting offers...");
db.offers.insertMany([
    {
        offer_code: "WINTER2024",
        name: "Winter Group Special",
        description: "20% off for groups of 8+ people during winter months",
        type: "group-discount",
        discount_type: "percentage",
        discount_value: 20.00,
        min_guests: 8,
        min_nights: null,
        max_uses: 100,
        used_count: 15,
        valid_from: new Date("2024-01-01"),
        valid_to: new Date("2024-03-31"),
        status: "active",
        is_public: true,
        conditions: {winter_months: true, group_booking: true},
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        offer_code: "SOLO2024",
        name: "Solo Traveler Midweek",
        description: "15% off for solo travelers checking in Mon-Thu",
        type: "solo-discount",
        discount_type: "percentage",
        discount_value: 15.00,
        min_guests: 1,
        min_nights: null,
        max_uses: 200,
        used_count: 42,
        valid_from: new Date("2024-01-01"),
        valid_to: new Date("2024-12-31"),
        status: "active",
        is_public: true,
        conditions: {midweek_only: true, solo_traveler: true},
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        offer_code: "EXTENDED2024",
        name: "Extended Stay Deal",
        description: "Stay 7+ nights and get the 8th night free",
        type: "length-discount",
        discount_type: "free_night",
        discount_value: 1.00,
        min_guests: 1,
        min_nights: 7,
        max_uses: 50,
        used_count: 8,
        valid_from: new Date("2024-01-15"),
        valid_to: new Date("2024-06-30"),
        status: "active",
        is_public: true,
        conditions: {extended_stay: true, min_nights: 7},
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        offer_code: "STUDENT2024",
        name: "Student Summer Special",
        description: "25% off for students with valid ID during summer",
        type: "student-discount",
        discount_type: "percentage",
        discount_value: 25.00,
        min_guests: 1,
        min_nights: null,
        max_uses: 150,
        used_count: 0,
        valid_from: new Date("2024-06-01"),
        valid_to: new Date("2024-08-31"),
        status: "scheduled",
        is_public: true,
        conditions: {student_id_required: true, summer_season: true},
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        offer_code: "EARLY2024",
        name: "Early Bird 2024",
        description: "Book 30 days in advance and save 10%",
        type: "early-booking",
        discount_type: "percentage",
        discount_value: 10.00,
        min_guests: 1,
        min_nights: null,
        max_uses: 75,
        used_count: 23,
        valid_from: new Date("2024-01-01"),
        valid_to: new Date("2024-01-15"),
        status: "expired",
        is_public: true,
        conditions: {advance_booking: true, min_days_ahead: 30},
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        offer_code: "LOYALTY2024",
        name: "Loyalty Member Bonus",
        description: "Extra 5% off for returning guests",
        type: "loyalty",
        discount_type: "percentage",
        discount_value: 5.00,
        min_guests: 1,
        min_nights: null,
        max_uses: null,
        used_count: 67,
        valid_from: new Date("2024-01-01"),
        valid_to: new Date("2024-12-31"),
        status: "active",
        is_public: true,
        conditions: {returning_guest: true, loyalty_member: true},
        created_at: new Date(),
        updated_at: new Date()
    }
]);

// Insert Guests
print("Inserting guests...");
db.guests.insertMany([
    {
        first_name: "John",
        last_name: "Smith",
        email: "john.smith@email.com",
        phone: "+44 7700 900123",
        nationality: "British",
        date_of_birth: new Date("1990-05-15"),
        id_type: "passport",
        id_number: "GB123456789",
        address: "123 Main Street, London, UK",
        emergency_contact_name: "Jane Smith",
        emergency_contact_phone: "+44 7700 900124",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        first_name: "Maria",
        last_name: "Garcia",
        email: "maria.garcia@email.com",
        phone: "+34 600 123 456",
        nationality: "Spanish",
        date_of_birth: new Date("1988-08-22"),
        id_type: "passport",
        id_number: "ES987654321",
        address: "Calle Mayor 45, Madrid, Spain",
        emergency_contact_name: "Carlos Garcia",
        emergency_contact_phone: "+34 600 123 457",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        first_name: "Hans",
        last_name: "Mueller",
        email: "hans.mueller@email.com",
        phone: "+49 30 12345678",
        nationality: "German",
        date_of_birth: new Date("1985-12-03"),
        id_type: "passport",
        id_number: "DE456789123",
        address: "Hauptstraße 10, Berlin, Germany",
        emergency_contact_name: "Anna Mueller",
        emergency_contact_phone: "+49 30 12345679",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        first_name: "Sophie",
        last_name: "Dubois",
        email: "sophie.dubois@email.com",
        phone: "+33 1 42 34 56 78",
        nationality: "French",
        date_of_birth: new Date("1992-03-18"),
        id_type: "passport",
        id_number: "FR789123456",
        address: "15 Rue de la Paix, Paris, France",
        emergency_contact_name: "Pierre Dubois",
        emergency_contact_phone: "+33 1 42 34 56 79",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        first_name: "Yuki",
        last_name: "Tanaka",
        email: "yuki.tanaka@email.com",
        phone: "+81 3 1234 5678",
        nationality: "Japanese",
        date_of_birth: new Date("1991-07-25"),
        id_type: "passport",
        id_number: "JP321654987",
        address: "1-2-3 Shibuya, Tokyo, Japan",
        emergency_contact_name: "Hiroshi Tanaka",
        emergency_contact_phone: "+81 3 1234 5679",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        first_name: "Emma",
        last_name: "Johnson",
        email: "emma.johnson@email.com",
        phone: "+1 555 123 4567",
        nationality: "American",
        date_of_birth: new Date("1989-11-12"),
        id_type: "passport",
        id_number: "US654321789",
        address: "456 Broadway, New York, USA",
        emergency_contact_name: "Michael Johnson",
        emergency_contact_phone: "+1 555 123 4568",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        first_name: "Alessandro",
        last_name: "Rossi",
        email: "alessandro.rossi@email.com",
        phone: "+39 06 1234 5678",
        nationality: "Italian",
        date_of_birth: new Date("1987-04-10"),
        id_type: "passport",
        id_number: "IT987654321",
        address: "Via Roma 123, Rome, Italy",
        emergency_contact_name: "Giulia Rossi",
        emergency_contact_phone: "+39 06 1234 5679",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        first_name: "Sarah",
        last_name: "Wilson",
        email: "sarah.wilson@email.com",
        phone: "+61 2 1234 5678",
        nationality: "Australian",
        date_of_birth: new Date("1993-09-05"),
        id_type: "passport",
        id_number: "AU123456789",
        address: "123 George Street, Sydney, Australia",
        emergency_contact_name: "David Wilson",
        emergency_contact_phone: "+61 2 1234 5679",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        first_name: "Lars",
        last_name: "Andersen",
        email: "lars.andersen@email.com",
        phone: "+45 12 34 56 78",
        nationality: "Danish",
        date_of_birth: new Date("1986-01-20"),
        id_type: "passport",
        id_number: "DK456789123",
        address: "Strøget 45, Copenhagen, Denmark",
        emergency_contact_name: "Ingrid Andersen",
        emergency_contact_phone: "+45 12 34 56 79",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        first_name: "Isabella",
        last_name: "Silva",
        email: "isabella.silva@email.com",
        phone: "+55 11 1234 5678",
        nationality: "Brazilian",
        date_of_birth: new Date("1994-06-30"),
        id_type: "passport",
        id_number: "BR789123456",
        address: "Rua Augusta 456, São Paulo, Brazil",
        emergency_contact_name: "Carlos Silva",
        emergency_contact_phone: "+55 11 1234 5679",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        first_name: "Ahmed",
        last_name: "Hassan",
        email: "ahmed.hassan@email.com",
        phone: "+20 2 1234 5678",
        nationality: "Egyptian",
        date_of_birth: new Date("1984-11-15"),
        id_type: "passport",
        id_number: "EG321654987",
        address: "Tahrir Square 789, Cairo, Egypt",
        emergency_contact_name: "Fatima Hassan",
        emergency_contact_phone: "+20 2 1234 5679",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        first_name: "Priya",
        last_name: "Patel",
        email: "priya.patel@email.com",
        phone: "+91 11 1234 5678",
        nationality: "Indian",
        date_of_birth: new Date("1995-02-28"),
        id_type: "passport",
        id_number: "IN654321789",
        address: "Connaught Place 101, New Delhi, India",
        emergency_contact_name: "Raj Patel",
        emergency_contact_phone: "+91 11 1234 5679",
        created_at: new Date(),
        updated_at: new Date()
    }
]);

// Get IDs for relationships
var roomIds = db.rooms.find({}, {_id: 1}).toArray();
var guestIds = db.guests.find({}, {_id: 1}).toArray();
var activityIds = db.activities.find({}, {_id: 1}).toArray();

// Insert Bookings
print("Inserting bookings...");
db.bookings.insertMany([
    {
        booking_reference: "BK-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        guest_id: guestIds[0]._id,
        room_id: roomIds[0]._id,
        check_in_date: new Date(Date.now() + 24*60*60*1000), // tomorrow
        check_out_date: new Date(Date.now() + 4*24*60*60*1000), // 4 days from now
        number_of_guests: 1,
        total_amount: 100.00,
        status: "confirmed",
        special_requests: "Late check-in requested",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        booking_reference: "BK-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        guest_id: guestIds[1]._id,
        room_id: roomIds[1]._id,
        check_in_date: new Date(Date.now() + 2*24*60*60*1000), // 2 days from now
        check_out_date: new Date(Date.now() + 7*24*60*60*1000), // 7 days from now
        number_of_guests: 2,
        total_amount: 138.00,
        status: "pending",
        special_requests: "Ground floor room preferred",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        booking_reference: "BK-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        guest_id: guestIds[2]._id,
        room_id: roomIds[2]._id,
        check_in_date: new Date(Date.now() + 5*24*60*60*1000), // 5 days from now
        check_out_date: new Date(Date.now() + 10*24*60*60*1000), // 10 days from now
        number_of_guests: 1,
        total_amount: 110.00,
        status: "confirmed",
        special_requests: null,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        booking_reference: "BK-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        guest_id: guestIds[3]._id,
        room_id: roomIds[3]._id,
        check_in_date: new Date(Date.now() - 24*60*60*1000), // yesterday
        check_out_date: new Date(Date.now() + 2*24*60*60*1000), // 2 days from now
        number_of_guests: 1,
        total_amount: 135.00,
        status: "checked_in",
        special_requests: "Extra towels needed",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        booking_reference: "BK-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        guest_id: guestIds[4]._id,
        room_id: roomIds[4]._id,
        check_in_date: new Date(Date.now() + 3*24*60*60*1000), // 3 days from now
        check_out_date: new Date(Date.now() + 8*24*60*60*1000), // 8 days from now
        number_of_guests: 2,
        total_amount: 325.00,
        status: "pending",
        special_requests: "Vegetarian breakfast option",
        created_at: new Date(),
        updated_at: new Date()
    }
]);

// Insert Activity Bookings
print("Inserting activity bookings...");
db.activity_bookings.insertMany([
    {
        activity_id: activityIds[0]._id,
        guest_id: guestIds[0]._id,
        booking_reference: "ACT-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        booking_date: new Date(Date.now() + 24*60*60*1000), // tomorrow
        booking_time: new Date("1970-01-01T10:00:00Z"),
        participants: 1,
        total_amount: 25.00,
        per_person_price: 25.00,
        status: "confirmed",
        special_requests: "First time visitor",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        activity_id: activityIds[1]._id,
        guest_id: guestIds[1]._id,
        booking_reference: "ACT-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        booking_date: new Date(Date.now() + 3*24*60*60*1000), // 3 days from now
        booking_time: new Date("1970-01-01T08:00:00Z"),
        participants: 2,
        total_amount: 90.00,
        per_person_price: 45.00,
        status: "pending",
        special_requests: "Group booking",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        activity_id: activityIds[2]._id,
        guest_id: guestIds[2]._id,
        booking_reference: "ACT-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        booking_date: new Date(Date.now() + 4*24*60*60*1000), // 4 days from now
        booking_time: new Date("1970-01-01T18:00:00Z"),
        participants: 1,
        total_amount: 35.00,
        per_person_price: 35.00,
        status: "confirmed",
        special_requests: null,
        created_at: new Date(),
        updated_at: new Date()
    }
]);

// Create indexes for better performance
print("Creating indexes...");
db.users.createIndex({email: 1}, {unique: true});
db.rooms.createIndex({room_number: 1}, {unique: true});
db.rooms.createIndex({status: 1});
db.rooms.createIndex({type: 1});
db.activities.createIndex({name: 1});
db.activities.createIndex({is_active: 1});
db.offers.createIndex({offer_code: 1}, {unique: true});
db.offers.createIndex({status: 1});
db.guests.createIndex({email: 1}, {unique: true});
db.guests.createIndex({phone: 1});
db.bookings.createIndex({booking_reference: 1}, {unique: true});
db.bookings.createIndex({guest_id: 1});
db.bookings.createIndex({room_id: 1});
db.bookings.createIndex({status: 1});
db.activity_bookings.createIndex({booking_reference: 1}, {unique: true});
db.activity_bookings.createIndex({activity_id: 1});
db.activity_bookings.createIndex({guest_id: 1});
db.activity_bookings.createIndex({status: 1});

// Display summary
print("\n==========================================");
print("    Database Import Complete!");
print("==========================================");
print("Collections created:");
print("- users: " + db.users.countDocuments());
print("- rooms: " + db.rooms.countDocuments());
print("- activities: " + db.activities.countDocuments());
print("- offers: " + db.offers.countDocuments());
print("- guests: " + db.guests.countDocuments());
print("- bookings: " + db.bookings.countDocuments());
print("- activity_bookings: " + db.activity_bookings.countDocuments());
print("\nIndexes created for optimal performance.");
print("Your hostel booking database is ready to use!");
print("==========================================");
