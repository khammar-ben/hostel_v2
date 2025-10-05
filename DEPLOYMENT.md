# 🚀 Deployment Guide

This guide will help you deploy your Hostel Room Booking System to GitHub and Netlify.

## 📋 Prerequisites

- GitHub account
- Netlify account
- Git installed on your machine

## 🔧 GitHub Setup

### 1. Initialize Git Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Hostel Room Booking System"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 2. GitHub Repository Settings

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets (if using GitHub Actions):
   - `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
   - `NETLIFY_SITE_ID`: Your Netlify site ID

## 🌐 Netlify Deployment

### Method 1: Direct GitHub Integration (Recommended)

1. **Login to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with your GitHub account

2. **Create New Site**
   - Click "New site from Git"
   - Choose "GitHub" as your Git provider
   - Select your repository

3. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. **Environment Variables** (if needed)
   - Go to **Site settings** → **Environment variables**
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

5. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your frontend

### Method 2: Manual Deploy

1. **Build the frontend locally**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to Netlify dashboard
   - Drag and drop the `frontend/dist` folder
   - Your site will be deployed instantly

## 🔧 Backend Deployment Options

### Option 1: Heroku

1. **Install Heroku CLI**
2. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Configure environment**
   ```bash
   heroku config:set APP_KEY=$(php artisan key:generate --show)
   heroku config:set APP_ENV=production
   heroku config:set APP_DEBUG=false
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: DigitalOcean App Platform

1. **Connect GitHub repository**
2. **Configure build settings**
   - Build command: `composer install --no-dev && php artisan migrate --force`
   - Run command: `php artisan serve --host=0.0.0.0 --port=$PORT`

### Option 3: VPS with Nginx

1. **Set up server** (Ubuntu/CentOS)
2. **Install PHP 8.2+, Composer, Nginx**
3. **Clone repository**
4. **Configure Nginx virtual host**
5. **Set up SSL certificate**

## 🔗 Connecting Frontend to Backend

### Development
- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:8000`
- API calls go to `http://localhost:8000/api`

### Production
- Update `VITE_API_URL` in Netlify environment variables
- Point to your deployed backend URL
- Example: `https://your-backend.herokuapp.com/api`

## 🐛 Troubleshooting

### Common Issues

1. **Build fails on Netlify**
   - Check Node.js version (should be 18+)
   - Verify build command and directory
   - Check environment variables

2. **API calls fail**
   - Verify CORS settings in Laravel
   - Check API URL configuration
   - Ensure backend is accessible

3. **Database issues**
   - Run migrations: `php artisan migrate`
   - Seed database: `php artisan db:seed`
   - Check database configuration

### Debug Commands

```bash
# Check Laravel configuration
php artisan config:cache
php artisan route:cache

# Check frontend build
cd frontend
npm run build
npm run preview

# Test API endpoints
curl https://your-backend-url.com/api/rooms
```

## 📱 Mobile App (Optional)

If you want to create a mobile app later:
- Use React Native with the same API
- Or create a PWA (Progressive Web App)
- Or use Capacitor to wrap your React app

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for production
   - Rotate keys regularly

2. **CORS Configuration**
   - Configure CORS properly for production
   - Only allow your frontend domain

3. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups

## 📊 Monitoring

1. **Netlify Analytics**
   - Built-in analytics
   - Performance monitoring
   - Error tracking

2. **Backend Monitoring**
   - Laravel Telescope (development)
   - Laravel Horizon (queues)
   - Application Performance Monitoring (APM)

## 🎉 Success!

Once deployed, your application will be available at:
- **Frontend**: `https://your-app-name.netlify.app`
- **Backend**: `https://your-backend-url.com`

Remember to:
- Test all functionality
- Monitor performance
- Set up backups
- Keep dependencies updated
