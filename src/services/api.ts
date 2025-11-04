import type { UploadCardResponse, ScheduleMeetingResponse, EmailDraftResponse } from '../types/cardScanner';

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
   * API 3: Upload selfie image
   * 
   * Flow:
   * 1. Receives selfie image file and record_id (transactionID)
   * 2. Uploads image to Supabase storage
   * 3. Updates record with selfie URL
   * 4. Returns selfie URL and confirmation
   */
  static async uploadSelfie(recordId: string, selfieFile: File): Promise<{
    status: number;
    message: string;
    record_id: string;
    selfie_url: string;
  }> {
    // Validation
    if (!selfieFile) {
      throw new Error('No selfie file provided');
    }

    if (!recordId) {
      throw new Error('No record ID provided');
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selfieFile.type)) {
      throw new Error(`Invalid file type. Please upload a JPEG or PNG image.`);
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selfieFile.size > maxSize) {
      throw new Error(`File size exceeds 10MB limit.`);
    }

    const formData = new FormData();
    formData.append('file', selfieFile, selfieFile.name);
    
    console.log('📤 Uploading selfie:', selfieFile.name, selfieFile.type, `${(selfieFile.size / 1024).toFixed(2)}KB`);
    console.log('📋 Record ID:', recordId);

    const response = await fetch(`${API_BASE_URL}/api/uploadSelfie?record_id=${recordId}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Selfie upload error:', response.status, errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.detail || errorJson.message || `Selfie upload failed: ${response.status}`);
      } catch {
        throw new Error(`Selfie upload failed (${response.status}): ${errorText}`);
      }
    }
    
    const result = await response.json();
    console.log('✅ Selfie upload successful:', result);
    
    return result;
  }

  /**
   * API 4: Generate email draft using LLM
   * 
   * Flow:
   * 1. Receives record_id (transactionID)
   * 2. Optionally accepts notes and audio_transcript in request body
   * 3. Fetches all available context from database:
   *    - summarised_llm_response (from business card analysis)
   *    - summarised_llm_company_response (from company research)
   *    - notes (optional)
   *    - audio_transcript (optional)
   * 4. Generates personalized email draft using OpenAI
   * 5. Saves email draft to database
   * 6. Returns generated email draft with subject and body
   */
  static async generateEmailDraft(
    recordId: string,
    options?: {
      notes?: string;
      audio_transcript?: string;
    }
  ): Promise<EmailDraftResponse> {
    console.log('📧 Generating email draft for record:', recordId);

    const requestBody: any = {};
    if (options?.notes) {
      requestBody.notes = options.notes;
    }
    if (options?.audio_transcript) {
      requestBody.audio_transcript = options.audio_transcript;
    }

    const response = await fetch(`${API_BASE_URL}/api/generateEmailDraft/${recordId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody), // Always send JSON body (even if empty object)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Email draft generation error:', response.status, errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.detail || `Email draft generation failed: ${response.status}`);
      } catch {
        throw new Error(`Email draft generation failed (${response.status}): ${errorText}`);
      }
    }
    
    const result = await response.json();
    console.log('✅ Email draft generated:', result);
    return result;
  }

  /**
   * API 5: Initiate meeting scheduler
   * 
   * Flow:
   * 1. Receives transactionID and isMeetingRequested
   * 2. Receives includeSelfie flag (NEW)
   * 3. Updates meeting request status in customer_userInfo_tbl
   * 4. Checks customer data (P1 path) OR business card data (P2 path)
   * 5. If includeSelfie is true, backend fetches selfie_url from database
   * 6. Sends data to N8N for meeting scheduling (with selfie URL if includeSelfie is true)
   * 7. Returns response with transactionID
   */
  static async scheduleMeeting(
    transactionID: string, 
    includeSelfie: boolean = false
  ): Promise<ScheduleMeetingResponse> {
    console.log('📅 Scheduling meeting for transaction:', transactionID);
    console.log('📸 Include selfie in email:', includeSelfie);

    const response = await fetch(`${API_BASE_URL}/api/intiateMeetingScheduler`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        transactionID, 
        isMeetingRequested: true,
        includeSelfie: includeSelfie // NEW: send includeSelfie flag
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

  /**
   * API 3: Generate Email Draft
   * 
   * Generates an AI-powered email draft based on:
   * - Business card analysis (summarised_llm_response)
   * - Company research (summarised_llm_company_response)
   * - Optional notes and audio transcript
   */
  static async generateEmailDraft(recordId: string): Promise<{
    success: boolean;
    record_id: string;
    email_draft: string;
    email_subject: string;
    email_body: string;
    email_greeting: string;
    email_summary: string;
    context_used: {
      business_card_summary: boolean;
      company_summary: boolean;
      notes: boolean;
      audio_transcript: boolean;
    };
  }> {
    console.log('📧 Generating email draft for record:', recordId);

    const response = await fetch(`${API_BASE_URL}/api/generateEmailDraft/${recordId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Email draft generation error:', response.status, errorText);
      throw new Error(`Failed to generate email draft: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Email draft generated:', result);
    return result;
  }
}