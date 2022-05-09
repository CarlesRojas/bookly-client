import { useState, useRef, useEffect, useContext, useCallback } from "react";
import cn from "classnames";
import SVG from "react-inlinesvg";
import useThrottle from "../../hooks/useThrottle";

import { Events } from "../../contexts/Events";

import HomeIcon from "../../resources/icons/book.svg";
import SearchIcon from "../../resources/icons/search.svg";
import StatsIcon from "../../resources/icons/stats.svg";
import SettingsIcon from "../../resources/icons/settings.svg";
import BackIcon from "../../resources/icons/back.svg";

const PAGES = [
    {
        name: "Home",
        icon: HomeIcon,
    },
    {
        name: "Search",
        icon: SearchIcon,
    },
    {
        name: "Stats",
        icon: StatsIcon,
    },
    {
        name: "Settings",
        icon: SettingsIcon,
    },
];

export default function Navbar({ setPage, currentPage }) {
    const { sub, unsub, emit } = useContext(Events);

    // #################################################
    //   STATE
    // #################################################

    const [selected, updateSelected] = useState(currentPage.current);

    const setSelected = useThrottle((newIndex) => {
        if (selected === newIndex) return;

        currentPage.current = newIndex;
        updateSelected(newIndex);
        setPage(newIndex);
    }, 300);

    // #################################################
    //   BACK BUTTON
    // #################################################

    const [showBack, setShowBack] = useState(false);

    const handleShowBackButton = useCallback((show) => {
        setShowBack(show);
    }, []);

    // #################################################
    //   EVENTS
    // #################################################

    useEffect(() => {
        sub("onShowBackButton", handleShowBackButton);

        return () => {
            unsub("onShowBackButton", handleShowBackButton);
        };
    }, [handleShowBackButton, sub, unsub]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className={cn("Navbar", { showBack })}>
            <div className="main neoButton">
                {PAGES.map(({ name, icon }, i) => (
                    <SVG
                        className={cn("icon", { selected: selected === i })}
                        src={icon}
                        onClick={() => setSelected(i)}
                        key={name}
                    />
                ))}
            </div>
            <div className="back neoButton" onClick={() => emit("onBackButtonClicked")}>
                <SVG className="icon" src={BackIcon} />
                <p>back</p>
            </div>
        </div>
    );
}
