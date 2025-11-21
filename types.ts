import React from 'react';

export enum AppView {
  HOME = 'HOME',
  COUPLE_GENERATOR = 'COUPLE_GENERATOR',
  BRAND_LOGO = 'BRAND_LOGO',
  AD_MAKER = 'AD_MAKER',
  PHOTO_EDITOR = 'PHOTO_EDITOR',
}

export enum EditorMode {
  ADD = 'Add',
  REMOVE = 'Remove',
  CHANGE = 'Change',
}

export interface GeneratedImage {
  url: string;
  timestamp: number;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}