# HOME PPK GAS - Complete Housing Management System

Home PPK GAS is a comprehensive housing/dormitory management system combining:
- **React + TypeScript Frontend** - Modern, responsive web interface
- **Google Apps Script Backend** - Serverless backend with Google Sheets database
- **Complete Feature Set** - All operations integrated with GAS API

## Project Structure

```
HOME PPK GAS/
├── frontend/                # React + Vite frontend application
│   ├── src/
│   │   ├── app/            # Main application components
│   │   ├── services/       # API client for GAS integration
│   │   ├── styles/         # CSS and theme files
│   │   └── main.tsx        # Entry point
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Vite build configuration
│   └── index.html          # HTML template
│
├── backend/                # Google Apps Script backend
│   └── src/
│       ├── Main.gs         # Entry point (doPost, doGet handlers)
│       ├── Config.gs       # Configuration and sheet setup
│       ├── Utils.gs        # Utility functions
│       ├── dao/            # Data Access Objects
│       │   ├── Users.gs
│       │   ├── Bills.gs
│       │   ├── PaymentSlips.gs
│       │   ├── Requests.gs
│       │   ├── Expenses.gs
│       │   ├── UtilityReadings.gs
│       │   └── Regulations.gs
│       └── handlers/       # API endpoint handlers
│           └── Handlers.gs
│
└── docs/                   # Documentation
    └── SETUP_GUIDE.md      # Deployment and setup instructions
```

## Features

### For Residents
- **Payment Management** - View bills, upload payment slips, track payment history
- **Utility Recording** - View and submit water/electricity readings
- **Request System** - Submit requests (stay, move, repair, return)
- **Profile Management** - Update personal information and co-residents
- **Regulations** - View building rules and guidelines
- **Forms** - Access and submit official forms

### For Staff
- **Utility Management** - Record water and electricity readings for units
- **Bill Generation** - Generate monthly bills automatically
- **Payment Verification** - Verify and approve payment slips
- **Request Management** - Process and manage resident requests
- **Expense Tracking** - Record and track expenses
- **Queue Management** - Manage resident waiting lists

### For Admins
- **System Settings** - Configure rates, fees, and system parameters
- **User Management** - Create and manage user accounts
- **Unit Management** - Manage units and occupancy status
- **Permission Control** - Set role-based access permissions
- **Reports & Statistics** - View comprehensive reports and analytics
- **Audit Logging** - Track all system actions

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **Recharts** - Data visualization
- **Radix UI** - Accessible component library
- **Motion** - Animation library

### Backend
- **Google Apps Script** - Serverless backend
- **Google Sheets** - Database
- **Apps Script API** - For web deployment

### Database
Multiple Google Sheets as tables:
- **Users** - User accounts and profiles
- **Bills** - Monthly billing records
- **PaymentSlips** - Payment verification
- **Requests** - Resident requests and queue
- **OtherExpenses** - Expense tracking
- **UtilityReadings** - Water and electricity readings
- **Regulations** - System rules and guidelines
- **Units** - Unit/room information
- **Settings** - System configuration
- **AuditLog** - Activity logging

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Google Account with Google Apps Script access
- Code editor (VS Code recommended)

### Step 1: Deploy Google Apps Script Backend

