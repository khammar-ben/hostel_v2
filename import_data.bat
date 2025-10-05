@echo off
echo ========================================
echo    Importing Data to MongoDB
echo ========================================
echo.

echo Step 1: Starting MongoDB service...
net start MongoDB

echo.
echo Step 2: Importing data using MongoDB shell...
mongo hostel_booking import_mongodb_data.js

echo.
echo Step 3: Verifying data import...
mongo hostel_booking --eval "print('Users: ' + db.users.countDocuments()); print('Rooms: ' + db.rooms.countDocuments()); print('Activities: ' + db.activities.countDocuments()); print('Offers: ' + db.offers.countDocuments()); print('Guests: ' + db.guests.countDocuments()); print('Bookings: ' + db.bookings.countDocuments()); print('Activity Bookings: ' + db.activity_bookings.countDocuments());"

echo.
echo ========================================
echo    Data Import Complete!
echo ========================================
echo.
echo Your hostel booking database now contains:
echo - 2 Users (including admin)
echo - 15 Rooms (various types and floors)
echo - 6 Activities (tours, classes, etc.)
echo - 6 Special Offers (discounts and promotions)
echo - 12 Guests (from different countries)
echo - 5 Room Bookings (various statuses)
echo - 3 Activity Bookings
echo.
echo You can now run your Laravel application!
echo.
pause
