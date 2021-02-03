export default class EventManager {

  constructor() {
    this.listeners = {};
  }

  subscribe(eventType, listener) {
    this.listeners[eventType] = this.listeners[eventType] || [];
    this.listeners[eventType].push(listener);
  }

  unsubscribe(eventType, listener) {
    this.listeners[eventType] = this.listeners[eventType].filter(e => e !== listener);
  }

  notify(eventType, data) {

    if (!this.listeners[eventType]) return;

    for (var i = 0; i < this.listeners[eventType].length; i++) {
      this.listeners[eventType][i](data);
    }
  }
}