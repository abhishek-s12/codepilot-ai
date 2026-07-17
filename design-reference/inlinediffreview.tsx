import React, { useRef, useState, useCallback } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

/**
 * ============================================================================
 * MONACO INLINE DIFF REVIEW — TWO APPROACHES COMPARED
 * ============================================================================
 *
 * The roadmap item "render an AI patch inline with Accept/Reject" can mean
 * two structurally different things. Pick based on what the mockup actually
 * wants, not by default:
 *
 * ── OPTION A: monaco.editor.createDiffEditor() ──────────────────────────────
 * A SEPARATE editor instance. Renders original vs. modified side-by-side (or
 * inline-unified with renderSideBySide: false). This is what you want if the
 * user should see "here is the whole diff for this file" as its own view —
 * e.g. a dedicated review screen, or the Monaco Diff Editor Codexa's docs
 * mention for "previews modified code side-by-side with original."
 * You do NOT get to keep the user's live single-editor view; you swap it out
 * for a diff editor, then swap back after accept/reject.
 *
 * ── OPTION B: decorations + addContentWidget() ──────────────────────────────
 * Stays inside the user's CURRENT single editor. You highlight specific line
 * ranges (green/red backgrounds via deltaDecorations), then pin a small
 * floating Accept/Reject panel next to the affected lines using
 * addContentWidget. This is what the Codexa mockup actually shows — the
 * inline_ai box sits IN THE FLOW of auth_service.py, not in a separate pane.
 *
 * RECOMMENDATION: Use Option B for the roadmap's "AI generates a patch inline
 * inside the code you're already reading" use case. Reserve Option A for a
 * dedicated "review this whole PR-style diff" screen, if you build one later.
 *
 * The rest of this file implements Option B end-to-end.
 * ============================================================================
 */

interface PatchSuggestion {
  id: string;
  startLine: number;
  endLine: number;
  originalText: string;
  suggestedText: string;
  label: string;       // e.g. "Security Audit"
  explanation: string; // shown in the overlay
}

const DEMO_PATCH: PatchSuggestion = {
  id: 'patch-001',
  startLine: 6,
  endLine: 7,
  originalText: [
    '    def login(self, user, pw):',
    '        if user.pw == pw:',
  ].join('\n'),
  suggestedText: [
    '    def login(self, user, pw):',
    '        if verify_hash(user.pw, pw):',
  ].join('\n'),
  label: 'Security Audit',
  explanation:
    'Plaintext password comparison is timing-attack vulnerable — replaced with verify_hash().',
};

const SAMPLE_CODE = `from auth.token_service import issue_token
from auth.exceptions import AuthError

class AuthService:
    # verifies credentials and issues a session token
    def login(self, user, pw):
        if user.pw == pw:
            return issue_token(user)
        raise AuthError("invalid credentials")

    # refresh an existing session
    def refresh(self, token):
        return token_service.rotate(token)
`;

