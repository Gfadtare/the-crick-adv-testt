// Cricket Skills Certification - Assessment Categories

export interface SubCategory {
  key: string;
  label: string;
}

export interface CategoryGroup {
  key: string;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  subCategories: SubCategory[];
}

export const ONLINE_CATEGORIES: CategoryGroup[] = [
  {
    key: "batting",
    label: "Batting",
    color: "border-emerald-500",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-800",
    subCategories: [
      { key: "batting_technique", label: "Batting Technique" },
      { key: "footwork_balance", label: "Footwork & Balance" },
      { key: "timing", label: "Timing" },
      { key: "shot_selection", label: "Shot Selection" },
      { key: "shot_execution", label: "Shot Execution" },
      { key: "head_position_stability", label: "Head Position & Stability" },
      { key: "bat_speed_followthrough", label: "Bat Speed & Follow-through" },
      { key: "consistency_batting", label: "Consistency" },
    ],
  },
  {
    key: "bowling",
    label: "Bowling",
    color: "border-amber-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-800",
    subCategories: [
      { key: "bowling_action_mechanics", label: "Bowling Action & Mechanics" },
      { key: "runup_balance", label: "Run-up & Balance" },
      { key: "release_point", label: "Release Point" },
      { key: "accuracy_line_length", label: "Accuracy & Line/Length" },
      { key: "pace_spin", label: "Pace / Spin" },
      { key: "variation", label: "Variation" },
      { key: "control_consistency_bowling", label: "Control & Consistency" },
      { key: "followthrough", label: "Follow-through" },
    ],
  },
  {
    key: "fielding",
    label: "Fielding",
    color: "border-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-800",
    subCategories: [
      { key: "catching_technique", label: "Catching Technique" },
      { key: "ground_fielding", label: "Ground Fielding" },
      { key: "throwing_technique", label: "Throwing Technique" },
      { key: "throwing_accuracy", label: "Throwing Accuracy" },
      { key: "agility_movement", label: "Agility & Movement" },
      { key: "reaction_speed_fielding", label: "Reaction Speed" },
      { key: "footwork_positioning", label: "Footwork & Positioning" },
    ],
  },
  {
    key: "wicketkeeping",
    label: "Wicketkeeping (if applicable)",
    color: "border-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-800",
    subCategories: [
      { key: "stance_positioning_wk", label: "Stance & Positioning" },
      { key: "glovework", label: "Glovework" },
      { key: "footwork_movement_wk", label: "Footwork & Movement" },
      { key: "catching_wk", label: "Catching" },
      { key: "stumping_technique", label: "Stumping Technique" },
      { key: "reaction_speed_wk", label: "Reaction Speed" },
    ],
  },
  {
    key: "powerplay_death_batting",
    label: "Power Play & Death Overs Skills Assessment - Batting",
    color: "border-rose-500",
    bgColor: "bg-rose-50",
    textColor: "text-rose-800",
    subCategories: [
      { key: "pp_batting_powerplay", label: "Skill in Power play Batting" },
      { key: "pp_batting_middle", label: "Skill in Middle Overs batting" },
      { key: "pp_batting_death", label: "Skill in Death Overs Batting" },
      { key: "pp_batting_overall", label: "Over all Power Play Batting Skills" },
    ],
  },
  {
    key: "powerplay_death_bowling",
    label: "Power Play & Death Overs Skills Assessment - Bowling",
    color: "border-cyan-500",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-800",
    subCategories: [
      { key: "pp_bowling_powerplay", label: "Skill With Power Play overs" },
      { key: "pp_bowling_death", label: "Skill with Death Overs" },
      { key: "pp_bowling_overall", label: "Overall Bowling Skills" },
    ],
  },
  {
    key: "overall",
    label: "Overall",
    color: "border-yellow-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-900",
    subCategories: [
      { key: "technical_execution", label: "Technical Execution" },
      { key: "skill_consistency", label: "Skill Consistency" },
      { key: "athletic_movement", label: "Athletic Movement" },
      { key: "overall_cricket_skill", label: "Overall Cricket Skill" },
      { key: "overall_performance_rating", label: "Overall Performance Rating" },
    ],
  },
];

