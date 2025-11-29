export interface Ingredient {
  name: string;
}

export interface DishOption {
  id: 'tart' | 'ring';
  title: string;
  styleDescription: string;
  ingredients: string[];
  prompt: string;
}

export const DISH_OPTIONS: DishOption[] = [
  {
    id: 'tart',
    title: 'Option A – Golden Apple Tart',
    styleDescription: 'Spiral Rosette Tart',
    ingredients: ['Apple slices', 'Egg', 'Milk', 'Flour', 'Butter'],
    prompt: 'Professional food photography of a Golden Apple Tart. Thin, curved, glossy, slightly translucent apple slices arranged in a perfect tight spiral rosette. Golden-brown edges, smooth gradient from warm yellow to amber. Low-key lighting, soft blur background, rustic wooden surface. Warm natural atmosphere. Photorealistic, 8k resolution, cinematic lighting.',
  },
  {
    id: 'ring',
    title: 'Option B – Radish-Petal Ring',
    styleDescription: 'Radial Petal Ring with Center Blossom',
    ingredients: ['Radish slices', 'Prosciutto', 'Seaweed mixed with sushi rice'],
    prompt: 'Professional food photography of a Radish-Petal Ring. Paper-thin radish slices, white centers, pink edges, arranged as a tight circular ring. Prosciutto flower in the center with delicate folds, soft marbling, pale pink with darker lines. Base layer of soft rounded mound of seasoned sushi rice partially wrapped in seaweed. Low-key lighting, soft blur background, marble surface. Warm natural atmosphere. Photorealistic, 8k resolution, cinematic lighting.',
  }
];

export enum AppState {
  IDLE = 'IDLE',
  ASSEMBLING = 'ASSEMBLING', // The 3D animation phase
  GENERATING = 'GENERATING', // Waiting for AI (can overlap with assembly)
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}