export default function InlineDiffReviewDemo() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<monaco.editor.IEditorDecorationsCollection | null>(null);
  const widgetRef = useRef<monaco.editor.IContentWidget | null>(null);
  const [patchStatus, setPatchStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  // ---- Step 1: highlight the affected lines when the editor mounts ----
  const applyDiffDecorations = useCallback((patch: PatchSuggestion) => {
    const editor = editorRef.current;
    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    // Red decoration on the "old" lines, matching --diff-del-bg from the
    // design system. In a real patch flow, the old lines are already in the
    // buffer (this is the pre-patch state), so we just mark them.
    const decorations: monaco.editor.IModelDeltaDecoration[] = [
      {
        range: new monaco.Range(patch.startLine, 1, patch.endLine, 1),
        options: {
          isWholeLine: true,
          className: 'diff-del-line',       // maps to --diff-del-bg in CSS
          linesDecorationsClassName: 'diff-del-gutter',
        },
      },
    ];

    // createDecorationsCollection (Monaco 0.35+) is preferred over the old
    // deltaDecorations(oldIds, newDecorations) call — it manages its own
    // lifecycle and you dispose() it directly instead of tracking ID arrays.
    decorationsRef.current = editor.createDecorationsCollection(decorations);
  }, []);

  // ---- Step 2: pin the Accept/Reject overlay near the patch ----
  const showPatchWidget = useCallback((patch: PatchSuggestion) => {
    const editor = editorRef.current;
    if (!editor) return;

    const domNode = document.createElement('div');
    domNode.className = 'monaco-inline-patch-widget';
    domNode.innerHTML = `
      <div class="ip-header">◆ ${patch.label}</div>
      <div class="ip-body">${patch.explanation}</div>
      <div class="ip-actions">
        <button class="ip-reject">Reject</button>
        <button class="ip-accept">Accept patch</button>
      </div>
    `;

    // Wire the buttons AFTER innerHTML is set — event delegation on the
    // widget's own domNode, not global listeners, so multiple widgets
    // (multiple pending patches) don't collide.
    domNode.querySelector('.ip-accept')?.addEventListener('click', () => {
      applyPatch(patch);
    });
    domNode.querySelector('.ip-reject')?.addEventListener('click', () => {
      dismissPatch();
    });

    const widget: monaco.editor.IContentWidget = {
      getId: () => `patch-widget-${patch.id}`,
      getDomNode: () => domNode,
      getPosition: () => ({
        // Anchor just below the last affected line.
        position: { lineNumber: patch.endLine + 1, column: 1 },
        preference: [
          monaco.editor.ContentWidgetPositionPreference.BELOW,
          monaco.editor.ContentWidgetPositionPreference.ABOVE,
        ],
      }),
    };

    widgetRef.current = widget;
    editor.addContentWidget(widget);
  }, []);

  // ---- Step 3: Accept — apply the edit via executeEdits (keeps undo stack intact) ----
  const applyPatch = (patch: PatchSuggestion) => {
    const editor = editorRef.current;
    const model = editor?.getModel();
    if (!editor || !model) return;

    const range = new monaco.Range(
      patch.startLine,
      1,
      patch.endLine,
      model.getLineMaxColumn(patch.endLine)
    );

    // executeEdits (not setValue!) preserves undo/redo history and any other
    // decorations/cursors in the file — critical for a real editor, since a
    // raw setValue() would nuke the user's undo stack and scroll position.
    editor.executeEdits('ai-patch-accept', [
      {
        range,
        text: patch.suggestedText,
        forceMoveMarkers: true,
      },
    ]);

    cleanupWidgetAndDecorations();
    setPatchStatus('accepted');
  };

  // ---- Step 4: Reject — just remove the visual overlay, leave code untouched ----
  const dismissPatch = () => {
    cleanupWidgetAndDecorations();
    setPatchStatus('rejected');
  };

  const cleanupWidgetAndDecorations = () => {
    const editor = editorRef.current;
    if (editor && widgetRef.current) {
      editor.removeContentWidget(widgetRef.current);
      widgetRef.current = null;
    }
    decorationsRef.current?.clear();
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    applyDiffDecorations(DEMO_PATCH);
    showPatchWidget(DEMO_PATCH);
  };

  return (
    <div className="patch-demo-shell">
      <div className="patch-demo-status">
        Status: <strong>{patchStatus}</strong>
      </div>
      <Editor
        height="420px"
        defaultLanguage="python"
        defaultValue={SAMPLE_CODE}
        theme="vs-dark"
        onMount={handleEditorMount}
        options={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />

      {/*
        These styles would live in your global stylesheet, not inline —
        shown here so the widget's CSS classes above are traceable.
        Colors map directly to the design-system tokens.
      */}
      <style>{`
        .diff-del-line { background: rgba(248, 113, 113, 0.08); }
        .diff-del-gutter { border-left: 2px solid #F87171; }

        .monaco-inline-patch-widget {
          width: 420px;
          background: #141924;
          border: 1px solid #8A5A2E;
          border-radius: 8px;
          padding: 10px 12px;
          font-family: 'IBM Plex Sans', sans-serif;
          color: #E8ECF2;
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }
        .ip-header {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #FF9D4D;
          margin-bottom: 6px;
        }
        .ip-body { font-size: 12.5px; color: #E8ECF2; line-height: 1.5; margin-bottom: 10px; }
        .ip-actions { display: flex; gap: 8px; justify-content: flex-end; }
        .ip-actions button {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          border: none;
        }
        .ip-accept { background: #4ADE80; color: #0A2313; }
        .ip-reject { background: transparent; border: 1px solid #222834 !important; color: #8A93A3; }
      `}</style>
    </div>
  );
}

/**
 * ============================================================================
 * GOTCHAS THAT WILL BITE YOU IN PRODUCTION
 * ============================================================================
 *
 * 1. Widget position drifts after edits above it.
 *    If the user (or another patch) edits lines ABOVE your widget's anchor
 *    line before this patch is resolved, getPosition() needs to be recomputed
 *    — Monaco does NOT automatically track "line 7" through edits elsewhere
 *    in the file the way a decoration range does. For multi-patch scenarios,
 *    anchor the widget to a decoration's live range (model.getDecorationRange)
 *    instead of a hardcoded line number.
 *
 * 2. Multiple simultaneous patches need namespaced widget/decoration IDs.
 *    getId() must be unique per widget — using patch.id (not a static string)
 *    is required the moment you have more than one pending suggestion in the
 *    same file, which will happen with agent-generated multi-file patches.
 *
 * 3. executeEdits vs. applyEdits.
 *    executeEdits ties into the editor's undo stack and cursor/selection
 *    tracking — use it for anything user-visible. The lower-level
 *    model.applyEdits() skips that and will make Ctrl+Z behave unpredictably
 *    after an AI patch is accepted.
 *
 * 4. Cleanup on unmount.
 *    If the component unmounts (user navigates away) while a patch is still
 *    pending, the widget and decorations collection need explicit disposal
 *    in a useEffect cleanup — Monaco does not garbage-collect content widgets
 *    on its own if the editor instance itself persists (e.g. cached tabs).
 *
 * 5. Diffing algorithm for auto-generated ranges.
 *    This demo hardcodes startLine/endLine because the patch source (your
 *    agent) already knows them. If patches ever come from a raw text diff
 *    instead, you'll need a proper diff library (e.g. `diff-match-patch` or
 *    Monaco's own internal diff computer via
 *    `monaco.editor.createDiffNavigator`) to compute ranges — don't hand-roll
 *    line matching with string comparison, it breaks on any whitespace-only
 *    change.
 * ============================================================================
 */