export const OFFLINE_CATEGORIES: CategoryGroup[] = [
  {
    key: "batting",
    label: "Batting",
    color: "border-emerald-500",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-800",
    subCategories: [
      { key: "off_batting_technique", label: "Batting Technique" },
      { key: "off_stance_setup", label: "Stance & Setup" },
      { key: "off_footwork_balance", label: "Footwork & Balance" },
      { key: "off_timing", label: "Timing" },
      { key: "off_shot_selection", label: "Shot Selection" },
      { key: "off_shot_execution", label: "Shot Execution" },
      { key: "off_bat_speed_power", label: "Bat Speed & Power" },
      { key: "off_running_wickets", label: "Running Between Wickets" },
      { key: "off_consistency_batting", label: "Consistency" },
    ],
  },
  {
    key: "bowling",
    label: "Bowling",
    color: "border-amber-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-800",
    subCategories: [
      { key: "off_bowling_action_mechanics", label: "Bowling Action & Mechanics" },
      { key: "off_runup_balance", label: "Run-up & Balance" },
      { key: "off_release_point", label: "Release Point" },
      { key: "off_pace_spin", label: "Pace / Spin" },
      { key: "off_line_length", label: "Line & Length" },
      { key: "off_accuracy", label: "Accuracy" },
      { key: "off_variation", label: "Variation" },
      { key: "off_control_consistency_bowling", label: "Control & Consistency" },
      { key: "off_followthrough", label: "Follow-through" },
    ],
  },
  {
    key: "fielding",
    label: "Fielding",
    color: "border-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-800",
    subCategories: [
      { key: "off_catching", label: "Catching" },
      { key: "off_ground_fielding", label: "Ground Fielding" },
      { key: "off_throwing_technique", label: "Throwing Technique" },
      { key: "off_throwing_accuracy", label: "Throwing Accuracy" },
      { key: "off_agility_movement", label: "Agility & Movement" },
      { key: "off_reaction_speed", label: "Reaction Speed" },
      { key: "off_footwork_positioning", label: "Footwork & Positioning" },
      { key: "off_boundary_fielding", label: "Boundary Fielding" },
    ],
  },
  {
    key: "wicketkeeping",
    label: "Wicketkeeping (if applicable)",
    color: "border-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-800",
    subCategories: [
      { key: "off_stance_positioning_wk", label: "Stance & Positioning" },
      { key: "off_glovework", label: "Glovework" },
      { key: "off_footwork_movement_wk", label: "Footwork & Movement" },
      { key: "off_catching_wk", label: "Catching" },
      { key: "off_stumping", label: "Stumping" },
      { key: "off_reaction_speed_wk", label: "Reaction Speed" },
    ],
  },
  {
    key: "powerplay_death_batting",
    label: "Power Play & Death Overs Skills Assessment - Batting",
    color: "border-rose-500",
    bgColor: "bg-rose-50",
    textColor: "text-rose-800",
    subCategories: [
      { key: "off_pp_batting_powerplay", label: "Skill in Power play Batting" },
      { key: "off_pp_batting_middle", label: "Skill in Middle Overs batting" },
      { key: "off_pp_batting_death", label: "Skill in Death Overs Batting" },
      { key: "off_pp_batting_overall", label: "Over all Power Play Batting Skills" },
    ],
  },
  {
    key: "powerplay_death_bowling",
    label: "Power Play & Death Overs Skills Assessment - Bowling",
    color: "border-cyan-500",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-800",
    subCategories: [
      { key: "off_pp_bowling_powerplay", label: "Skill With Power Play overs" },
      { key: "off_pp_bowling_death", label: "Skill with Death Overs" },
      { key: "off_pp_bowling_overall", label: "Overall Bowling Skills" },
    ],
  },
  {
    key: "fitness",
    label: "Fitness & Athletic Ability",
    color: "border-teal-500",
    bgColor: "bg-teal-50",
    textColor: "text-teal-800",
    subCategories: [
      { key: "off_fit_speed", label: "Speed" },
      { key: "off_fit_agility", label: "Agility" },
      { key: "off_fit_endurance", label: "Endurance" },
      { key: "off_fit_explosiveness", label: "Explosiveness" },
      { key: "off_fit_coordination", label: "Coordination" },
      { key: "off_fit_flexibility", label: "Flexibility / Mobility" },
    ],
  },
  {
    key: "match_skills",
    label: "Match & Game Skills",
    color: "border-indigo-500",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-800",
    subCategories: [
      { key: "off_game_awareness", label: "Game Awareness" },
      { key: "off_decision_making", label: "Decision Making" },
      { key: "off_tactical_understanding", label: "Tactical Understanding" },
      { key: "off_pressure_handling", label: "Pressure Handling" },
      { key: "off_communication", label: "Communication" },
      { key: "off_teamwork", label: "Teamwork" },
    ],
  },
  {
    key: "overall",
    label: "Overall",
    color: "border-yellow-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-900",
    subCategories: [
      { key: "off_technical_ability", label: "Technical Ability" },
      { key: "off_skill_consistency", label: "Skill Consistency" },
      { key: "off_match_readiness", label: "Match Readiness" },
      { key: "off_athletic_ability", label: "Athletic Ability" },
      { key: "off_overall_cricket_skill", label: "Overall Cricket Skill" },
      { key: "off_overseas_club_readiness", label: "Overseas Club Readiness" },
    ],
  },
];

export type ScoresMap = Record<string, number>;

export const getCategories = (testMode: "Online" | "Offline"): CategoryGroup[] => {
  return testMode === "Online" ? ONLINE_CATEGORIES : OFFLINE_CATEGORIES;
};

export const getAllKeys = (testMode: "Online" | "Offline"): string[] => {
  return getCategories(testMode).flatMap(g => g.subCategories.map(s => s.key));
};

export const initialScores = (testMode: "Online" | "Offline"): ScoresMap => {
  return Object.fromEntries(getAllKeys(testMode).map(k => [k, 0]));
};

export const categoryAverage = (group: CategoryGroup, scores: ScoresMap): number => {
  const filled = group.subCategories.filter(s => scores[s.key] > 0);
  if (filled.length === 0) return 0;
  const total = filled.reduce((acc, s) => acc + scores[s.key], 0);
  return Math.round((total / filled.length) * 10) / 10;
};

export const grandAverage = (testMode: "Online" | "Offline", scores: ScoresMap): number => {
  const keys = getAllKeys(testMode);
  const isWkKey = (k: string) => k.includes("wk") || k.includes("stumping") || k.includes("glovework") || k === "off_catching_wk";
  
  const activeKeys = keys.filter(k => {
    if (isWkKey(k)) {
      return scores[k] > 0;
    }
    return true;
  });

  const filled = activeKeys.filter(k => scores[k] > 0);
  if (filled.length === 0) return 0;
  const total = filled.reduce((acc, k) => acc + (scores[k] || 0), 0);
  return Math.round((total / filled.length) * 10) / 10;
};
