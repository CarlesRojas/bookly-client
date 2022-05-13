import { useContext, useEffect, useState, useCallback, useRef } from "react";
import Auth from "./components/auth/Auth";
import DesktopLayout from "./components/layout/DesktopLayout";
import MobileLayout from "./components/layout/MobileLayout";
import Loading from "./components/layout/Loading";
import useCssOneTimeAnimation from "./hooks/useCssOneTimeAnimation";

import { API } from "./contexts/API";
import { MediaQuery } from "./contexts/MediaQuery";
import { Events } from "./contexts/Events";
import { GlobalState } from "./contexts/GlobalState";
import { Data } from "./contexts/Data";
import { Utils } from "./contexts/Utils";

export default function App() {
    const { isLoggedIn, getAllUserBooks } = useContext(API);
    const { isMobile, isTablet, isMobileSize, isLandscape } = useContext(MediaQuery);
    const { sub, unsub } = useContext(Events);
    const { set } = useContext(GlobalState);
    const { APP_NAME, setUserBooks, books, authors } = useContext(Data);
    const { getInfo } = useContext(Utils);

    // #################################################
    //   LOADING FOR AT LEAST ONE SECOND
    // #################################################

    const [loading, triggerLoading] = useCssOneTimeAnimation(750, true);

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

    const loadedDone = useRef(false);
    useEffect(() => {
        const loadData = async () => {
            if (loggedIn && !loadedDone.current) {
                loadedDone.current = true;
                triggerLoading();

                // Load previous session books and authors from local storage
                books.current = getInfo(`${APP_NAME}_books`) || [];
                authors.current = getInfo(`${APP_NAME}_authors`) || [];

                // Get user books
                const userBooksResult = await getAllUserBooks();
                if (!("error" in userBooksResult)) {
                    setUserBooks(userBooksResult.books);

                    setDataLoaded(true);
                }
            }
        };

        loadData();
    }, [loggedIn, dataLoaded, getAllUserBooks, setUserBooks, set, APP_NAME, authors, books, getInfo, triggerLoading]);

    useEffect(() => {
        if (!loggedIn) loadedDone.current = false;
    }, [loggedIn]);

    const handleLogout = useCallback(() => {
        setDataLoaded(false);
        setLoggedIn(false);
    }, []);

    // #################################################
    //   EVENTS
    // #################################################

    useEffect(() => {
        sub("onLogout", handleLogout);

        return () => {
            unsub("onLogout", handleLogout);
        };
    }, [handleLogout, sub, unsub]);

    // #################################################
    //   RENDER
    // #################################################

    if (loggedIn === null) return null;
    else if (!loggedIn) return <Auth setLoggedIn={setLoggedIn} />;
    else if (loggedIn && dataLoaded && !loading)
        return isMobile || isMobileSize || (isTablet && !isLandscape) ? <MobileLayout /> : <MobileLayout />;
    else return <Loading />;
}
