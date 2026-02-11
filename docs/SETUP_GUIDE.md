# Google Apps Script Deployment Guide

## Quick Start Deployment

### Phase 1: Prepare GAS Scripts (30 minutes)

1. **Create Google Apps Script Project**
   - Go to [script.google.com](https://script.google.com)
   - Click "New project"
   - Name it: "HOME PPK GAS System"

2. **Create Google Spreadsheet**
   - Go to [sheets.google.com](https://sheets.google.com)
   - Create new spreadsheet: "HOME PPK Data"
   - Note down the Sheet ID (from URL)

3. **Link Spreadsheet to GAS**
   - In GAS editor menu: `Projects Settings` ⚙️
   - Note the **Script ID**

4. **Add GAS Code Files**
   
   Copy each file in this order (Create → File for each):

   **File 1: Config.gs**
   - Copy content from `backend/src/Config.gs`
   
   **File 2: Utils.gs**
   - Copy content from `backend/src/Utils.gs`
   
   **File 3: Main.gs**
   - Copy content from `backend/src/Main.gs`
   
   **File 4: Users.gs** (inside folder `dao`)
   - Copy content from `backend/src/dao/Users.gs`
   - Create folder called `dao` if needed
   
   Continue for all DAO files and Handlers...

5. **Initialize the System**
   - In GAS Editor, select function dropdown
   - Choose `initializeSystem`
   - Click Run button
   - Grant permissions when prompted
   - Check Execution log for success

### Phase 2: Deploy as Web App (10 minutes)

1. **Deploy**
   - Click "Deploy" button (top right)
   - Select "New deployment"
   - Choose type: **Web app**
   - Under "Execute as": Select your account
   - Under "Who has access": Select "Anyone"
   - Click "Deploy"

2. **Get Deployment URL**
   - Copy the deployment URL shown
   - Format: `https://script.google.com/macros/d/{SCRIPT_ID}/usercontent`
   - Save this URL

3. **Update Frontend API Config**
   - Open: `frontend/src/services/api.ts`
   - Find this line:
     ```typescript
     DEPLOYMENT_URL: 'https://script.google.com/macros/d/{SCRIPT_ID}/usercontent'
     ```
   - Replace `{SCRIPT_ID}` with your actual Script ID

### Phase 3: Frontend Setup (15 minutes)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# For production
npm run build
```

## Testing the Integration

### Test 1: Check Backend Works

In GAS Editor:
1. Select `testBackend` function
2. Click Run
3. Check Execution log for output

### Test 2: Test API Connection

In Frontend (http://localhost:5173):
1. Open browser DevTools (F12)
2. Go to Console tab
3. Install and run this test:

```javascript
// Test login (will fail if no users yet, that's OK)
fetch('YOUR_DEPLOYMENT_URL/auth/login', {
  method: 'POST',
  mode: 'cors',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'test' })
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e))
```

## Common Issues & Solutions

### Issue: "Cannot find property 'getSpreadsheet' of undefined"

**Solution:**
1. In App Script, need to set the spreadsheet
2. Add this line to top of Main.gs:
   ```javascript
   const SPREADSHEET_ID = "YOUR_SHEET_ID_HERE";
   ```
3. Modify getSpreadsheet() function:
   ```javascript
   function getSpreadsheet() {
     return SpreadsheetApp.openById(SPREADSHEET_ID);
   }
   ```

### Issue: CORS Error in Frontend

**Cause:** Deployment not set correctly

**Solution:**
1. Redeploy as new deployment
2. Ensure "Who has access" is "Anyone"
3. Update frontend with new deployment URL
4. Clear browser cache

### Issue: Sheets not created

**Solution:**
1. Run `initializeSystem()` function
2. Check Execution log for errors
3. Manually create sheets if needed with correct headers

### Issue: API returns 404

**Cause:** Endpoint not found in Handlers.gs

**Solutions:**
1. Check endpoint name matches function name
2. Verify all handler files are included
3. Check Execution log for parsing errors

## File Structure for Manual Copy-Paste

If you prefer to copy code manually, maintain this folder structure in GAS:

```
HOME PPK GAS (Project)
├── Main.gs
├── Config.gs
├── Utils.gs
├── dao
│   ├── Users.gs
│   ├── Bills.gs
│   ├── PaymentSlips.gs
│   ├── Requests.gs
│   ├── Expenses.gs
│   ├── UtilityReadings.gs
│   └── Regulations.gs
└── handlers
    └── Handlers.gs
```

## Production Checkl ist

Before using in production:

- [ ] Change all mock data to real data
- [ ] Implement password hashing (bcrypt library)
- [ ] Add rate limiting to prevent abuse
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS for your domain
- [ ] Implement proper audit logging
- [ ] Set up regular backups
- [ ] Test all API endpoints
- [ ] Load test with expected user count
- [ ] Set up error monitoring/logging
- [ ] Document any custom modifications
- [ ] Create user documentation
- [ ] Train staff on system usage
- [ ] Set up support/help desk

## Next Steps

1. ✅ Deploy GAS backend
2. ✅ Update frontend API URL
3. ✅ Install frontend dependencies
4. ✅ Test API connection
5. 🔄 Add initial users
6. 🔄 Configure system settings
7. 🔄 Set up permissions
8. 🔄 Train users
9. 🔄 Go live!

---

**Estimated Total Setup Time:** 1-2 hours
