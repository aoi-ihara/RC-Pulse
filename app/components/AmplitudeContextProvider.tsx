"use client";

import { useEffect } from "react";
import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

export default function AmplitudeInit() {
    useEffect(() => {
        const sessionReplay = sessionReplayPlugin({
            sampleRate: 1,
        });
        amplitude.add(sessionReplay);

        amplitude.init("a5550487f61ae856c2e196aafe5cb2b0", {
            fetchRemoteConfig: true,
            autocapture: {
                attribution: true,
                fileDownloads: true,
                formInteractions: true,
                pageViews: true,
                sessions: true,
                elementInteractions: true,
                networkTracking: true,
                webVitals: true,
                frustrationInteractions: {
                    thrashedCursor: true,
                    errorClicks: true,
                    deadClicks: true,
                    rageClicks: true,
                },
            },
        });
    }, []);

    return null;
}
