// Copied from /shell by scripts/sync-shell.mjs. Edit the original there.
export interface Episode {
  /** Episode number in the video series */
  n: number;
  /** Folder name, also used as the UTM content tag */
  slug: string;
  title: string;
  /** "React Concept", "React Interview" or "React Pattern" */
  type: string;
  /** One sentence under the title */
  summary: string;
  concepts: string[];
  /** Short "how to play" steps */
  steps: string[];
  /** A small task for the viewer, also in the README */
  challenge: string;
  /** The episode video, once published (the menu hides it while empty) */
  videoUrl?: string;
}
