import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject JWT token into requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("codepilot_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Automatically retry failed transient requests (network drops or 5xx status codes) with exponential backoff
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!config) return Promise.reject(error);

    // Initializing retry state
    (config as any).retryCount = (config as any).retryCount ?? 0;

    // Retry settings
    const MAX_RETRIES = 3;
    const isNetworkOr5xxError =
      !error.response || (error.response.status >= 500 && error.response.status <= 599);

    if (isNetworkOr5xxError && (config as any).retryCount < MAX_RETRIES) {
      (config as any).retryCount += 1;
      
      // Calculate exponential backoff duration (1s, 2s, 4s)
      const backoffDelay = Math.pow(2, (config as any).retryCount) * 1000;
      console.warn(`[API] Retrying request (${(config as any).retryCount}/${MAX_RETRIES}) in ${backoffDelay}ms: ${config.url}`);
      
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return api(config);
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: any, fallbackMessage: string): string {
  return error?.response?.data?.detail ?? error?.message ?? fallbackMessage;
}

// Authentication Calls
export async function loginDeveloper(name: string, email: string): Promise<any> {
  const response = await api.post("/auth/developer-login", { name, email });
  if (response.data?.token) {
    localStorage.setItem("codepilot_token", response.data.token);
  }
  return response.data;
}

export async function fetchUser(): Promise<any> {
  const response = await api.get("/auth/me");
  return response.data;
}

// History Calls
export async function fetchRepositories(): Promise<any> {
  const response = await api.get("/repositories");
  return response.data;
}

export async function deleteRepository(repoId: string | number): Promise<any> {
  const response = await api.delete(`/repositories/${repoId}`);
  return response.data;
}

// Safe File Fetching Call
export async function fetchFileContent(filePath: string): Promise<any> {
  const response = await api.get("/repository/file", {
    params: { path: filePath },
  });
  return response.data;
}

export async function saveFileContent(filePath: string, content: string): Promise<any> {
  const response = await api.post("/repository/save-file", {
    path: filePath,
    content: content,
  });
  return response.data;
}

export async function fetchRepositoryFiles(repoPath: string): Promise<any> {
  const response = await api.get("/scanner/scan", {
    params: { repo_path: repoPath },
  });
  return response.data;
}

// Existing Core Calls
export async function cloneRepository(repoUrl: string): Promise<any> {
  const response = await api.post("/repository/clone", {
    repo_url: repoUrl,
  });
  return response.data;
}

export async function indexRepository(repoPath: string): Promise<any> {
  const response = await api.post("/indexer/index", {
    repo_path: repoPath,
  });
  return response.data;
}

export async function askQuestion(question: string, repoPath: string | null = null): Promise<any> {
  const response = await api.post("/ai/ask", {
    question,
    repo_path: repoPath,
    stream: false,
  });
  return response.data;
}

export async function fetchArchitecture(repoPath: string): Promise<any> {
  const response = await api.post("/repository/architecture", {
    repo_path: repoPath,
  });
  return response.data;
}

export async function fetchCallGraph(repoPath: string): Promise<any> {
  const response = await api.post("/repository/call-graph", {
    repo_path: repoPath,
  });
  return response.data;
}

export async function fetchFlow(repoPath: string): Promise<any> {
  const response = await api.post("/repository/flow", {
    repo_path: repoPath,
  });
  return response.data;
}

export async function fetchRepositoryReview(repoPath: string): Promise<any> {
  const response = await api.post("/review/repository", {
    repo_path: repoPath,
  });
  return response.data;
}

export async function fetchRepositoryAnalytics(repoPath: string): Promise<any> {
  const response = await api.get("/repository/analytics", {
    params: { repo_path: repoPath },
  });
  return response.data;
}

export async function fetchRepositoryGraph(repoPath: string): Promise<any> {
  const response = await api.get("/repository/graph", {
    params: { repo_path: repoPath },
  });
  return response.data;
}

export async function fetchFileSymbols(filePath: string): Promise<any> {
  const response = await api.get("/symbols", {
    params: { path: filePath },
  });
  return response.data;
}

export async function searchCodebase(query: string, repoPath: string | null = null): Promise<any> {
  const response = await api.get("/search/search", {
    params: { query, repo_path: repoPath },
  });
  return response.data;
}

export async function runAIActionStream(payload: any): Promise<any> {
  return fetch(`${API_BASE_URL}/ai/action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("codepilot_token") || ""}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function fetchObservabilityMetrics(): Promise<any> {
  const response = await api.get("/observability/metrics");
  return response.data;
}

export { API_BASE_URL };
export default api;
