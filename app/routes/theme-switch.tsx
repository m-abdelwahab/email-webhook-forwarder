/**
 * @returns the client hint theme.
 */
export function useTheme() {
  const hints = useHints();
  return hints.theme;
}
