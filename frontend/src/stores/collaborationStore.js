class CollaborationStore {
  constructor() {
    this.state = {
      comments: [],
      notifications: [
        { id: 1, text: "AI indexing database compiled successfully.", time: "2m ago", read: false },
        { id: 2, text: "Security report ready for download.", time: "1h ago", read: true }
      ],
      connected: false,
      projectId: "default-project",
    };
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  setProjectId(projectId) {
    this.state.projectId = projectId;
    this.emit();
  }

  setConnected(connected) {
    this.state.connected = connected;
    this.emit();
  }

  setComments(comments) {
    this.state.comments = comments;
    this.emit();
  }

  addComment(comment) {
    if (this.state.comments.some((c) => c.id === comment.id)) return;
    this.state.comments = [comment, ...this.state.comments];
    this.emit();
  }

  deleteComment(commentId) {
    this.state.comments = this.state.comments.filter((c) => c.id !== commentId);
    this.emit();
  }

  setNotifications(notifications) {
    this.state.notifications = notifications;
    this.emit();
  }

  addNotification(notification) {
    this.state.notifications = [
      {
        id: Date.now() + Math.random(),
        text: notification.text,
        time: "Just now",
        read: false,
      },
      ...this.state.notifications,
    ];
    this.emit();
  }

  clearNotifications() {
    this.state.notifications = [];
    this.emit();
  }
}

export const collaborationStore = new CollaborationStore();
