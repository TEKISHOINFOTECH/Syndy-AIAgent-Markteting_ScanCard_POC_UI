const API_BASE_URL = "http://localhost:8000";

export interface UploadCardResponse {
  success: boolean;
  filename: string;
  method: string;
  structured_data: any;
  confidence: number;
  qr_codes: any[];
  qr_count: number;
  formatted_output: string;
  raw_analysis: string;
  additional_info: any;
  saved_to_database: boolean;
  database_available: boolean;
  record_id: string;
  error?: string;
  // Phase 1 detection fields (backend returns these)
  detection_complete?: boolean;
  is_business_card?: boolean;
  cropped_image_preview?: string; // base64 with data:image/jpeg;base64, prefix
  temp_record_id?: string;
  validation_reason?: string;
  suggestions?: string[];
  message?: string;
  requires_confirmation?: boolean;
}

// Wrapper returned by services/api.ts uploadCard helper (maps record_id -> transactionID and includes original AI response)
export interface ProcessedCardResult {
  status: number;
  message: string;
  transactionID: string; // mapped from backend record_id
  aiResponse: UploadCardResponse; // full original backend payload
}

// Streaming event interface for optional company research SSE
export interface BusinessCardStreamEvent {
  event: string; // e.g. 'company_research_start', 'company_research_saved', 'company_research_error'
  data: any;     // parsed JSON from data: line
}

export interface ScheduleMeetingResponse {
  status: number;
  message: string;
  record_id: string;
  transactionID: string;
}

export interface EmailDraftResponse {
  success: boolean;
  record_id: string;
  email_draft?: {
    subject?: string;
    body?: string;
    greeting?: string;
    summary?: string;
  };
  email_subject?: string;
  email_body?: string;
  email_greeting?: string;
  email_summary?: string;
  context_used?: {
    business_card_summary: boolean;
    company_summary: boolean;
    notes: boolean;
    audio_transcript: boolean;
  };
}

export interface UserInfo {
  transactionID: string; // Unified naming: same as record_id from backend, mapped to transactionID
  email: string | null;
  name: string | null;
  phone: string | null;
  company: string | null;
  is_meeting_requested: boolean;
  created_at?: string;
}

// export interface BusinessCardData {
//   transaction_id: string;
//   image_url: string | null;
//   processing_status: 'pending' | 'processing' | 'completed' | 'failed';
//   llm_response: LLMResponse | null;
//   created_at?: string;
//   processed_at?: string | null;
// }

export interface LLMResponse {
  extracted_data: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    title?: string;
    address?: string;
    [key: string]: any;
  };
  confidence_score?: number;
}

// App-level scan state used by CardScannerApp
export interface CardScanState {
  step: 'landing' | 'capture' | 'processing' | 'preview' | 'rejection' | 'result' | 'avatar' | 'selfie' | 'emailDraft' | 'meetingScheduler' | 'confirmation';
  transactionID: string | null;
  capturedImage: File | null;
  extractedData: UserInfo | null;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed' | null;
  isLoading: boolean;
  error: string | null;
  llmResponse: LLMResponse | null;
  emailDraft: { to: string; subject: string; body: string } | null;
  // Phase 1 detection result
  detectionResult?: {
    isBusinessCard: boolean;
    croppedImagePreview?: string; // base64
    confidence?: number;
    tempRecordId?: string;
    validationReason?: string;
    suggestions?: string[];
  };
}

export class CardScannerAPI {
  /**
   * Upload and process business card image
   */
  static async uploadCard(imageFile: File): Promise<UploadCardResponse> {
    // Validation
    if (!imageFile) {
      throw new Error('No image file provided');
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
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
    
    return result;
  }

  /**
   * Schedule meeting with customer
   */
  static async scheduleMeeting(recordId: string): Promise<ScheduleMeetingResponse> {
    console.log('📅 Scheduling meeting for record:', recordId);

    const response = await fetch(`${API_BASE_URL}/api/intiateMeetingScheduler`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        record_id: recordId,
        isMeetingRequested: true,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Meeting scheduling error:', response.status, errorText);
      throw new Error(`Failed to schedule meeting: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Meeting scheduled:', result);
    return result;
  }

  /**
   * Generate email draft using AI
   */
  static async generateEmailDraft(recordId: string): Promise<EmailDraftResponse> {
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
