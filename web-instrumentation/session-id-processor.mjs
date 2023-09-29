import { v4 } from 'uuid';
const sessionKey = 'session';
const defaultSession = {
  userId: v4(),
  currencyCode: 'USD',
};

const SessionGateway = () => ({
  getSession() {
    if (typeof window === 'undefined') return defaultSession;
    const sessionString = localStorage.getItem(sessionKey);

    if (!sessionString) localStorage.setItem(sessionKey, JSON.stringify(defaultSession));

    return JSON.parse(sessionString || JSON.stringify(defaultSession));
  },
  setSessionValue(key, value) {
    const session = this.getSession();

    localStorage.setItem(sessionKey, JSON.stringify({ ...session, [key]: value }));
  },
});

const { userId } = SessionGateway().getSession();

export class SessionIdProcessor {
    forceFlush() {
        return Promise.resolve();
    }

    onStart(span, parentContext) {
        span.setAttribute('app.session.id', userId);
    }

    onEnd(span) {}

    shutdown() {
        return Promise.resolve();
    }
}

