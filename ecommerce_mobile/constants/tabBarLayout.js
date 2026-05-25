/** Floating cart button extends above the dock into the scroll area */
export const TAB_DOCK_FAB_OVERFLOW = 24;

/** Extra scroll padding when tab dock is in layout flow (not absolute) */
export function getScrollBottomPadding(_insets = { bottom: 0 }) {
  return TAB_DOCK_FAB_OVERFLOW + 28;
}
