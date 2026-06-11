export type StorylineKey =
  | "tournamentWinner"
  | "runnerUp"
  | "darkHorse"
  | "underachievers"
  | "groupStageFlop"
  | "perfectRecord";

export type StorylineConfig = {
  key: StorylineKey;
  label: string;
  description: string;
  helper: string;
};

export type StorylineCountry = {
  countryId: string;
  countryName: string;
  flagCode: string;
  groupLetter: string;
};

export type StorylineSelection = StorylineCountry | null;

export type StorylineSelections = Record<StorylineKey, StorylineSelection>;

export const STORYLINES: StorylineConfig[] = [
  {
    key: "tournamentWinner",
    label: "Tournament Winner",
    description: "Predict the ultimate champion lifting the trophy.",
    helper: "Choose the nation that goes all the way.",
  },
  {
    key: "runnerUp",
    label: "Runner-Up",
    description: "Predict the heartbreaking second-place finisher.",
    helper: "The team that makes the final but falls just short.",
  },
  {
    key: "darkHorse",
    label: "Dark Horse",
    description: "An overlooked or lower-ranked nation that shocks everyone.",
    helper: "The non-powerhouse team that crashes the deep knockout rounds.",
  },
  {
    key: "underachievers",
    label: "Underachievers",
    description: "The top-seeded world superpower that completely flops.",
    helper: "The team with massive expectations that exits embarrassingly early.",
  },
  {
    key: "groupStageFlop",
    label: "Group Stage Flop",
    description: "A highly-ranked country that fails to even escape their group.",
    helper: "The ultimate group-stage disaster that busts everyone's brackets.",
  },
  {
    key: "perfectRecord",
    label: "The Perfect Record",
    description: "The country that completely dominates the opening round.",
    helper: "Finishes the group stage with a flawless 3 wins and 0 goals conceded.",
  },
] as const;

export const STORYLINES_STORAGE_KEY = "wc26-storylines-predictions";