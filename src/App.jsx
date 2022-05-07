import { useContext, useEffect, useState, useCallback } from "react";
import Auth from "./components/auth/Auth";
import DesktopLayout from "./components/layout/DesktopLayout";
import MobileLayout from "./components/layout/MobileLayout";

import { API } from "./contexts/API";
import { MediaQuery } from "./contexts/MediaQuery";
import { Events } from "./contexts/Events";
import { GlobalState } from "./contexts/GlobalState";

export default function App() {
    const { isLoggedIn } = useContext(API);
    const { isMobile, isTablet, isMobileSize, isLandscape } = useContext(MediaQuery);
    const { sub, unsub } = useContext(Events);
    const { set } = useContext(GlobalState);

    // #################################################
    //   LOGIN
    // #################################################

    const [loggedIn, setLoggedIn] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const checkLogin = async () => {
            if (await isLoggedIn()) {
                setLoggedIn(true);

                // TODO Load all books the user has

                setDataLoaded(true);
            } else setLoggedIn(false);

            set("loadingVisible", false);
        };

        checkLogin();
    }, [isLoggedIn, loggedIn, set]);

    // #################################################
    //   EVENTS
    // #################################################

    const handleLogout = useCallback(() => {
        setDataLoaded(false);
        setLoggedIn(null);
    }, []);

    useEffect(() => {
        sub("onLogout", handleLogout);

        return () => {
            unsub("onLoginError", handleLogout);
        };
    }, [handleLogout, sub, unsub]);

    if (loggedIn === null) return null;
    else if (!loggedIn) return <Auth setLoggedIn={setLoggedIn} />;
    else if (loggedIn && dataLoaded)
        return isMobile || isMobileSize || (isTablet && !isLandscape) ? <MobileLayout /> : <DesktopLayout />;
    else return null;
}
