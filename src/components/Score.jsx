import { useRef, useEffect, useCallback, useContext, useState } from "react";
import SVG from "react-inlinesvg";
import cn from "classnames";
import useResize from "../hooks/useResize";

import { Utils } from "../contexts/Utils";
import { API } from "../contexts/API";

import StarIcon from "../resources/icons/star.svg";

export default function Score({ bookId, score }) {
    const { clamp } = useContext(Utils);
    const { changeBookScore } = useContext(API);

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

            if (type === "touchmove" && touches && touches.length) clientX = touches[0].clientX;
            else clientX = event.clientX;

            const x = Math.ceil(
                clamp(clientX - containerBox.current.left, 0, containerBox.current.width) /
                    containerBox.current.width /
                    0.2
            );

            setCurrScore(x);

            return x;
        },
        [clamp, setCurrScore]
    );

    const handleMouseDown = useCallback(
        (event) => {
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

        changeBookScore(bookId, currScore);
        scoring.current = false;
    }, [currScore, changeBookScore, bookId]);

    // #################################################
    //   EVENTS
    // #################################################

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.addEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    // #################################################
    //   RENDER
    // #################################################

    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(<SVG className={cn("star", { active: i < currScore })} src={StarIcon} key={i} />);
    }

    return (
        <div
            className="Score"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            ref={containerRef}
        >
            {stars}
        </div>
    );
}
