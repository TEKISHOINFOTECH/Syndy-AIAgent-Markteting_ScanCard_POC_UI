import type { UploadCardResponse, ScheduleMeetingResponse } from '../types/cardScanner';

const API_BASE_URL = 'https://syndy-aiagent-be-poc.onrender.com';

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
   * API 1: Persist and process captured business card image
   * 
   * Flow:
   * 1. Receives business card image
   * 2. Generates UUID (transactionID)
   * 3. Stores image in Supabase Storage (business_cards bucket)
   * 4. Saves record to business_cards_data_tbl
   * 5. Starts async LLM processing
   * 6. Returns immediate response with transactionID
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

    const response = await fetch(`${API_BASE_URL}/api/persistNprocessCapturedCard`, {
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
    return result;
  }

  /**
   * API 2: Initiate meeting scheduler
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
