import type { UploadCardResponse, ScheduleMeetingResponse, EmailDraftResponse, ProcessedCardResult, BusinessCardStreamEvent } from '../types/cardScanner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  static async uploadCard(
    imageFile: File,
    options?: {
      streamCompanyResearch?: boolean;
      confirmTempRecordId?: string; // NEW: For Phase 2 confirmation
      // Called for each SSE event chunk when streaming is enabled
      onStreamEvent?: (evt: BusinessCardStreamEvent) => void;
      // Called once with the initial parsed JSON (business card data) in streaming mode
      onInitial?: (payload: UploadCardResponse) => void;
    }
  ): Promise<ProcessedCardResult> {
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

    // Phase detection and parameter building
    const params = new URLSearchParams();

    if (options?.confirmTempRecordId) {
      // Phase 2: Confirmation
      params.append('confirm', 'true');  // ✅ Send as query param
      params.append('temp_record_id', options.confirmTempRecordId);
      
      if (options?.streamCompanyResearch) {
        params.append('stream_company_research', 'true');
      }
    } else {
      // Phase 1: Detection
      params.append('confirm', 'false');  // ✅ Send as query param
    }

    const endpoint = `${API_BASE_URL}/ai-business-card${params.toString() ? '?' + params.toString() : ''}`;
    console.log('🚀 API endpoint:', endpoint, 'Phase:', options?.confirmTempRecordId ? '2 (Confirmation)' : '1 (Detection)');

    const response = await fetch(endpoint, {
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
    
    // If streaming requested AND confirmed, parse text/event-stream
    const contentType = response.headers.get('content-type') || '';
    console.log('📦 Response Content-Type:', contentType);
    console.log('🔍 Should use streaming?', options?.confirmTempRecordId && options?.streamCompanyResearch && contentType.includes('text/event-stream'));
    
    if (options?.confirmTempRecordId && options?.streamCompanyResearch && contentType.includes('text/event-stream')) {
      console.log('✅ Using SSE streaming parser');
      // Stream reader setup
      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      if (!reader) {
        throw new Error('Streaming not supported by this browser (no reader)');
      }

      // We'll resolve the promise once we receive the initial JSON chunk
      // Continue to stream events via callbacks
      let resolved = false;
      let initialPayload: UploadCardResponse | null = null;

      const processBuffer = () => {
        // Split SSE messages by double newline
        const parts = buffer.split('\n\n');
        // Keep last partial chunk in buffer
        buffer = parts.pop() || '';
        console.log('📨 Processing', parts.length, 'SSE message(s)');
        
        for (const part of parts) {
          const lines = part.split('\n');
          let event = 'message';
          let data = '';
          for (const line of lines) {
            if (line.startsWith('event:')) {
              event = line.slice(6).trim();
            } else if (line.startsWith('data:')) {
              data += line.slice(5).trim();
            }
          }
          console.log('📬 SSE Event:', event, 'Data length:', data.length);
          
          try {
            const parsed = data ? JSON.parse(data) : null;
            console.log('✅ Parsed SSE data:', { event, parsed: parsed ? Object.keys(parsed) : null });
            
            // The first SSE is the initial_response (full business card payload)
            // Backend can send method as 'ai_vision' or 'google_vision_opencv'
            if (!resolved && parsed && typeof parsed.success === 'boolean' && parsed.record_id) {
              console.log('🎯 Found initial payload with record_id!');
              initialPayload = parsed as UploadCardResponse;
              options?.onInitial?.(initialPayload);
              resolved = true;
              // Return immediately while we continue streaming via callbacks
              // Note: Returning a value here isn't possible in this context; we'll resolve below once we break the loop
            }
            options?.onStreamEvent?.({ event, data: parsed });
          } catch (e) {
            console.warn('⚠️ Failed to parse SSE data chunk:', e, 'Raw data:', data);
          }
        }
      };

      // Read stream - continue in background even after returning initial payload
      const continueStreamReading = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            processBuffer();
          }
        } catch (error) {
          console.error('Stream reading error:', error);
        }
      };

      // Start reading stream
      // Keep reading until we get initial payload, then continue in background
      console.log('🔄 Starting to read SSE stream...');
      while (!resolved) {
        const { value, done } = await reader.read();
        if (done) {
          console.error('❌ Stream ended before receiving initial payload');
          throw new Error('Stream ended before receiving initial payload');
        }
        const chunk = decoder.decode(value, { stream: true });
        console.log('📥 Received chunk:', chunk.substring(0, 200) + (chunk.length > 200 ? '...' : ''));
        buffer += chunk;
        processBuffer();
      }

      // Initial payload received - continue stream reading in background
      continueStreamReading(); // Don't await - let it run async

      // Return initial response immediately
      if (initialPayload) {
        const payload = initialPayload as UploadCardResponse;
        const transactionID = payload.record_id || `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
          status: 200,
          message: 'User Card Image is stored and being processed (streaming company research)',
          transactionID,
          aiResponse: payload,
        };
      }

      // If stream ended without an initial payload, error out
      throw new Error('Streaming ended before receiving initial payload');
    }

    // Phase 1: Detection (no confirmTempRecordId) - returns plain JSON
    if (!options?.confirmTempRecordId) {
      const detectionResult = await response.json();
      console.log('✅ Phase 1 Detection result:', detectionResult);
      
      // Return with temp_record_id for Phase 2 confirmation
      return {
        status: 200,
        message: detectionResult.is_business_card ? 'Card detected successfully' : 'Not a valid business card',
        transactionID: detectionResult.temp_record_id || `temp_${Date.now()}`,
        aiResponse: detectionResult,
      };
    }

    // Phase 2: Non-streaming JSON path (confirm=true but stream_company_research=false)
    const result: UploadCardResponse = await response.json();
    console.log('✅ Phase 2 Non-streaming result:', result);
    const transactionID = result.record_id || `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      status: 200,
      message: 'User Card Image is stored and being processed',
      transactionID,
      aiResponse: result,
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

  // Prefer a concrete endpoint that returns the record by id
  // Update here if your backend exposes a different route
  const endpoint = `${API_BASE_URL}/api/customer-scanned-data/${transactionID}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Fetch card data error:', response.status, errorText);
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
    includeSelfie: boolean = false,
    emailDraft?: { to: string; subject: string; body: string }
  ): Promise<ScheduleMeetingResponse> {
    console.log('📅 Scheduling meeting:', { transactionID, includeSelfie, emailDraft });
    
    const response = await fetch(`${API_BASE_URL}/api/intiateMeetingScheduler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        record_id: transactionID, // Backend expects 'record_id'
        isMeetingRequested: true,
        includeSelfie,
        ...(emailDraft && {
          email_draft: {
            to: emailDraft.to,
            subject: emailDraft.subject,
            body: emailDraft.body,
          },
        }),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.detail || `Meeting scheduling failed: ${response.status}`);
      } catch {
        throw new Error(`Meeting scheduling failed (${response.status}): ${errorText}`);
      }
    }

    return response.json();
  }

  // Note: duplicate generateEmailDraft implementation removed; single method with optional options is kept above.

  // Add new method to save email draft
  static async saveEmailDraft(
    transactionID: string,
    emailDraft: { to: string; subject: string; body: string }
  ): Promise<{ success: boolean; message: string }> {
    console.log('📧 Saving email draft:', { transactionID, emailDraft });
    
    const response = await fetch(`${API_BASE_URL}/api/generateEmailDraft/${transactionID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_draft: {
          to: emailDraft.to,
          subject: emailDraft.subject,
          body: emailDraft.body,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.detail || `Email draft save failed: ${response.status}`);
      } catch {
        throw new Error(`Email draft save failed (${response.status}): ${errorText}`);
      }
    }

    return response.json();
  }
}