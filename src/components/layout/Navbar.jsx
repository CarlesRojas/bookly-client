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
    const { sub, unsub } = useContext(Events);

    // #################################################
    //   STATE
    // #################################################

    const [selected, updateSelected] = useState(currentPage.current);
    const prevPage = useRef(0);

    const setSelected = useThrottle((newIndex) => {
        if (selected === newIndex) return;

        currentPage.current = newIndex;
        prevPage.current = newIndex;
        updateSelected(newIndex);
        setPage(newIndex);
    }, 300);

    // #################################################
    //   AUTHOR AND BOOK PAGES
    // #################################################

    const updatePage = useCallback(
        (newIndex) => {
            if (selected === newIndex) return;
            currentPage.current = newIndex;
            updateSelected(newIndex);
            setPage(newIndex);
        },
        [currentPage, selected, setPage]
    );

    // #################################################
    //   EVENTS
    // #################################################

    useEffect(() => {
        sub("onSetPage", updatePage);

        return () => {
            unsub("onSetPage", updatePage);
        };
    }, [updatePage, sub, unsub]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className={cn("Navbar", { showBack: selected >= 4 })}>
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
            <div className="back neoButton" onClick={() => setSelected(prevPage.current)}>
                <SVG className="icon" src={BackIcon} />
                <p>back</p>
            </div>
        </div>
    );
}
