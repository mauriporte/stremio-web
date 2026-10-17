import React, { createContext, useContext } from 'react';
import { WHITELISTED_HOSTS } from 'stremio/common/CONSTANTS';
import { name, isMobile } from './device';
import useShell from './shell/useShell';

interface PlatformContext {
    name: string;
    isMobile: boolean;
    shell: Shell;
    openExternal: (url: string) => void;
}

const PlatformContext = createContext<PlatformContext>({} as PlatformContext);

type Props = {
    children: JSX.Element;
};

const PlatformProvider = ({ children }: Props) => {
    const shell = useShell();

    const openExternal = (url: string) => {
        try {
            const { hostname } = new URL(url);
            const isWhitelisted = WHITELISTED_HOSTS.some((host: string) =>
                hostname === host || hostname.endsWith('.' + host)
            );
            const finalUrl = !isWhitelisted ? `https://www.stremio.com/warning#${encodeURIComponent(url)}` : url;

            const opened = window.open(finalUrl, '_blank');
            // ha-theme: inside the HA Android app (WebView iframe) popups are dropped; navigating the top
            // window to a non-HA URL makes the app hand it to the phone's browser, and the page keeps polling.
            if (!opened) {
                try {
                    window.top!.location.href = finalUrl;
                } catch (e) {
                    console.error('Failed to open external url:', e);
                }
            }
        } catch (e) {
            console.error('Failed to parse external url:', e);
        }
    };

    return (
        <PlatformContext.Provider value={{ openExternal, shell, name, isMobile }}>
            {children}
        </PlatformContext.Provider>
    );
};

const usePlatform = () => {
    return useContext(PlatformContext);
};

export {
    PlatformProvider,
    usePlatform
};
