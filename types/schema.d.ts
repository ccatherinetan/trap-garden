import type { UUID } from 'crypto';

export type SeasonEnum = 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER';

export type DifficultyLevelEnum = 'EASY' | 'MODERATE' | 'HARD';

export interface Profile {
  user_id: UUID;
  us_state: string;
  user_type: string;
  // has_plot: boolean;
}

export interface Plant {
  id: UUID;
  plant_name: string;
  us_state: string;
  harvest_season: SeasonEnum;
  water_frequency: string;
  weeding_frequency: string;
  indoors_start: string;
  indoors_end: string;
  outdoors_start: string;
  outdoors_end: string;
  transplant_start: string;
  transplant_end: string;
  harvest_start: string;
  harvest_end: string;
  beginner_friendly: boolean;
  plant_tips: string;
  img: string;
  difficulty_level: DifficultyLevelEnum;
  sunlight_min_hours: int;
  sunlight_max_hours: int;
}

export interface UserPlant {
  id: UUID;
  user_id: UUID;
  plant_id: UUID;
  date_added: string;
  date_harvested: string;
  planting_type: string;
}

export interface DropdownOption<T = string> {
  label: string;
  value: T;
}
export interface OwnedPlant {
  userPlantId: UUID;
  plant: Plant;
}
