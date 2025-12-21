# WhatsApp Business Platform

A comprehensive WhatsApp Business management platform featuring AI-powered automation, real-time messaging, and intelligent customer engagement tools.

## Overview

This platform provides businesses with advanced WhatsApp communication capabilities, including automated AI responses, contact management, campaign orchestration, and real-time analytics. Built with modern web technologies and designed for scalability.

## Architecture

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: FastAPI with Python
- **Database**: MongoDB for data persistence
- **Authentication**: Clerk integration with JWT tokens
- **AI Processing**: Intelligent response system with contextual understanding

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Python 3.8 or higher
- MongoDB connection string

### Installation

1. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

3. **WhatsApp Simulator (Optional)**
```bash
cd simulator_app
pip install -r requirements.txt
python3 backend/main.py
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Simulator: http://localhost:9001

## Core Features

### Authentication System
Complete authentication flow with Clerk integration:
- User registration and login
- JWT token management
- Session persistence
- Secure route protection
- Multi-factor authentication support

### Contact Management
Comprehensive contact database with advanced features:
- Real-time contact synchronization with MongoDB
- Advanced search and filtering capabilities
- Tag-based organization and categorization
- Contact interaction history and analytics
- Bulk contact operations
- Import/export functionality
- Contact profile management with detailed information
- Activity timeline tracking

### AI-Powered Messaging System
Intelligent messaging with contextual understanding:
- Smart auto-reply system with keyword recognition
- Contextual response generation based on message content
- Sentiment analysis and customer intent recognition
- Manual override capabilities for human intervention
- Real-time typing indicators
- Message status tracking (sent, delivered, read)
- WhatsApp-style chat interface
- Media file support (images, documents)

### Campaign Management
Multi-contact campaign orchestration:
- Template-based message distribution
- Contact segmentation and targeting
- Scheduled campaign delivery
- Real-time delivery and engagement tracking
- Performance analytics and reporting
- A/B testing capabilities
- Campaign automation workflows

### Template System
Professional message template management:
- Pre-approved WhatsApp Business templates
- Dynamic parameter substitution
- Category-based organization (Marketing, Utility, Transactional, Authentication)
- Template preview with real-time parameter filling
- Usage analytics and optimization
- Template approval workflow
- Multi-language support

### Analytics Dashboard
Comprehensive business intelligence:
- Real-time messaging statistics
- Interactive charts and visualizations using Recharts
- Performance metrics and KPIs
- Campaign effectiveness tracking
- Customer engagement analytics
- Response time monitoring
- Conversion tracking

### AI Agent System
Specialized AI agents for different business functions:

**Customer Support Agent**
- Handles common inquiries and support requests
- Automated ticket creation and routing
- FAQ responses and troubleshooting guidance
- Escalation to human agents when needed

**Sales Assistant**
- Lead qualification and scoring
- Product information and recommendations
- Price quotes and availability checks
- Sales funnel progression tracking

**Lead Qualifier**
- Automatic lead scoring based on interaction patterns
- Contact tagging and categorization
- Lead nurturing workflows
- CRM integration capabilities

**Appointment Scheduler**
- Calendar integration and availability checking
- Automated booking confirmations
- Reminder notifications
- Rescheduling and cancellation handling

Each agent includes:
- Independent configuration and customization
- Performance monitoring and analytics
- Enable/disable functionality
- Custom prompt engineering
- Activity logging and reporting

## Technical Implementation

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state
- **Data Fetching**: Custom hooks with SWR patterns
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Authentication**: Clerk integration
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion for smooth transitions

### Backend Architecture
- **Framework**: FastAPI with Python
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Hybrid Clerk + JWT system
- **API Design**: RESTful endpoints with OpenAPI documentation
- **Real-time**: WebSocket support for live updates
- **File Handling**: Media upload and processing
- **Error Handling**: Comprehensive error management
- **Logging**: Structured logging with performance monitoring

### Database Schema
- **Contacts**: User information, tags, interaction history
- **Messages**: Chat history, media files, status tracking
- **Campaigns**: Campaign data, targeting, performance metrics
- **Templates**: Approved templates, parameters, usage statistics
- **Agents**: AI agent configurations, logs, performance data
- **Users**: Authentication data, preferences, permissions

## Feature Walkthrough

### Dashboard Experience
Upon login, users access a comprehensive dashboard featuring:
- Real-time statistics cards showing contacts, active chats, campaigns, and messages
- Interactive analytics charts displaying message performance over time
- Recent activity feed with live updates
- Quick action buttons for common tasks
- Performance metrics with trend indicators
- Campaign analytics with detailed breakdowns

### Contact Management Workflow
1. **Contact List View**: Searchable, filterable list with pagination
2. **Contact Creation**: Modal form with validation and duplicate detection
3. **Contact Profiles**: Detailed view with interaction history and notes
4. **Bulk Operations**: Mass tagging, messaging, and export capabilities
5. **Import System**: CSV/Excel import with data validation
6. **Contact Details Panel**: Collapsible sidebar with comprehensive information

### Chat Interface Features
- **WhatsApp-style UI**: Familiar messaging interface
- **Real-time Updates**: Live message synchronization
- **Contact Sidebar**: Detailed contact information panel
- **Message Status**: Visual indicators for delivery and read status
- **Media Support**: Image and document sharing capabilities
- **Template Integration**: Quick access to approved templates
- **AI Toggle**: Manual control over automated responses
- **Typing Indicators**: Real-time typing status display

### Campaign Creation Process
1. **Campaign Setup**: Name, description, and objective definition
2. **Audience Selection**: Contact segmentation and targeting
3. **Template Selection**: Choose from approved message templates
4. **Parameter Configuration**: Dynamic content customization
5. **Scheduling**: Immediate or scheduled delivery options
6. **Review and Launch**: Final approval and campaign activation
7. **Monitoring**: Real-time performance tracking and analytics

### Template Management System
- **Template Library**: Organized by category and approval status
- **Parameter System**: Dynamic placeholder replacement
- **Preview Functionality**: Real-time template preview with sample data
- **Usage Analytics**: Track template performance and engagement
- **Approval Workflow**: Template submission and approval process
- **Multi-language Support**: Templates in multiple languages

## AI and Automation Features

### Intelligent Response System
The AI system provides contextual responses based on:
- **Keyword Recognition**: Identifies intent from message content
- **Sentiment Analysis**: Understands customer emotional state
- **Context Awareness**: Maintains conversation context
- **Learning Capabilities**: Improves responses over time
- **Fallback Mechanisms**: Graceful handling of unknown queries

### Automation Workflows
- **Welcome Messages**: Automated greetings for new contacts
- **Lead Nurturing**: Scheduled follow-up sequences
- **Support Routing**: Automatic ticket creation and assignment
- **Appointment Reminders**: Scheduled notification system
- **Feedback Collection**: Automated satisfaction surveys

### WhatsApp Simulator
Comprehensive testing environment featuring:
- **Message Simulation**: Send test messages to the platform
- **Real-time Sync**: Messages appear instantly in the dashboard
- **Contact Creation**: Automatic contact generation for new numbers
- **Webhook Testing**: Validate integration endpoints
- **Bulk Testing**: Send multiple messages for load testing

## Configuration and Setup

### Environment Configuration

**Frontend Environment** (`frontend/.env.local`):
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_SIMULATOR=true
```

