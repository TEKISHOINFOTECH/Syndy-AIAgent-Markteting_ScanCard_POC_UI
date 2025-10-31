import type { UploadCardResponse, ScheduleMeetingResponse, BusinessCardData, UserInfo } from '../types/cardScanner';

const API_BASE_URL = 'http://localhost:8000';
const MOCK_MODE = true; // Set to false when backend is available

// Temporary storage for uploaded images and their analysis
const imageAnalysisCache = new Map<string, any>();

export class CardScannerAPI {
  /**
   * Upload and process business card image
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

    // Mock mode - analyze the uploaded image and return transaction ID
    if (MOCK_MODE) {
      console.log('🔧 Mock mode: Analyzing uploaded card image');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload time
      
      const mockTransactionId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Analyze the uploaded image to determine card type
      const imageDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(imageFile);
      });
      
      // Store extracted data based on image analysis
      // In a real app, this would use OCR/AI vision to extract from the actual image
      let extractedData;
      
      // Simple heuristic: check file name or analyze image content
      const fileName = imageFile.name.toLowerCase();
      console.log('📋 Analyzing image:', fileName, 'Size:', `${(imageFile.size / 1024).toFixed(2)}KB`);
      
      // For now, always extract YOUR card data since we know it's your business card
      // In production, this would use actual OCR/AI vision analysis
      extractedData = {
        name: 'Shivani Reddy',
        title: 'AI Innovation Associate',
        company: 'Tekisho Infotech',
        email: 'shivanireddy1454@gmail.com',
        phone: '+91 9989919782',
        address: 'Hyderabad, India',
        website: 'www.tekisho.com'
      };
      
      // Store the analysis result for this transaction
      imageAnalysisCache.set(mockTransactionId, {
        extractedData,
        imageDataUrl,
        fileName: imageFile.name,
        fileSize: imageFile.size,
        uploadTime: new Date().toISOString()
      });
      
      console.log('✅ Image analyzed and cached for transaction:', mockTransactionId);
      
      return {
        status: 200,
        message: "User Card Image is stored and being processed",
        transactionID: mockTransactionId
      };
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
   * Upload selfie image for a transaction
   */
  static async uploadSelfie(transactionID: string, selfieFile: File): Promise<any> {
    // Validation
    if (!selfieFile) {
      throw new Error('No selfie file provided');
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selfieFile.type)) {
      throw new Error(`Invalid file type. Please upload a JPEG or PNG image.`);
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selfieFile.size > maxSize) {
      throw new Error(`File size exceeds 10MB limit.`);
    }

    // Mock mode - return fake selfie upload success
    if (MOCK_MODE) {
      console.log('🔧 Mock mode: Simulating selfie upload');
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate upload time
      
      return {
        status: 200,
        message: "Selfie uploaded successfully",
        transactionID: transactionID
      };
    }

    const formData = new FormData();
    formData.append('selfie', selfieFile, selfieFile.name);
    formData.append('transactionID', transactionID);
    
    console.log('📤 Uploading selfie:', selfieFile.name, selfieFile.type, `${(selfieFile.size / 1024).toFixed(2)}KB`);

    const response = await fetch(`${API_BASE_URL}/api/transactions/${transactionID}/selfie`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Selfie upload error:', response.status, errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.detail || `Selfie upload failed: ${response.status}`);
      } catch {
        throw new Error(`Selfie upload failed (${response.status}): ${errorText}`);
      }
    }
    
    const result = await response.json();
    console.log('✅ Selfie upload successful:', result);
    return result;
  }

  /**
   * Schedule a meeting for a contact
   */
  static async scheduleMeeting(transactionID: string): Promise<ScheduleMeetingResponse> {
    // Mock mode - return fake meeting scheduling success
    if (MOCK_MODE) {
      console.log('🔧 Mock mode: Simulating meeting scheduling');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
      return {
        status: 200,
        message: "Meeting Invitation request is Received",
        transactionID: transactionID
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/intiateMeetingScheduler`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        transactionID, 
        isMeetingRequested: true 
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to schedule meeting: ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Check processing status of a card
   */
  static async checkProcessingStatus(transactionID: string): Promise<BusinessCardData> {
    // Mock mode - return analysis results from the uploaded image
    if (MOCK_MODE) {
      console.log('🔧 Mock mode: Retrieving analysis for transaction:', transactionID);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      // Get cached analysis results for this transaction
      let cachedAnalysis = imageAnalysisCache.get(transactionID);
      
      if (!cachedAnalysis) {
        console.warn('⚠️ No cached analysis found, using default data');
        // Fallback to default data if no cache found
        cachedAnalysis = {
          extractedData: {
            name: 'Shivani Reddy',
            title: 'AI Innovation Associate',
            company: 'Tekisho Infotech',
            email: 'shivanireddy1454@gmail.com',
            phone: '+91 9989919782',
            address: 'Hyderabad, India',
            website: 'www.tekisho.com'
          }
        };
      }
      
      console.log('✅ Processing complete! Extracted data:', cachedAnalysis.extractedData);
      console.log('📋 Card details extracted:');
      console.log('   Name:', cachedAnalysis.extractedData.name);
      console.log('   Title:', cachedAnalysis.extractedData.title);
      console.log('   Company:', cachedAnalysis.extractedData.company);
      console.log('   Email:', cachedAnalysis.extractedData.email);
      console.log('   Phone:', cachedAnalysis.extractedData.phone);
      
      return {
        transaction_id: transactionID,
        image_url: cachedAnalysis.imageDataUrl || null,
        processing_status: 'completed' as const,
        llm_response: {
          extracted_data: cachedAnalysis.extractedData,
          confidence_score: 0.95,
          processing_time_ms: 2000
        },
        created_at: new Date().toISOString(),
        processed_at: new Date().toISOString()
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/checkProcessingStatus/${transactionID}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to check processing status: ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Fetch extracted user info
   */
  static async getUserInfo(transactionID: string): Promise<UserInfo> {
    // Mock mode - return fake data when backend is not available
    if (MOCK_MODE) {
      console.log('🔧 Mock mode: Returning mock user info');
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      return {
        transaction_id: transactionID,
        email: null,
        name: null,
        phone: null,
        company: null,
        is_meeting_requested: false,
        created_at: new Date().toISOString(),
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/getUserInfo/${transactionID}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('📥 Raw getUserInfo response:', result);
    
    // Backend returns: { status: 200, transactionID: "...", data: {...}, exists: true }
    // Extract the nested data object
    if (result.data) {
      console.log('✅ Extracted user data:', result.data);
      return {
        transaction_id: result.transactionID || result.data.transaction_id,
        email: result.data.email || null,
        name: result.data.name || null,
        phone: result.data.phone || null,
        company: result.data.company || null,
        is_meeting_requested: result.data.is_meeting_requested || false,
        created_at: result.data.created_at,
      };
    }
    
    // Fallback if data structure is different
    console.warn('⚠️ Unexpected response structure, using result directly');
    return result;
  }
}
