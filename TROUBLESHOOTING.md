# Troubleshooting Guide

## "None of the features are working"

### Most Common Issue: Not Logged In

**Problem**: You see a blank page or get redirected to sign-in
**Solution**:
1. Go to http://localhost:3000
2. You should see Clerk sign-in page
3. Click "Sign Up" (top right)
4. Enter ANY email (e.g., test@test.com)
5. Enter ANY password
6. Click "Continue"
7. You'll be redirected to dashboard

### Issue: Frontend Not Running

**Check if it's running**:
```bash
lsof -i:3000
```

**If nothing shows, start it**:
```bash
cd frontend
npm run dev
```

**If port is in use**:
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Then start again
npm run dev
```

---

## Feature-Specific Issues

### Dark Mode Not Working

**Symptoms**: Toggle doesn't switch theme
**Solutions**:
1. Clear localStorage:
   ```javascript
   // In browser console (F12)
   localStorage.clear()
   ```
2. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. Check if toggle button is visible in header (top-right)

### Modals Not Opening

**Symptoms**: Click "Add Contact" or "New Campaign" but nothing happens
**Solutions**:
1. Check browser console (F12) for errors
2. Make sure you're logged in
3. Try clicking the button again
4. Hard refresh the page

### Charts Not Showing

**Symptoms**: Dashboard shows empty space where charts should be
**Solutions**:
1. Check if Recharts is installed:
   ```bash
   cd frontend
   npm list recharts
   ```
2. If not installed:
   ```bash
   npm install recharts
   ```
3. Restart dev server:
   ```bash
   # Stop with Ctrl+C
   npm run dev
   ```

### Forms Not Validating

**Symptoms**: Can submit empty forms
**Solutions**:
1. Check if Zod is installed:
   ```bash
   npm list zod react-hook-form
   ```
2. If not:
   ```bash
   npm install zod react-hook-form @hookform/resolvers
   ```
3. Restart dev server

---

## Build Issues

### TypeScript Errors

**Solution**:
```bash
cd frontend
npm run build
```
If errors appear, they'll be listed. Most common fixes:
1. Missing imports
2. Type mismatches
3. Undefined variables

### Module Not Found

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Authentication Issues

### Can't Sign Up

**Symptoms**: Sign up form doesn't work
**Solutions**:
1. Check Clerk keys in `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
2. Make sure keys are not empty
3. Restart dev server after changing .env

### Stuck on Sign In Page

**Symptoms**: After login, redirected back to sign-in
**Solutions**:
1. Clear cookies and localStorage
2. Try incognito/private window
3. Check Clerk dashboard for issues

---

## Quick Fixes

### Nuclear Option (Fixes Most Issues)

```bash
cd frontend

# 1. Clean everything
rm -rf node_modules .next package-lock.json

# 2. Reinstall
npm install

# 3. Clear browser data
# In browser: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
# Clear: Cookies, Cache, Local Storage

# 4. Restart
npm run dev

# 5. Open in incognito
# Chrome: Cmd+Shift+N (Mac) or Ctrl+Shift+N (Windows)
```

---

## Verification Checklist

Use this to verify everything works:

### 1. Frontend Running
```bash
curl http://localhost:3000
```
Should return HTML

### 2. Can Access Sign In
- Go to http://localhost:3000
- Should see Clerk sign-in page

### 3. Can Sign Up
- Click "Sign Up"
- Enter test@test.com
- Enter password
- Should redirect to dashboard

### 4. Dashboard Loads
- Should see 4 stat cards
- Should see sidebar on left
- Should see header on top

### 5. Dark Mode Works
- Click moon/sun icon in header
- Theme should switch
- Refresh - theme persists

### 6. Navigation Works
- Click "Contacts" in sidebar
- Should see contacts page
- Click "Chat" - should see chat page
- Click "Campaigns" - should see campaigns
- Click "Templates" - should see templates

### 7. Modals Work
- On Contacts page, click "Add Contact"
- Modal should open
- Fill form and submit
- Toast notification should appear

### 8. Contact Profile Works
- Go to http://localhost:3000/contacts/1
- Should see full profile page

---

## Still Not Working?

### Check These:

1. **Node Version**:
   ```bash
   node --version
   ```
   Should be 18 or higher

2. **NPM Version**:
   ```bash
   npm --version
   ```
   Should be 9 or higher

3. **Browser Console**:
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

4. **Environment Variables**:
   ```bash
   cat frontend/.env.local
   ```
   Should show Clerk keys

---

## Common Error Messages

### "Module not found"
**Fix**: `npm install` in frontend folder

### "Port 3000 already in use"
**Fix**: `lsof -ti:3000 | xargs kill -9`

### "Cannot find module '@/...'"
**Fix**: Check `tsconfig.json` has correct paths

### "Clerk: Missing publishable key"
**Fix**: Check `frontend/.env.local` has Clerk keys

### "Hydration error"
**Fix**: Hard refresh or clear cache

---

## Debug Mode

### Enable Verbose Logging

Add to `frontend/.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

Then check browser console for detailed logs.

---

## Get Help

If nothing works:
1. Check browser console (F12) for errors
2. Check terminal for errors
3. Try the "Nuclear Option" above
4. Make sure you're logged in via Clerk

---

## Working Test Scenario

Here's a guaranteed working flow:

1. **Start Fresh**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open Browser**:
   - Go to http://localhost:3000
   - Should see Clerk sign-in

3. **Sign Up**:
   - Click "Sign Up"
   - Email: test@test.com
   - Password: Test123!
   - Click Continue

4. **You're In!**:
   - Should see dashboard
   - 4 stat cards visible
   - Sidebar on left
   - Header on top

5. **Test Dark Mode**:
   - Click moon icon (top-right)
   - Theme switches
   - Click sun icon
   - Theme switches back

6. **Test Modal**:
   - Click "Contacts" in sidebar
   - Click "Add Contact" button
   - Modal opens
   - Fill form
   - Click "Add Contact"
   - Toast appears

**If this works, ALL features are working!**

---

## Summary

Most issues are caused by:
1. ❌ Not being logged in
2. ❌ Frontend not running
3. ❌ Missing dependencies
4. ❌ Browser cache

**Quick Fix**: Clear everything and start fresh (see "Nuclear Option" above)
