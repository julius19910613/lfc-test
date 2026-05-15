/**
 * Compatibility shim for @storybook/addon-notes (deprecated in Storybook 6).
 * In Storybook 6, notes are handled by @storybook/addon-docs (part of addon-essentials).
 * This shim keeps existing story files working without changes to the story functions.
 */
// eslint-disable-next-line no-unused-vars
const withMarkdownNotes = (_notes) => (storyFn) => storyFn;

export default withMarkdownNotes;