**Backend Environment** (`backend/.env`):
```env
# Database Configuration
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=whatsapp-business

# Authentication
CLERK_PEM_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----...
CLERK_ISSUER=https://your-domain.clerk.accounts.dev
JWT_SECRET=your_secure_jwt_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# WhatsApp Business API
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_ACCESS_TOKEN=your_whatsapp_business_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# AI Configuration
GROQ_API_KEY=your_groq_api_key_for_ai_processing

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Simulator Environment** (`simulator_app/.env`):
```env
# Database (same as backend)
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=whatsapp-business

# Integration
MAIN_APP_URL=http://localhost:8000/webhooks/inbound

# Server
HOST=0.0.0.0
PORT=9001
```

## API Documentation

### Core Endpoints

**Authentication**
- `POST /auth/clerk-to-jwt` - Exchange Clerk session for JWT
- `POST /auth/generate-jwt` - Generate JWT for API access
- `GET /auth/verify` - Verify token validity

**Contact Management**
- `GET /contacts` - List contacts with filtering and pagination
- `POST /contacts` - Create new contact
- `GET /contacts/{id}` - Get contact details
- `PUT /contacts/{id}` - Update contact information
- `DELETE /contacts/{id}` - Delete contact

**Messaging**
- `GET /chats/{phone_number}` - Get chat history
- `POST /send` - Send message to contact
- `GET /messages` - List all messages with filters

**Campaign Management**
- `GET /campaigns` - List campaigns
- `POST /campaigns` - Create new campaign
- `GET /campaigns/{id}` - Get campaign details
- `PUT /campaigns/{id}` - Update campaign
- `DELETE /campaigns/{id}` - Delete campaign

**Template System**
- `GET /templates` - List templates with filtering
- `POST /templates` - Create new template
- `GET /templates/{id}` - Get template details
- `PUT /templates/{id}` - Update template
- `DELETE /templates/{id}` - Delete template
- `POST /templates/{id}/use` - Use template with parameters

**AI Agents**
- `GET /api/agents` - List AI agents
- `POST /api/agents` - Create custom agent
- `PUT /api/agents/{id}` - Update agent configuration
- `POST /api/ai/process` - Process message with AI

### Response Formats

All API responses follow a consistent format:
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Testing and Quality Assurance

### Frontend Testing
```bash
cd frontend
npm test                    # Run test suite
npm run test:coverage      # Generate coverage report
npm run test:watch         # Watch mode for development
```

**Test Coverage**:
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Integration testing for user workflows
- Accessibility testing with axe-core
- Visual regression testing

### Backend Testing
```bash
cd backend
python -m pytest          # Run all tests
python -m pytest --cov    # With coverage report
```

**Test Categories**:
- Unit tests for individual functions
- Integration tests for API endpoints
- Database testing with test fixtures
- Authentication flow testing
- AI response validation

### End-to-End Testing
Complete user journey testing:
1. User registration and authentication
2. Contact creation and management
3. Message sending and receiving
4. Campaign creation and execution
5. Template usage and customization
6. AI agent interaction and responses

## Deployment and Production

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
vercel deploy --prod
```

