import React, { useRef, useEffect } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightSpecialChars } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { indentOnInput, bracketMatching, foldGutter, foldKeymap, syntaxHighlighting, HighlightStyle, indentUnit } from '@codemirror/language';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { tags } from '@lezer/highlight';

// Custom dark theme inspired by One Dark / VS Code
const editorTheme = EditorView.theme({
  '&': {
    backgroundColor: '#0B0F19',
    color: '#abb2bf',
    fontSize: '13px',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
    height: '100%',
  },
  '.cm-content': {
    caretColor: '#528bff',
    padding: '16px 8px',
    lineHeight: '22px',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#528bff',
    borderLeftWidth: '2px',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#3e4451',
  },
  '.cm-panels': { backgroundColor: '#0B0F19', color: '#abb2bf' },
  '.cm-panels.cm-panels-top': { borderBottom: '1px solid #181d2a' },
  '.cm-panels.cm-panels-bottom': { borderTop: '1px solid #181d2a' },
  '.cm-searchMatch': {
    backgroundColor: '#72a1ff59',
    outline: '1px solid #457dff',
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: '#6199ff2f',
  },
  '.cm-activeLine': { backgroundColor: '#ffffff06' },
  '.cm-selectionMatch': { backgroundColor: '#aafe661a' },
  '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
    backgroundColor: '#bad0f847',
    outline: '1px solid #515a6b',
  },
  '.cm-gutters': {
    backgroundColor: '#080B11',
    color: '#495162',
    border: 'none',
    borderRight: '1px solid #1a1f2e',
    minWidth: '48px',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'transparent',
    color: '#818cf8',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: '#1e2433',
    border: 'none',
    color: '#6b7280',
  },
  '.cm-tooltip': {
    border: '1px solid #1e2433',
    backgroundColor: '#0f1320',
  },
  '.cm-tooltip .cm-tooltip-arrow:before': {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  '.cm-tooltip .cm-tooltip-arrow:after': {
    borderTopColor: '#0f1320',
    borderBottomColor: '#0f1320',
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: '#1e2433',
      color: '#abb2bf',
    },
  },
  '.cm-scroller': {
    overflow: 'auto',
    height: '100%',
  },
  '.cm-scroller::-webkit-scrollbar': {
    width: '6px',
    height: '6px',
  },
  '.cm-scroller::-webkit-scrollbar-track': {
    backgroundColor: '#0B0F19',
  },
  '.cm-scroller::-webkit-scrollbar-thumb': {
    backgroundColor: '#1E293B',
    borderRadius: '3px',
  },
  '.cm-scroller::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#334155',
  },
  '.cm-line': {
    padding: '0 8px',
  },
}, { dark: true });

// Custom syntax highlighting for Python
const syntaxColors = HighlightStyle.define([
  { tag: tags.keyword, color: '#c678dd', fontWeight: '600' },
  { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName], color: '#e06c75' },
  { tag: [tags.function(tags.variableName), tags.labelName], color: '#61afef' },
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#d19a66' },
  { tag: [tags.definition(tags.name), tags.separator], color: '#abb2bf' },
  { tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#e5c07b' },
  { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link, tags.special(tags.string)], color: '#56b6c2' },
  { tag: [tags.meta, tags.comment], color: '#5c6370', fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: 'bold', color: '#d19a66' },
  { tag: tags.emphasis, fontStyle: 'italic', color: '#c678dd' },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: tags.link, color: '#56b6c2', textDecoration: 'underline' },
  { tag: tags.heading, fontWeight: 'bold', color: '#e06c75' },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: '#d19a66' },
  { tag: [tags.processingInstruction, tags.string, tags.inserted], color: '#98c379' },
  { tag: tags.invalid, color: '#ffffff', backgroundColor: '#e06c75' },
]);

const PythonEditor = ({ value, onChange, height = 420 }) => {
  const editorContainerRef = useRef(null);
  const editorViewRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Keep callback ref fresh
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Initialize editor
  useEffect(() => {
    if (!editorContainerRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString();
        onChangeRef.current(newValue);
      }
    });

    const state = EditorState.create({
      doc: value || '',
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        indentUnit.of('    '),
        keymap.of([
          indentWithTab,
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
        ]),
        python(),
        editorTheme,
        syntaxHighlighting(syntaxColors),
        updateListener,
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorContainerRef.current,
    });

    editorViewRef.current = view;

    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (e.g. when a new challenge loads)
  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) return;
    const currentValue = view.state.doc.toString();
    if (value !== currentValue) {
      view.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value || '' },
      });
    }
  }, [value]);

  return (
    <div
      ref={editorContainerRef}
      className="w-full overflow-hidden"
      style={{ height: `${height}px` }}
    />
  );
};

export default PythonEditor;
