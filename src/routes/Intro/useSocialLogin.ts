import { useCallback, useEffect, useRef, useState } from 'react';
import { usePlatform } from 'stremio/common';
import hat from 'hat';

type Options<T> = {
    loginUrl: string;
    getCredentials: (state: string) => Promise<T>;
    interval: number;
    errorMessage: string;
};

type Attempt = {
    timeout: ReturnType<typeof setTimeout> | null;
};

const MAX_TRIES = 300; // ha-theme: 25 s was too short to log in from another app (browser)

const useSocialLogin = <T>({ loginUrl, getCredentials, interval, errorMessage }: Options<T>): [() => Promise<T>, () => void, string | null] => {
    const { openExternal } = usePlatform();
    const currentAttempt = useRef<Attempt | null>(null);
    // ha-theme: the login link, shown in the loader so it can be opened by hand when no browser opens
    const [url, setUrl] = useState<string | null>(null);

    const stop = useCallback(() => {
        const attempt = currentAttempt.current;
        currentAttempt.current = null;
        setUrl(null);
        if (attempt?.timeout) {
            clearTimeout(attempt.timeout);
        }
    }, []);

    const start = useCallback(() => {
        stop();
        return new Promise<T>((resolve, reject) => {
            const attempt: Attempt = { timeout: null };
            currentAttempt.current = attempt;
            const state = hat(128);
            let tries = 0;

            setUrl(`${loginUrl}/${state}`);
            openExternal(`${loginUrl}/${state}`);

            const waitForCredentials = () => {
                if (currentAttempt.current !== attempt) {
                    return;
                }

                attempt.timeout = setTimeout(() => {
                    if (tries >= MAX_TRIES) {
                        currentAttempt.current = null;
                        reject(new Error(errorMessage, { cause: 'Number of allowed tries exceeded!' }));
                        return;
                    }

                    tries++;
                    getCredentials(state)
                        .then((credentials) => {
                            if (currentAttempt.current === attempt) {
                                currentAttempt.current = null;
                                resolve(credentials);
                            }
                        })
                        .catch(waitForCredentials);
                }, interval);
            };

            waitForCredentials();
        });
    }, [stop, openExternal, loginUrl, getCredentials, interval, errorMessage]);

    useEffect(() => stop, [stop]);

    return [start, stop, url];
};

export default useSocialLogin;
