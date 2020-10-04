import { Metadata } from 'store/music/types';

export interface Option {
  value?: string | number,
  label: string,
}

export type FieldKeys = keyof Omit<Metadata, 'year' | 'picture'>;
