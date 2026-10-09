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
  /** The interview question and a model answer, written the way you'd say it out loud */
  interview?: {
    question: string;
    /** The full answer, one paragraph per idea */
    answer: string[];
    /** The same answer in about 30 seconds */
    short: string;
    followUps?: { q: string; a: string }[];
  };
  /** The episode video, once published (the menu hides it while empty) */
  videoUrl?: string;
}
