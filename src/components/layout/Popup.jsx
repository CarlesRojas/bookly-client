import { useContext, useEffect, useCallback, useState } from "react";
import cs from "classnames";

import { Events } from "../../contexts/Events";

export default function Popup() {
    const { sub, unsub, emit } = useContext(Events);

    const [pages, setPages] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(-1);

    // #################################################
    //   HANDLERS
    // #################################################

    const handleNewPage = useCallback(
        (pageId) => {
            emit("onShowBackButton", true);

            setPages((prev) => [...prev, pageId]);
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
        <div className="Popup">
            {pages.map((id, i) => (
                <div
                    className={cs("page", { visible: i === currentPageIndex }, { old: i !== pages.length - 1 })}
                    style={{ backgroundColor: `rgb(${50 * i}, ${50 * i},255)`, zIndex: 100 + i }}
                    key={`${id}_${i}`}
                >
                    <p onClick={() => emit("onNewPage", `idForNewPage_${i}`)}>{id}</p>
                </div>
            ))}
        </div>
    );
}
