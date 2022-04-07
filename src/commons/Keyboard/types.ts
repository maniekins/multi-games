import { KeysPressed } from './utils';

export type MapKeysType = (keys: string[], options: { arrows?: boolean; wsad?: boolean }) => KeysPressed;
