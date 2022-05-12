import { useRef, useEffect, useCallback, useContext, useState } from "react";
import SVG from "react-inlinesvg";
import cn from "classnames";
import useResize from "../hooks/useResize";

import { Utils } from "../contexts/Utils";
import { API } from "../contexts/API";
import { Events } from "../contexts/Events";

import StarIcon from "../resources/icons/star.svg";

export default function Score({ bookId, score, height }) {
    const { clamp } = useContext(Utils);
    const { changeBookScore } = useContext(API);
    const { sub, unsub, emit } = useContext(Events);

    const containerRef = useRef();
    const containerBox = useRef({});

    const handleResize = () => {
        const box = containerRef.current.getBoundingClientRect();
        containerBox.current = box;
    };
    useResize(handleResize, true);

    // #################################################
    //   DRAG TO CHOOSE SCORE
    // #################################################

    const scoring = useRef(false);
    const [currScore, setCurrScore] = useState(score);

    const calculateNewScore = useCallback(
        (event) => {
            const { type, touches } = event;
            let clientX = 0;

            if ((type === "touchmove" || type === "touchstart") && touches && touches.length)
                clientX = touches[0].clientX;
            else clientX = event.clientX;

            const x = Math.ceil(
                clamp(clientX - containerBox.current.left, 0, containerBox.current.width) /
                    containerBox.current.width /
                    0.2
            );

            if (Number.isNaN(x)) return;

            setCurrScore(x);
        },
        [clamp, setCurrScore]
    );

    const handleMouseDown = useCallback(
        (event) => {
            handleResize();

            scoring.current = true;
            calculateNewScore(event);
        },
        [calculateNewScore]
    );

    const handleMouseMove = useCallback(
        (event) => {
            if (!scoring.current) return;
            calculateNewScore(event);
        },
        [calculateNewScore]
    );

    const handleMouseUp = useCallback(() => {
        if (!scoring.current) return;
        if (Number.isNaN(currScore)) return;

        emit("onScoreChanged", { bookId, score: currScore });
        scoring.current = false;
        changeBookScore(bookId, currScore);
    }, [currScore, changeBookScore, bookId, emit]);

    const handleScoreChanged = useCallback(
        ({ bookId: id, score: newScore }) => {
            if (id === bookId && newScore !== currScore) setCurrScore(newScore);
        },
        [bookId, currScore]
    );

    // #################################################
    //   EVENTS
    // #################################################

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        sub("onScoreChanged", handleScoreChanged);

        return () => {
            window.addEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            unsub("onScoreChanged", handleScoreChanged);
        };
    }, [handleMouseMove, handleMouseUp, handleScoreChanged, sub, unsub]);

    // #################################################
    //   RENDER
    // #################################################

    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(<SVG className={cn("star", { active: i < currScore })} src={StarIcon} key={i} />);
    }

    const style = height ? { height: `${height}px` } : null;

    return (
        <div
            className="Score"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            ref={containerRef}
            style={style}
        >
            {stars}
        </div>
    );
}
