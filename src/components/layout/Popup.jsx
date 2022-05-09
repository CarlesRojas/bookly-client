import { useContext, useEffect, useCallback, useState } from "react";
import cn from "classnames";
import { useTransition, animated } from "react-spring";

import { Events } from "../../contexts/Events";
import Author from "../pages/Author";
import Book from "../pages/Book";

export default function Popup() {
    const { sub, unsub, emit } = useContext(Events);

    const [pages, setPages] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(-1);

    // #################################################
    //   TRANSITIONS
    // #################################################

    const transitions = useTransition(pages, {
        from: { transform: "translateY(-100%)" },
        enter: { transform: "translateY(0%)" },
        leave: { transform: "translateY(-100%)" },
        delay: 200,
    });

    // #################################################
    //   HANDLERS
    // #################################################

    const handleNewPage = useCallback(
        ({ pageId, type }) => {
            emit("onShowBackButton", true);

            setPages((prev) => [...prev, { pageId, type }]);
            setCurrentPageIndex((prev) => ++prev);
        },
        [emit]
    );

    const handleBackButtonClicked = useCallback(() => {
        setPages((prev) => {
            const copy = [...prev];
            copy.pop();
            return copy;
        });
        setCurrentPageIndex((prev) => --prev);
    }, []);

    useEffect(() => {
        if (currentPageIndex === -1) emit("onShowBackButton", false);
    }, [currentPageIndex, emit]);

    // #################################################
    //   EVENTS
    // #################################################

    useEffect(() => {
        sub("onNewPage", handleNewPage);
        sub("onBackButtonClicked", handleBackButtonClicked);

        return () => {
            unsub("onNewPage", handleNewPage);
            unsub("onBackButtonClicked", handleBackButtonClicked);
        };
    }, [handleNewPage, handleBackButtonClicked, sub, unsub]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className={cn("Popup", { opaque: pages.length })}>
            {transitions(({ transform }, { pageId, type }, _, i) => {
                return (
                    <animated.div
                        className={cn("page", { visible: i === currentPageIndex })}
                        style={{ transform, zIndex: 100 + i }}
                        key={`${pageId}_${i}`}
                    >
                        {type === "author" ? <Author id={pageId} /> : <Book id={pageId} />}
                    </animated.div>
                );
            })}
        </div>
    );
}
