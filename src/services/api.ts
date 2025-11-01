import type { UploadCardResponse, ScheduleMeetingResponse } from '../types/cardScanner';

const API_BASE_URL = 'http://localhost:8000';

export class CardScannerAPI {
  /**
   * Ping endpoint to check backend availability
   * Returns true if backend is reachable, false otherwise
   */
  static async pingBackend(): Promise<boolean> {
    try {
      console.log('🏓 Pinging backend:', `${API_BASE_URL}/ping`);
      const response = await fetch(`${API_BASE_URL}/ping`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      const isReachable = response.ok;
      console.log(isReachable ? '✅ Backend is reachable' : '❌ Backend returned error');
      return isReachable;
    } catch (error) {
      console.error('❌ Backend is not reachable:', error);
      return false;
    }
  }

  /**
   * API 1: Process business card image with AI Vision
   * 
   * Flow:
   * 1. Receives business card image
   * 2. Processes image with OpenAI Vision API
   * 3. Extracts structured data (name, email, phone, company, etc.)
   * 4. Detects QR codes if present
   * 5. Saves to database automatically
   * 6. Returns structured data immediately
   */
  static async uploadCard(imageFile: File): Promise<UploadCardResponse> {
    // Validation
    if (!imageFile) {
      throw new Error('No file provided');
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      throw new Error(`Invalid file type. Please upload a JPEG or PNG image.`);
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      throw new Error(`File size exceeds 10MB limit.`);
    }

    const formData = new FormData();
    formData.append('file', imageFile, imageFile.name);
    
    console.log('📤 Uploading card image:', imageFile.name, imageFile.type, `${(imageFile.size / 1024).toFixed(2)}KB`);

    const response = await fetch(`${API_BASE_URL}/ai-business-card`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upload error:', response.status, errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.detail || `Upload failed: ${response.status}`);
      } catch {
        throw new Error(`Upload failed (${response.status}): ${errorText}`);
      }
    }
    
    const result = await response.json();
    console.log('✅ Upload successful:', result);
    
    // Backend returns record_id - map it to transactionID for consistency
    // If record_id is not available, generate a fallback transactionID
    const transactionID = result.record_id || result.transactionID || `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Return in the expected format with full AI response for immediate data access
    return {
      status: 200,
      message: "User Card Image is stored and being processed",
      transactionID: transactionID, // Using transactionID universally (record_id from backend mapped here)
      aiResponse: result, // Include full AI response with structured_data, confidence, etc.
    };
  }

  /**
   * API 2: Fetch updated card data by transactionID (record_id)
   * 
   * Fetches the latest data from database including company enrichment (2nd LLM call)
   * This is used to poll for company data completion
   * 
   * IMPORTANT: Update the endpoint URL below to match your backend API endpoint
   * Common options:
   * - GET /api/getCardData/{record_id}
   * - GET /api/getUserInfo/{record_id}  
   * - GET /api/customer-scanned-data/{record_id}
   * - Or your custom endpoint
   */
  static async getCardData(transactionID: string): Promise<any> {
    console.log('📥 Fetching card data for transaction:', transactionID);

    // TODO: Update this endpoint to match your backend API
    // Replace with your actual endpoint that returns card data by record_id
    const endpoint = `${API_BASE_URL}/api/getCardData/${transactionID}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Fetch card data error:', response.status, errorText);
      console.error('💡 Tip: Make sure your backend has an endpoint to fetch card data by record_id');
      throw new Error(`Failed to fetch card data: ${response.status}. Endpoint: ${endpoint}`);
    }
    
    const result = await response.json();
    console.log('✅ Card data fetched:', result);
    return result;
  }

  /**
   * API 3: Initiate meeting scheduler
   * 
   * Flow:
   * 1. Receives transactionID and isMeetingRequested
   * 2. Updates meeting request status in customer_userInfo_tbl
   * 3. Checks customer data (P1 path) OR business card data (P2 path)
   * 4. Sends data to N8N for meeting scheduling
   * 5. Returns response with transactionID
   */
  static async scheduleMeeting(transactionID: string): Promise<ScheduleMeetingResponse> {
    console.log('📅 Scheduling meeting for transaction:', transactionID);

    const response = await fetch(`${API_BASE_URL}/api/intiateMeetingScheduler`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        transactionID, 
        isMeetingRequested: true 
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Meeting scheduling error:', response.status, errorText);
      throw new Error(`Failed to schedule meeting: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Meeting request sent:', result);
    return result;
  }
}
