# API Configuration Guide

## Mock Mode vs Real Backend

The application is currently configured to use **Mock Mode** to prevent 404 errors when the backend server is not running.

### Current Configuration
- File: `src/services/api.ts`
- Line 4: `const MOCK_MODE = true;`

### How to Switch Modes

#### 🔧 Mock Mode (Current - No Backend Required)
```typescript
const MOCK_MODE = true; // Set to false when backend is available
```

**What it does:**
- Simulates all API responses with fake data
- No backend server required
- Perfect for frontend development and testing
- Returns mock business card data: John Doe, john.doe@example.com, etc.

#### 🚀 Real Backend Mode
```typescript
const MOCK_MODE = false; // Set to false when backend is available
```

**Requirements:**
- Backend server running on `http://localhost:8000`
- All API endpoints must be implemented:
  - `POST /api/persistNprocessCapturedCard` - Upload business card
  - `GET /api/checkCardStatus/{transactionID}` - Check processing status
  - `GET /api/getUserInfo/{transactionID}` - Get user information
  - `POST /api/transactions/{transactionID}/selfie` - Upload selfie
  - `POST /api/intiateMeetingScheduler` - Schedule meeting

### API Endpoints Expected by Frontend

1. **Upload Business Card**
   - `POST /api/persistNprocessCapturedCard`
   - Body: FormData with 'file' field
   - Response: `{ status: 200, message: "User Card Image is stored and being processed", transactionID: "uuid" }`

2. **Check Processing Status**
   - `GET /api/checkCardStatus/{transactionID}`
   - Response: BusinessCardData with processing_status and llm_response

3. **Get User Info**
   - `GET /api/getUserInfo/{transactionID}`
   - Response: UserInfo with email, name, phone, company, etc.

4. **Upload Selfie**
   - `POST /api/transactions/{transactionID}/selfie`
   - Body: FormData with 'selfie' and 'transactionID' fields

5. **Schedule Meeting**
   - `POST /api/intiateMeetingScheduler`
   - Body: `{ transactionID: "uuid", isMeetingRequested: true }`
   - Response: `{ status: 200, message: "Meeting Invitation request is Received", transactionID: "uuid" }`

### Current Mock Data
- **Name:** John Doe
- **Email:** john.doe@example.com  
- **Phone:** +1-555-0123
- **Company:** Example Corp
- **Title:** Senior Developer

You can modify the mock data in the `api.ts` file to test different scenarios.