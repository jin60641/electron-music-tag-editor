declare module '*.png' {
  const value: string;
  export = value;
}

declare global {
  interface Window {
    bridge: {
      storage: Storage,
      copyImage: (imgUrl: string) => void,
      pasteImage: () => Uint8Array,
      pasteText: () => string,
      ipc: {
        send: (channel: string, never: any) => void,
        receive: (channel: string, cb: (data: never) => void) => void,
      },
    },
  }
}

export {};
