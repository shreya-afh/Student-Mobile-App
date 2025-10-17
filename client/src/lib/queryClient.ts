import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Detect platform and set API base URL immediately
function detectPlatform(): string {
  try {
    // Check if Capacitor is available globally (it is in native apps)
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      const Capacitor = (window as any).Capacitor;
      if (Capacitor.isNativePlatform && Capacitor.isNativePlatform()) {
        // Running in native Android/iOS app
        // Try to use the current Replit dev URL (works when testing from Replit)
        const replitDevUrl = window.location.origin.includes('replit') 
          ? window.location.origin 
          : "https://ifafh-skilling.replit.app";
        console.log('🤖 Android/iOS app detected - API URL:', replitDevUrl);
        console.log('📍 Current origin:', window.location.origin);
        return replitDevUrl;
      }
    }
    console.log('🌐 Web browser detected - using relative URLs');
  } catch (error) {
    console.log('❌ Error checking platform:', error);
  }
  // Running in web browser - use relative URLs
  return "";
}

// Initialize API_BASE_URL immediately
let API_BASE_URL = detectPlatform();

// Listen for Capacitor ready event in case it loads after this module
if (typeof window !== 'undefined') {
  document.addEventListener('deviceready', () => {
    const newUrl = detectPlatform();
    if (newUrl !== API_BASE_URL) {
      API_BASE_URL = newUrl;
      console.log('🔄 Platform re-detected after Capacitor ready:', newUrl);
    }
  }, { once: true });
}

// Export for compatibility
export async function getApiBaseUrl(): Promise<string> {
  return API_BASE_URL;
}

async function ensureApiBaseUrl(): Promise<string> {
  return API_BASE_URL;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    console.error('❌ API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      responseText: text
    });
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const baseUrl = await ensureApiBaseUrl();
  const fullUrl = baseUrl + url;
  console.log(`📡 API Request: ${method} ${fullUrl}`);
  
  try {
    const res = await fetch(fullUrl, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    console.log(`✅ API Success: ${method} ${fullUrl}`);
    return res;
  } catch (error) {
    console.error(`❌ API Failed: ${method} ${fullUrl}`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = await ensureApiBaseUrl();
    const url = queryKey.join("/") as string;
    const fullUrl = baseUrl + url;
    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
