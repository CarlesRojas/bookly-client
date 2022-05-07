import { useContext, useEffect, useState, useCallback, useRef } from "react";
import Auth from "./components/auth/Auth";
import DesktopLayout from "./components/layout/DesktopLayout";
import MobileLayout from "./components/layout/MobileLayout";

import { API } from "./contexts/API";
import { MediaQuery } from "./contexts/MediaQuery";
import { Events } from "./contexts/Events";
import { GlobalState } from "./contexts/GlobalState";
import { Data } from "./contexts/Data";

export default function App() {
    const { isLoggedIn, getAllUserBooks } = useContext(API);
    const { isMobile, isTablet, isMobileSize, isLandscape } = useContext(MediaQuery);
    const { sub, unsub } = useContext(Events);
    const { set } = useContext(GlobalState);
    const { userBooks } = useContext(Data);

    // #################################################
    //   LOGIN
    // #################################################

    const [loggedIn, setLoggedIn] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    const firstCheckDone = useRef(false);
    useEffect(() => {
        if (firstCheckDone.current) return;
        firstCheckDone.current = true;

        const checkLogin = async () => {
            setLoggedIn(await isLoggedIn());
        };

        checkLogin();
    }, [dataLoaded, isLoggedIn, loggedIn, set]);

    useEffect(() => {
        const loadData = async () => {
            if (loggedIn && !dataLoaded) {
                // TODO Load all books the user has

                // Get user books
                const userBooksResult = await getAllUserBooks();
                if (!("error" in userBooksResult)) {
                    userBooks.current = userBooksResult.books;

                    setDataLoaded(true);
                }
            }
        };

        loadData();
    }, [loggedIn, dataLoaded, getAllUserBooks, userBooks, set]);

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
