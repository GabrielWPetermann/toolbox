export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UrlShortenerResponse {
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  isCustom: boolean;
}

export interface QRCodeResponse {
  text: string;
  qrCodeDataURL: string;
}
