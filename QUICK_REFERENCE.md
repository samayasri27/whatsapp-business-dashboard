# Quick Reference Card 🚀

## System Status
✅ **Backend**: Running on http://localhost:8000 (DEBUG mode with `default_user`)
✅ **Frontend**: Running on http://localhost:3000  
✅ **MongoDB**: Connected to Atlas cluster
✅ **Data**: 15 contacts, 22 messages, 8 campaigns, 12 templates
✅ **User ID**: All data uses `default_user` (fixed mismatch)

## Access Points

### Frontend Pages
- **Dashboard**: http://localhost:3000
- **Contacts**: http://localhost:3000/contacts
- **Campaigns**: http://localhost:3000/campaigns
- **Templates**: http://localhost:3000/templates
- **Chat**: Click any contact to open chat

### Backend API
- **Health**: http://localhost:8000/
- **API Docs**: http://localhost:8000/docs
- **Contacts**: http://localhost:8000/users?login_user=default_user
- **Campaigns**: http://localhost:8000/campaigns
- **Templates**: http://localhost:8000/templates

## Quick Commands

### Start Backend
```bash
cd backend
source venv/bin/activate
python main.py
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Re-seed Database
```bash
cd backend
source venv/bin/activate
python seed_data.py
```

### Test API
```bash
# Get contacts (15 contacts)
curl "http://localhost:8000/users?login_user=default_user"

# Get campaigns (8 campaigns)
curl "http://localhost:8000/campaigns"

# Get templates (12 templates)
curl "http://localhost:8000/templates"

# Note: DEBUG mode allows requests without Authorization header
```

## Data Summary

### Contacts: 15
- VIP: 4 contacts
- Leads: 5 contacts  
- Customers: 6 contacts

### Messages: 22
- 4 conversation threads
- Real chat history

### Campaigns: 8
- Active: 4
- Completed: 2
- Scheduled: 1
- Draft: 1

### Templates: 12
- Utility: 2
- Transactional: 4
- Marketing: 4
- Authentication: 2

## Key Files

- `backend/.env` - Backend configuration
- `frontend/.env.local` - Frontend configuration
- `backend/seed_data.py` - Database seeding
- `backend/main.py` - API endpoints
- `backend/database.py` - MongoDB connection

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Failed
- Check `backend/.env` has correct MONGODB_URL
- Verify internet connection
- Check MongoDB Atlas dashboard

### Frontend Not Loading Data
- Verify backend is running on port 8000
- Check `frontend/.env.local` has NEXT_PUBLIC_API_URL=http://localhost:8000
- Check browser console for errors

## Environment Variables

### Backend (.env)
```
MONGODB_URL=mongodb+srv://...
MONGODB_DB_NAME=whatsapp-business
DEBUG=True
PORT=8000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Success Indicators

✅ Backend logs show "✅ Connected to MongoDB"
✅ Frontend loads without errors
✅ Contacts page shows 15 contacts
✅ Campaigns page shows 8 campaigns
✅ Templates page shows 12 templates
✅ Chat history loads for contacts
✅ Dashboard shows statistics

## Next Actions

1. Open http://localhost:3000
2. Browse through all pages
3. Test creating/editing data
4. Verify data persists in MongoDB
5. Check conversation history

---

**Everything is ready to use!** 🎉