### Backend Deployment (Railway/Heroku)
```bash
cd backend
# Configure production environment variables
# Deploy using platform-specific commands
```

### Docker Deployment
```bash
docker-compose up -d
```

**Docker Configuration**:
- Multi-stage builds for optimization
- Environment-specific configurations
- Health checks and monitoring
- Automatic scaling capabilities

### Production Considerations
- **Security**: HTTPS enforcement, CORS configuration, rate limiting
- **Performance**: CDN integration, database indexing, caching strategies
- **Monitoring**: Error tracking, performance monitoring, uptime checks
- **Backup**: Automated database backups, disaster recovery procedures

## Project Structure

```
whatsapp-business-platform/
├── frontend/                    # Next.js frontend application
│   ├── app/                    # App Router pages and layouts
│   │   ├── (dashboard)/        # Dashboard layout group
│   │   │   └── dashboard/      # Main dashboard page
│   │   ├── contacts/           # Contact management pages
│   │   ├── chat/              # Chat interface
│   │   ├── campaigns/         # Campaign management
│   │   ├── templates/         # Template management
│   │   ├── ai-agents/         # AI agent configuration
│   │   ├── help/              # Help and support
│   │   └── profile/           # User profile management
│   ├── components/            # Reusable React components
│   │   ├── Header.tsx         # Application header
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── DashboardCharts.tsx # Chart components
│   │   └── modals/            # Modal components
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Authentication hook
│   │   ├── useContacts.ts     # Contact management
│   │   └── useChats.ts        # Chat functionality
│   ├── lib/                   # Utility functions and API client
│   ├── store/                 # Zustand state management
│   ├── types/                 # TypeScript type definitions
│   └── styles/                # Global styles and Tailwind config
│
├── backend/                   # FastAPI backend application
│   ├── main.py               # Main application and route definitions
│   ├── database.py           # MongoDB connection and utilities
│   ├── models.py             # Data models and schemas
│   ├── auth/                 # Authentication utilities
│   ├── services/             # Business logic services
│   └── tests/                # Backend test suite
│
├── simulator_app/            # WhatsApp message simulator
│   ├── backend/              # Simulator API
│   ├── frontend/             # Simulator web interface
│   └── requirements.txt      # Python dependencies
│
├── docs/                     # Documentation
├── docker-compose.yml        # Docker configuration
└── README.md                # This documentation
```

