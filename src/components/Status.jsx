import { useState, useCallback, useRef, useContext } from "react";
import cn from "classnames";
import useClickOutsideRef from "../hooks/useClickOutsideRef";

import { API } from "../contexts/API";

const STATUSES = {
    finished: "finished",
    wantToRead: "want to read",
    reading: "reading",
    addToLibrary: "add to library",
    remove: "remove from library",
};

export default function Status({ bookId, status }) {
    const { changeBookStatus } = useContext(API);

    const [expanded, setExpanded] = useState(false);

    const handleButtonClicked = () => {
        if (expanded) return;

        setExpanded(true);
    };

    const handleOptionClicked = (option) => {
        if (!expanded) return;

        changeBookStatus(bookId, status, option);
        setExpanded(false);
    };

    const handleClickOutside = useCallback(() => {
        setExpanded(false);
    }, []);

    const statusRef = useRef();
    useClickOutsideRef(statusRef, handleClickOutside);

    const optionsPerCurrentStatus = {
        finished: {
            wantToRead: "want to read",
            reading: "reading",
            remove: "remove from library",
        },
        wantToRead: {
            finished: "finished",
            reading: "reading",
            remove: "remove from library",
        },
        reading: {
            finished: "finished",
            wantToRead: "want to read",
            remove: "remove from library",
        },
        addToLibrary: {
            wantToRead: "want to read",
            reading: "reading",
            finished: "finished",
        },
    };

    return (
        <div className={cn("Status", "neoPopup", { expanded })} onClick={handleButtonClicked} ref={statusRef}>
            <p className="option" onClick={handleClickOutside}>
                {STATUSES[status]}
            </p>

            {Object.keys(optionsPerCurrentStatus[status]).map((elem) => (
                <p
                    className={cn("newOption", { visible: expanded })}
                    onClick={() => handleOptionClicked(elem)}
                    key={elem}
                >
                    {optionsPerCurrentStatus[status][elem]}
                </p>
            ))}
        </div>
    );
}
