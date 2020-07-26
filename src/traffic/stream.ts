
function debounce(func: () => void, waitFunc: () => number) {
  let timeout: number | null = null;

  return () => {
    const later = () => {
      timeout = null;
      func();
    };
    if (timeout) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(later, waitFunc());
  };
}

/**
 * Handler for Server Sent Events containing the position updates sent by the XY monitor.
 */
export class LocationStream {
  private eventSource: EventSource;
  private reconnectIntervalId: number | null = null;
  // doubles every retry up to 30 seconds
  private retryInterval = 1;

  private reconnectFunc = debounce(() => {
    this.eventSource = this.setupEventSource();
    // Double every attempt to avoid overwhelming server
    this.retryInterval *= 2;
    // Max out at ~30 sec as a compromise between user experience and server load
    if (this.retryInterval >= 32) {
      this.retryInterval = 32;
    }
    console.warn(`Connection lost, reconnecting in ${this.retryInterval} seconds ...`);
  }, () => this.retryInterval * 1000);

  constructor(readonly url: string, readonly onEvent: (ev: Event) => any, readonly onConnectionEvent: () => void) {
    this.eventSource = this.setupEventSource();
  }

  public close() {
    this.cancelReconnect();
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  public showWarning() {
    return this.retryInterval >= 4;
  }

  private cancelReconnect() {
    if (this.reconnectIntervalId) {
      window.clearInterval(this.reconnectIntervalId);
      this.reconnectIntervalId = null;
    }
  }

  private setupEventSource() {
    const source = new EventSource(this.url);
    source.onmessage = this.onEvent;
    //source.addEventListener(TYPE_POSITION_CAR, this.onEvent);
    //source.addEventListener(TYPE_POSITION_TERMINAL, this.onEvent);
    //source.addEventListener(TYPE_EXPIRY, this.onEvent);
    source.onopen = (e) => {
      // Reset reconnect frequency upon successful connection
      this.retryInterval = 1;
      this.onConnectionEvent();
    };
    source.onerror = (e) => {
      this.onConnectionEvent();
      source.close();
      this.reconnectFunc();
    };
    // Reconnect automatically every 9 minutes in order to limit the length of open connections
    this.cancelReconnect();
    this.reconnectIntervalId = window.setInterval(() => {
      if (this.eventSource) {
        this.eventSource.close();
      }
      this.eventSource = this.setupEventSource();
    }, 9 * 60 * 1000);

    return source;
  }
}
