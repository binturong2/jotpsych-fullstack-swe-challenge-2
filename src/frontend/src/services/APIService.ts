// services/APIService.tsx

class APIService {
  private static instance: APIService;
  private baseUrl: string;
  private appVersion: string;

  private constructor() {
    this.baseUrl = "http://localhost:3002";
    this.appVersion = "1.0.0";
  }

  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  public async request(
    endpoint: string,
    method: string,
    body?: any,
    auth: boolean = false,
    multipart: boolean = false
  ): Promise<any> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "app-version": this.appVersion,
    };

    if (auth) {
      let token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    let requestBody: string | FormData | undefined = body;
    if (multipart && body instanceof FormData) {
      requestBody = body;
    } else if (body) {
      requestBody = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  }
}

export default APIService.getInstance();