1. **Create a new Apps Script project:**
   - Go to [script.google.com](https://script.google.com)
   - Create a new project (name it "HOME PPK GAS")

2. **Copy GAS code:**
   - Copy all files from `backend/src/` in order:
     1. `Config.gs`
     2. `Utils.gs`
     3. `Main.gs`
     4. `dao/Users.gs`
     5. `dao/Bills.gs`
     6. `dao/PaymentSlips.gs`
     7. `dao/Requests.gs`
     8. `dao/Expenses.gs`
     9. `dao/UtilityReadings.gs`
     10. `dao/Regulations.gs`
     11. `handlers/Handlers.gs`
   
   - Paste each file's content into the Apps Script editor as separate files

3. **Create spreadsheet:**
   - In Apps Script, click "Settings" ⚙️
   - Under "Google Cloud Platform (GCP) Project"
   - Copy the Project ID

4. **Create Google Sheet:**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet (name it "HOME PPK Data")
   - Copy the Spreadsheet ID

5. **Link spreadsheet to Apps Script:**
   - In Apps Script editor, go to "Project Settings"
   - Set the GCP project if needed

6. **Initialize the system:**
   - In Apps Script, select the `initializeSystem` function
   - Click Run (▶️) to create all necessary sheets

7. **Deploy as web app:**
   - Click "Deploy" → "New deployment"
   - Select type: "Web app"
   - Execute as: Your account
   - Who has access: "Anyone"
   - Click "Deploy"
   - Copy the deployment URL (e.g., `https://script.google.com/macros/d/{SCRIPT_ID}/usercontent`)

### Step 2: Set Up Frontend

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API endpoint:**
   - Open `frontend/src/services/api.ts`
   - Replace `{SCRIPT_ID}` in the `GAS_CONFIG.DEPLOYMENT_URL` with your Script ID
   - Example: `https://script.google.com/macros/d/1abc123xyz/usercontent`

3. **Start development server:**
   ```bash
   npm run dev
   ```
   - Application will open at `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm build
   ```
   - Static files will be in `dist/` directory

### Step 3: Initialize Sample Data

1. **In Apps Script Editor:**
   - Select the `testBackend` function
   - Click Run to create test user

2. **In Frontend:**
   - Login with test account (if created)
   - Or manually add users through Admin panel

## API Integration

All frontend API calls go through `frontend/src/services/api.ts`, which handles:
- API endpoint construction
- Request/response transformation
- Error handling
- Timeout management

### Example API Calls

```typescript
// User APIs
import { authenticateUser, getUserProfile, getAllUsers } from '@/services/api';

// Authentication
const loginResponse = await authenticateUser('user@example.com', 'password');

// Get user profile
const user = await getUserProfile(1);

// Get all users
const users = await getAllUsers();
```

### API Endpoints

**Authentication**
- `POST /auth/login` - User login

**Users**
- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

**Bills**
- `GET /bills` - Get all bills
- `GET /bills/{id}` - Get bill by ID
- `POST /bills` - Create bill
- `PUT /bills/{id}` - Update bill
- `DELETE /bills/{id}` - Delete bill
- `PUT /bills/generate` - Generate monthly bills

**Payment Slips**
- `GET /payment-slips` - Get all slips
- `POST /payment-slips` - Create slip
- `PUT /payment-slips/{id}/verify` - Verify slip
- `PUT /payment-slips/{id}/reject` - Reject slip

**Requests**
- `GET /requests` - Get all requests
- `POST /requests` - Create request
- `PUT /requests/{id}/approve` - Approve request
- `PUT /requests/{id}/reject` - Reject request

**Expenses**
- `GET /expenses` - Get all expenses
- `POST /expenses` - Create expense
- `PUT /expenses/{id}/approve` - Approve expense

**Utility Readings**
- `POST /utility-readings/water` - Record water reading
- `POST /utility-readings/electric` - Record electric reading

**Statistics**
- `GET /statistics` - Get overall statistics
- `GET /statistics/dashboard` - Get dashboard data
- `GET /statistics/financial` - Get financial report

## Customization

### System Settings

System settings are stored in Google Sheets and can be configured via Admin panel:

- `water_unit_price` - Price per water unit (default: 20)
- `electric_unit_price` - Price per electric unit (default: 7.5)
- `common_fee` - Monthly common area fee (default: 500)
- `payment_due_days` - Days until bill is due (default: 15)

### Roles and Permissions

**Built-in Roles:**
1. **Admin** - Full system access
2. **Water Staff** - Water reading and management
3. **Electric Staff** - Electricity reading and management
4. **Accountant** - Financial and billing operations
5. **Resident** - View own data, submit requests and payments
6. **Outsider** - View regulations and guidelines only

### Database Schema

Each sheet has defined columns:

**Users Sheet:**
- ID, Title, Name, Surname, Email, Phone, LineID, Role, Unit, Type, Status, Password, WaterPrev, ElecPrev, Address fields, CoResidents (JSON), CreatedAt, UpdatedAt

**Bills Sheet:**
- ID, ResidentID, Month, Year, WaterCost, WaterUnit, ElectricCost, ElectricUnit, CommonFee, Total, Status, DueDate, CreatedAt, UpdatedAt

[Similar for other sheets...]

## Troubleshooting

### Frontend doesn't connect to backend
1. Check GAS deployment URL in `api.ts`
2. Verify script is deployed as "Web app"
3. Check browser console for CORS errors
4. Ensure GAS script contains all handler functions

### Data not appearing
1. Run `initializeSystem()` function in GAS editor
2. Check sheets are created with correct names
3. Verify data is being added to correct sheet rows

### Authentication issues
1. Check password is stored correctly (should be hashed in production)
2. Verify email matches exactly
3. Check user role is set correctly

## Deployment

### Frontend Deployment Options

**Option 1: Google Cloud Storage**
```bash
# Build frontend
npm run build

# Deploy to Google Cloud Storage bucket
gsutil -m cp -r dist/* gs://your-bucket-name/
```

**Option 2: Firebase Hosting**
```bash
firebase init hosting
firebase deploy
```

**Option 3: Traditional Web Server**
- Copy `dist/` folder to any web server (Apache, Nginx, etc.)
- Ensure CORS is enabled for GAS API calls

## Security Considerations

⚠️ **IMPORTANT**: This is a template system. For production use:

1. **Passwords** - Implement proper hashing (bcrypt, scrypt)
2. **Authentication** - Use OAuth 2.0 or JWT tokens
3. **Authorization** - Implement proper permission checking in GAS
4. **Data Validation** - Add server-side validation for all inputs
5. **HTTPS** - Ensure all communication is encrypted
6. **CORS** - Configure CORS properly for your domain
7. **Rate Limiting** - Implement rate limiting to prevent abuse
8. **Audit Logging** - Log all sensitive operations
9. **Data Backup** - Regularly backup Google Sheets

## Support

For issues or questions:
1. Check documentation in this file
2. Review API response codes and error messages
3. Check browser console for errors
4. Review Apps Script logs: `View > Execution log`

## License

This project is provided as-is for educational and development purposes.

---

**Last Updated:** February 2026
**Version:** 1.0.0
