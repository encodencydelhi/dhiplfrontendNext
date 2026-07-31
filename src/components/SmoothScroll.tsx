"use client";

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';

interface SmoothScrollProps {
    children: ReactNode;
    stopped?: boolean;
}

const LenisStopHandler = ({ stopped }: { stopped: boolean }) => {
    const lenis = useLenis();
    useEffect(() => {
        if (stopped) {
            lenis?.stop();
        } else {
            lenis?.start();
        }
    }, [stopped, lenis]);
    return null;
};

const SmoothScroll = ({ children, stopped = false }: SmoothScrollProps) => {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1,
                duration: 1.5,
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false,
            }}
        >
            <LenisStopHandler stopped={stopped} />
            {children}
        </ReactLenis>
    );
};

export default SmoothScroll;
