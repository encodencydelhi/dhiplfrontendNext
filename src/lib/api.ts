export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * next/image's optimizer refuses to fetch from private/local IPs (SSRF
 * protection) — true only while the API points at localhost/127.0.0.1, which
 * only happens in local dev. Once deployed, NEXT_PUBLIC_API_URL is a real
 * public domain and this is false, so optimization turns on automatically.
 */
export const API_IS_LOCAL = /localhost|127\.0\.0\.1/.test(API_URL);

interface RequestConfig {
    params?: Record<string, string | number | boolean | undefined | null>;
    headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
    data: T;
    status: number;
}

/**
 * Thrown shape mirrors axios's error so existing call sites' `catch (error) {
 * error.response?.data?.message }` pattern keeps working unchanged.
 */
export class ApiError extends Error {
    response?: { data: any; status: number };
    constructor(message: string, response?: { data: any; status: number }) {
        super(message);
        this.name = "ApiError";
        this.response = response;
    }
}

function buildUrl(url: string, params?: RequestConfig["params"]) {
    if (!params) return url;
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) qs.append(key, String(value));
    });
    const queryString = qs.toString();
    if (!queryString) return url;
    return url + (url.includes("?") ? "&" : "?") + queryString;
}

async function request<T = any>(
    method: string,
    url: string,
    body?: any,
    config?: RequestConfig
): Promise<ApiResponse<T>> {
    const base = url.startsWith("http") ? url : `${API_URL}${url}`;
    const fullUrl = buildUrl(base, config?.params);

    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    const headers: Record<string, string> = { ...(config?.headers || {}) };
    if (body !== undefined && !isFormData && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }
    // A manually-set multipart Content-Type has no boundary token, which
    // corrupts the request — FormData bodies need the browser to generate
    // the header (with boundary) itself.
    if (isFormData) delete headers["Content-Type"];

    const res = await fetch(fullUrl, {
        method,
        credentials: "include",
        headers,
        body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });

    let data: any = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        const message = data?.message || res.statusText || "Request failed";
        throw new ApiError(message, { data, status: res.status });
    }

    return { data, status: res.status };
}

export const api = {
    get: <T = any>(url: string, config?: RequestConfig) => request<T>("GET", url, undefined, config),
    post: <T = any>(url: string, body?: any, config?: RequestConfig) => request<T>("POST", url, body, config),
    put: <T = any>(url: string, body?: any, config?: RequestConfig) => request<T>("PUT", url, body, config),
    patch: <T = any>(url: string, body?: any, config?: RequestConfig) => request<T>("PATCH", url, body, config),
    delete: <T = any>(url: string, config?: RequestConfig) => request<T>("DELETE", url, undefined, config),
};

/**
 * Fetched once in the root layout and handed to every page via
 * LocationsContext, instead of each page's Location widget fetching its own
 * filtered copy client-side in a useEffect. That client-only fetch rendered
 * null during SSR (data wasn't there yet), so the city-page links never
 * existed in the initial HTML — the /[slug] pages had no crawlable internal
 * link anywhere on the site. Fetching the full unfiltered list server-side
 * and filtering by category/current-path in the component fixes that.
 */
export async function fetchLocations(): Promise<any[]> {
    try {
        const res = await fetch(`${API_URL}/api/custom-pages/locations`, { next: { revalidate: 300 } });
        const json = await res.json();
        return json?.success ? json.data || [] : [];
    } catch {
        return [];
    }
}

/**
 * Server-side equivalent of Hero.tsx's `/api/hero/active` fetch + schedule
 * filter, used to seed the first paint so the LCP hero image URL is present
 * in the initial SSR HTML instead of only appearing after the client fetch
 * resolves (this was the single largest LCP cost — ~68% of load time).
 */
export async function fetchActiveHeroSlides(): Promise<any[]> {
    try {
        const res = await fetch(`${API_URL}/api/hero/active`, { next: { revalidate: 60 } });
        const json = await res.json();
        if (!json.success) return [];

        return (json.data || []).filter((slide: any) => {
            if (!slide.isActive) return false;
            if (slide.schedule?.startDate && slide.schedule?.startTime) {
                const now = Date.now();
                const startDateTime = new Date(slide.schedule.startDate + "T" + slide.schedule.startTime).getTime();
                const endDateTime = slide.schedule.endDate && slide.schedule.endTime
                    ? new Date(slide.schedule.endDate + "T" + slide.schedule.endTime).getTime()
                    : null;
                if (now < startDateTime) return false;
                if (endDateTime && now > endDateTime) return false;
            }
            return true;
        });
    } catch {
        return [];
    }
}
