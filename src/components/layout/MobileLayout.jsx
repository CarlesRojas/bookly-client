import { useRef } from "react";
import usePageAnimation from "../../hooks/usePageAnimation";

import Home from "../pages/Home";
import Search from "../pages/Search";
import Stats from "../pages/Stats";
import Settings from "../pages/Settings";
import Book from "../pages/Book";
import Author from "../pages/Author";
import Navbar from "./Navbar";

const STAGES = ["home", "search", "stats", "settings", "book", "author"];

export default function MobileLayout() {
    // #################################################
    //   PAGE ANIMATION
    // #################################################

    const currentPage = useRef(0);

    const animationSpeed = 300;
    const content = STAGES.map((id) => {
        if (id === "home") return <Home />;
        else if (id === "search") return <Search />;
        else if (id === "stats") return <Stats />;
        else if (id === "settings") return <Settings />;
        else if (id === "book") return <Book />;
        else if (id === "author") return <Author />;
        else return null;
    });
    const [{ renderedPages, setPage }] = usePageAnimation({
        pagesIds: STAGES,
        pagesContents: content,
        containerClass: "mainPages",
        animationSpeed,
        animateFirst: false,
        initialPage: currentPage.current,
    });

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="MobileLayout">
            <div className="mainPagesContent">{renderedPages}</div>

            <Navbar setPage={setPage} currentPage={currentPage} />
        </div>
    );
}
