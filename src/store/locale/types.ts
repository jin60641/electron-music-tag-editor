export enum Actions {
  SET_LOCALE = 'LOCALE.SET_LOCALE',
}

export type LocaleState = {
  code: string;
};

export const Locale = {
  English: 'en',
  한국어: 'ko',
};

export const initialState: LocaleState = { code: 'en' };
