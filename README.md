# FlowSync - Comprehensive Productivity Tracker

A modern, full-stack productivity tracking application built with Next.js, featuring time tracking, notes management, nutrition tracking, and social collaboration features.

## 🚀 Features

### Core Functionality

- **Time Tracking**: Advanced timer with category-based tracking and detailed analytics
- **Notes Management**: Rich text notes with collaboration, version history, and image uploads
- **Calendar Integration**: Visual time entry management with day/week/month views
- **Analytics & Reports**: Comprehensive productivity insights with charts and statistics
- **Nutrition Tracking**: Meal planning and nutritional intake monitoring

### Social Features

- **Friend System**: Send/receive friend requests and view friend activities
- **Real-time Messaging**: Chat with friends directly in the app
- **Collaborative Notes**: Share and collaborate on notes with team members
- **Activity Sharing**: View friends' productivity patterns (with permission)

### User Experience

- **Dark/Light Mode**: Seamless theme switching
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **PWA Ready**: Progressive Web App capabilities
- **Real-time Updates**: Live data synchronization
- **Rich Text Editor**: Markdown support with live preview

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives
- **Chart.js** - Data visualization
- **React Hook Form** - Form management

### Backend

- **Next.js API Routes** - Serverless backend
- **NextAuth.js** - Authentication system
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Cloudinary** - Image storage and optimization

### State Management

- **Zustand** - Lightweight state management
- **React Query** - Server state management

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account (for image uploads)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/blazedglimmer/ProductivityTracker
cd flowsync
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/flowsync"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
flowsync/
├── app/                    # Next.js App Router
│   ├── (app)/             # Protected app routes
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API endpoints
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── sections/         # Page sections
│   ├── notes/            # Notes-specific components
│   └── auth/             # Authentication components
├── lib/                  # Utility libraries
│   ├── actions/          # Server actions
│   ├── store/            # Zustand store
│   └── validations/      # Zod schemas
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🔧 Configuration

### Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: User accounts and profiles
- **TimeEntry**: Time tracking records
- **Category**: Time entry categories
- **Todo**: Notes and tasks
- **Friendship**: Social connections
- **Message**: Chat messages

### Authentication

NextAuth.js handles authentication with:

- Email/password authentication
- Session management
- Protected routes

### File Uploads

Cloudinary integration for:

- Profile pictures
- Note attachments
- Image optimization

## 🎯 Usage Guide

### Time Tracking

1. **Start Timer**: Click the timer tab and start tracking
2. **Add Categories**: Create custom categories in settings
3. **Manual Entries**: Add time entries via calendar view
4. **View Reports**: Analyze productivity in the reports section

### Notes Management

1. **Create Notes**: Use the rich text editor with markdown support
2. **Collaborate**: Share notes with friends and team members
3. **Organize**: Use colors and pinning for organization
4. **Version History**: Track changes over time

### Social Features

1. **Add Friends**: Search and send friend requests
2. **Chat**: Real-time messaging with friends
3. **Share Activities**: View friend productivity (with permission)

## 🔒 Security Features

- **Authentication**: Secure session-based auth
- **Authorization**: Role-based access control
- **Data Validation**: Server-side input validation
- **CSRF Protection**: Built-in Next.js protection
- **SQL Injection Prevention**: Prisma ORM protection

## 📊 Analytics & Reporting

- **Time Distribution**: Visual breakdown by category
- **Productivity Trends**: Historical analysis
- **Goal Tracking**: Set and monitor objectives
- **Export Data**: Download reports in various formats

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build image
docker build -t flowsync .

# Run container
docker run -p 3000:3000 flowsync
```

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- Database connection string
- NextAuth configuration
- Cloudinary credentials
- Any additional API keys

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📈 Performance Optimization

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Strategic caching for API responses
- **Database Indexing**: Optimized database queries
- **CDN**: Cloudinary for asset delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User logout

### Time Tracking Endpoints

- `GET /api/time-entries` - Get user's time entries
- `POST /api/time-entries` - Create new time entry
- `PATCH /api/time-entries/[id]` - Update time entry
- `DELETE /api/time-entries/[id]` - Delete time entry

### Categories Endpoints

- `GET /api/categories` - Get user's categories
- `POST /api/categories` - Create new category
- `PATCH /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Social Features Endpoints

- `GET /api/friends` - Get user's friends
- `POST /api/friends/requests` - Send friend request
- `GET /api/messages/[friendId]` - Get chat messages
- `POST /api/messages` - Send message

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**

```bash
# Check database connection
npx prisma db pull
```

**Build Errors**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Authentication Issues**

- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://radix-ui.com/) - UI components
- [Cloudinary](https://cloudinary.com/) - Image management

## 📞 Support

For support, email support@flowsync.com or join our [Discord community](https://discord.gg/flowsync).

## 🗺 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Team management features
- [ ] Integration with external calendars
- [ ] AI-powered productivity insights
- [ ] Offline mode support
- [ ] Advanced notification system
- [ ] Custom themes and branding

---

**FlowSync** - Track your time, boost your productivity, collaborate with your team.