## Troubleshooting Guide

### Common Issues and Solutions

**Frontend Issues**:
- **Build Errors**: Clear `.next` folder and `node_modules`, reinstall dependencies
- **Authentication Problems**: Verify Clerk configuration and environment variables
- **Chart Display Issues**: Ensure Recharts is properly installed and imported
- **Dark Mode Problems**: Clear localStorage and reset theme preferences

**Backend Issues**:
- **Database Connection**: Verify MongoDB connection string and network access
- **JWT Errors**: Check JWT secret configuration and token expiration
- **CORS Problems**: Verify CORS origins in environment configuration
- **AI Response Failures**: Validate AI service API keys and rate limits

**Integration Issues**:
- **Message Sync Problems**: Check webhook URLs and authentication
- **Real-time Updates**: Verify WebSocket connections and event handling
- **File Upload Errors**: Check file size limits and storage configuration

### Performance Optimization

**Frontend Optimization**:
- Code splitting and lazy loading
- Image optimization and compression
- Bundle size analysis and reduction
- Caching strategies for API responses

**Backend Optimization**:
- Database query optimization and indexing
- Response caching and compression
- Connection pooling and resource management
- Background job processing for heavy operations

## Security Considerations

### Authentication Security
- JWT token expiration and refresh mechanisms
- Secure token storage and transmission
- Multi-factor authentication support
- Session management and logout procedures

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection mechanisms
- CSRF token implementation

### API Security
- Rate limiting and throttling
- Request size limitations
- HTTPS enforcement
- API key management and rotation

## Contributing Guidelines

### Development Workflow
1. Fork the repository
2. Create a feature branch from `main`
3. Implement changes with appropriate tests
4. Ensure all tests pass and code quality checks succeed
5. Submit a pull request with detailed description
6. Address review feedback and iterate as needed

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Consistent code formatting and best practices
- **Prettier**: Automated code formatting
- **Commit Messages**: Conventional commit format
- **Documentation**: Comprehensive inline and external documentation

### Testing Requirements
- Unit tests for new functionality
- Integration tests for API changes
- End-to-end tests for user-facing features
- Performance testing for critical paths
- Accessibility testing for UI components

## License and Support

This project is licensed under the MIT License. For support, feature requests, or bug reports, please use the GitHub issue tracker or contact the development team.

## Roadmap and Future Enhancements

### Planned Features
- Advanced analytics and reporting dashboard
- Multi-language support for international markets
- Integration with popular CRM systems
- Advanced AI capabilities with machine learning
- Mobile application for iOS and Android
- Enterprise features and white-label solutions

### Technical Improvements
- Microservices architecture for better scalability
- GraphQL API implementation
- Real-time collaboration features
- Advanced caching and performance optimization
- Comprehensive monitoring and alerting system
