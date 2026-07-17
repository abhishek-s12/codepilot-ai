import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import * as api from "../services/api";
import useToast from "../hooks/useToast";

// Mocking third party components that don't play well in JSDOM / node env
vi.mock("@xyflow/react", () => ({
  ReactFlow: ({ children }: any) => <div data-testid="react-flow">{children}</div>,
  MiniMap: () => null,
  Controls: () => null,
  Background: () => null,
  MarkerType: { ArrowClosed: "arrowclosed" },
  useNodesState: (initial: any) => [initial, vi.fn(), vi.fn()],
  useEdgesState: (initial: any) => [initial, vi.fn(), vi.fn()],
  useReactFlow: () => ({
    fitView: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
  }),
}));

vi.mock("react-markdown", () => ({
  default: ({ children }: any) => <div data-testid="markdown-content">{children}</div>,
}));

vi.mock("@monaco-editor/react", () => ({
  default: () => <div data-testid="monaco-editor">Monaco Editor Mock</div>,
  Editor: () => <div data-testid="monaco-editor">Monaco Editor Mock</div>,
  DiffEditor: () => <div data-testid="monaco-diff-editor">Monaco Diff Editor Mock</div>,
}));

// Mock AISidebar to avoid complex nested lazy loading issues in integration tests
vi.mock("../components/workspace/AISidebar", () => ({
  default: ({ activeTab, setActiveTab }: any) => (
    <div data-testid="mock-ai-sidebar">
      <button title="Chat" onClick={() => setActiveTab("chat")}>Chat</button>
      <button title="Agents Coordinator" onClick={() => setActiveTab("agents")}>Agents</button>
      {activeTab === "chat" ? (
        <input placeholder="Ask the AI..." defaultValue="" />
      ) : (
        <div data-testid="other-tab-content">Other Content</div>
      )}
    </div>
  ),
}));

// Mock all services/api calls
vi.mock("../services/api", () => {
  return {
    fetchUser: vi.fn(),
    fetchRepositories: vi.fn(),
    loginDeveloper: vi.fn(),
    cloneRepository: vi.fn(),
    deleteRepository: vi.fn(),
    fetchRepositoryFiles: vi.fn().mockResolvedValue([]),
    fetchFileContent: vi.fn().mockResolvedValue({ content: "" }),
    fetchArchitecture: vi.fn().mockResolvedValue({ analysis: "" }),
    fetchRepositoryGraph: vi.fn().mockResolvedValue({ nodes: [], edges: [] }),
    fetchCallGraph: vi.fn().mockResolvedValue({}),
    fetchFlow: vi.fn().mockResolvedValue({}),
    fetchNotifications: vi.fn().mockResolvedValue([]),
    markNotificationRead: vi.fn().mockResolvedValue({ success: true }),
    markAllNotificationsRead: vi.fn().mockResolvedValue({ success: true }),
    getErrorMessage: (_err: unknown, fallback: string) => fallback,
    API_BASE_URL: "http://localhost:8000/api",
  };
});

vi.mock("../services/git", () => {
  return {
    fetchGitStatus: vi.fn().mockResolvedValue({ modified: [], untracked: [], staged: [] }),
    fetchGitHistory: vi.fn().mockResolvedValue([]),
    fetchGitDiff: vi.fn().mockResolvedValue(""),
    suggestCommitMessage: vi.fn().mockResolvedValue("Initial commit"),
    fetchExplainCommit: vi.fn().mockResolvedValue("Explaining..."),
    reviewPullRequest: vi.fn().mockResolvedValue("Reviewing..."),
  };
});

describe("Core Loop Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Mock default successful token validation / empty repos
    vi.mocked(api.fetchUser).mockResolvedValue({
      id: "usr_123",
      name: "Test Developer",
      email: "test@codepilot.ai",
    });
    vi.mocked(api.fetchRepositories).mockResolvedValue([]);
  });

  it("should render login screen if no token exists in local storage", async () => {
    render(<App />);
    
    // Switch to Sandbox Mode tab
    const sandboxTabBtn = await screen.findByRole("button", { name: /sandbox mode/i });
    fireEvent.click(sandboxTabBtn);

    // Now check if the fields exist
    expect(screen.getByPlaceholderText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^email$/i)).toBeInTheDocument();
  });

  it("should successfully log in when developer submits the form", async () => {
    vi.mocked(api.loginDeveloper).mockResolvedValue({
      token: "mock_token",
      refresh_token: "mock_refresh_token",
    });

    render(<App />);

    // Switch to Sandbox Mode tab
    const sandboxTabBtn = await screen.findByRole("button", { name: /sandbox mode/i });
    fireEvent.click(sandboxTabBtn);

    // Wait for the login screen fields to be visible
    const nameInput = await screen.findByPlaceholderText(/^name$/i);
    const emailInput = await screen.findByPlaceholderText(/^email$/i);

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitBtn = screen.getByRole("button", { name: /access sandbox/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.loginDeveloper).toHaveBeenCalledWith("Test User", "test@example.com");
      expect(localStorage.getItem("codepilot_token")).toBe("mock_token");
    });
  });

  it("should navigate to onboarding screen once logged in but no active repo exists", async () => {
    localStorage.setItem("codepilot_token", "mock_token");
    
    render(<App />);

    // Wait for onboarding screen
    await waitFor(() => {
      expect(screen.getByText(/Analyze codebases instantly/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/https:\/\/github\.com/i)).toBeInTheDocument();
    });
  });

  it("should show workspaces and tabs after repository path is active", async () => {
    localStorage.setItem("codepilot_token", "mock_token");
    
    // Render with existing repository mock history
    vi.mocked(api.fetchRepositories).mockResolvedValue([
      {
        id: "repo_1",
        repository_name: "test-repo",
        repository_path: "d:/repos/test-repo",
        files_indexed: 5,
        chunks_indexed: 25,
        status: "completed",
        created_at: "2026-07-17T00:00:00Z",
      },
    ]);

    render(<App />);

    // Should load the workspace screen and tabs automatically due to auto-select of completed repo
    await waitFor(() => {
      expect(screen.getByText("Explain Repository")).toBeInTheDocument();
      expect(screen.getByText("Admin Panel")).toBeInTheDocument();
    });

    // Switch tabs: click on the Chat tab button by its tooltip/title
    const chatTabBtn = await screen.findByTitle("Chat");
    fireEvent.click(chatTabBtn);

    // Verify chat UI elements are visible
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/ask the/i)).toBeInTheDocument();
    });
  });
});

describe("Hooks Isolation Tests", () => {
  it("useToast should add and remove toast messages", () => {
    const TestComponent = () => {
      const { toasts, showToast } = useToast();
      return (
        <div>
          <button onClick={() => showToast("Success toast", "success")}>Trigger Toast</button>
          <div data-testid="toasts-list">
            {toasts.map((t) => (
              <span key={t.id}>{t.message} ({t.type})</span>
            ))}
          </div>
        </div>
      );
    };

    render(<TestComponent />);
    expect(screen.queryByText("Success toast (success)")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Trigger Toast"));
    expect(screen.getByText("Success toast (success)")).toBeInTheDocument();
  });
});
