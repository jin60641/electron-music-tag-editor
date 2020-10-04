declare global {
  interface Window {
    bridge: {
      storage: any,
      ipc: {
        send: (channel: string, data: any) => void,
        receive: (channel: string, cb: (data: any) => void) => void,
      },
    },
  }
}

export {};
