# WhatsApp Business Dashboard

A modern, full-featured WhatsApp Business dashboard built with Next.js 16, TypeScript, Tailwind CSS, and integrated with FastAPI backend.

## 🚀 Features

### Core Features
- ✅ **Dashboard**: Real-time analytics, message charts, quick actions, performance metrics
- ✅ **Contacts Management**: Search, filter, sort, tags, import/export, bulk operations
- ✅ **Chat Interface**: WhatsApp-style UI, send messages, templates, media support, status indicators
- ✅ **Campaign Management**: Create campaigns, Google Sheets integration, analytics, delivery tracking
- ✅ **Templates Management**: View templates, preview, parameter filling, categories, search/filter

### Technical Features
- ✅ Next.js 16 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Zustand for state management
- ✅ React Query for data fetching & caching
- ✅ React Hook Form + Zod for form validation
- ✅ Toast notifications for user feedback
- ✅ Responsive design (Mobile + Desktop)
- ✅ Error handling & loading states
- ✅ JWT authentication support

## 📦 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **APIs**: WhatsApp Business API

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd whatsapp-business-ui
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/whatsapp
NEXT_PUBLIC_JWT_TOKEN=your_jwt_token_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
whatsapp-business-ui/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Dashboard
│   ├── contacts/            # Contacts management
│   ├── chat/                # Chat interface
│   ├── campaigns/           # Campaign management
│   ├── templates/           # Templates library
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── Header.tsx           # Page header
│   └── Providers.tsx        # React Query & Toast providers
├── hooks/                   # Custom React hooks
│   ├── useContacts.ts       # Contacts data fetching
│   ├── useChats.ts          # Chat data fetching
│   ├── useCampaigns.ts      # Campaigns data fetching
│   └── useTemplates.ts      # Templates data fetching
├── lib/                     # Utility libraries
│   └── api.ts               # API client
├── store/                   # State management
│   └── useStore.ts          # Zustand store
├── types/                   # TypeScript types
│   └── index.ts             # Type definitions
└── public/                  # Static assets
```

## 🔌 API Integration

### Backend Endpoints

The application integrates with the following FastAPI endpoints:

#### Authentication
- `GET /` - Health check

#### Contacts
- `GET /users?login_user={user_id}` - Get all contacts
- `GET /tags` - Get all contact tags

#### Chats
- `GET /chats/{phone_number}` - Get chat history
- `POST /send` - Send message

#### Campaigns
- `GET /campaigns` - Get all campaigns
- `GET /campaign_contacts?campaign={name}` - Get campaign contacts
- `GET /imported_numbers?sheet_name={name}` - Get contacts from sheet
- `GET /{campaign_name}` - Get campaign status

#### Templates
- `GET /templates` - Get all WhatsApp templates

#### Sheets
- `GET /sheets` - Get all Google Sheets

### API Client Usage

```typescript
import { apiClient } from '@/lib/api';

// Get contacts
const contacts = await apiClient.getContacts('user_id');

// Send message
await apiClient.sendMessage({
  phone: '+1234567890',
  message: 'Hello!',
});

// Get campaigns
const campaigns = await apiClient.getCampaigns();
```

## 🎨 Pages Overview

### 1. Dashboard (`/`)
- Real-time statistics cards
- Message analytics chart
- Quick action buttons
- Performance metrics
- Recent activity feed
- Campaign analytics

### 2. Contacts (`/contacts`)
- Searchable contact list
- Filter by status and tags
- Contact details view
- Import/Export functionality
- Bulk operations
- Pagination

### 3. Chat (`/chat`)
- WhatsApp-style interface
- Chat list with search
- Message history
- Send text messages
- Send templates
- Media support
- Status indicators

### 4. Campaigns (`/campaigns`)
- Campaign cards with stats
- Create new campaigns
- Filter by status
- View analytics
- Track delivery status
- Contact lists per campaign

### 5. Templates (`/templates`)
- Template library
- Filter by category
- Preview templates
- Usage statistics
- Status badges
- Search functionality

## 🔧 Configuration

### Tailwind CSS
Edit `tailwind.config.ts` to customize colors, fonts, and other design tokens.

### API Configuration
Update `.env.local` with your backend URL and JWT token.

### State Management
The Zustand store is located in `store/useStore.ts`. Add new state as needed.

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🚀 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧪 Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Proper folder structure
- Component-based architecture

### Best Practices
- Server and Client Components separation
- Optimized images and assets
- Code splitting
- Error boundaries
- Loading states
- Toast notifications

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_JWT_TOKEN` | JWT authentication token | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is part of a hackathon submission.

## 👨‍💻 Author

Built for WhatsApp Business Dashboard Hackathon

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons
- FastAPI for the backend framework
