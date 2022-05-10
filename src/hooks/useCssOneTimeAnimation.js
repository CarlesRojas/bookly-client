import { useEffect, useState, useRef } from "react";

export default function useCssOneTimeAnimation(duration, defaultValue = false) {
    const [animating, setAnimating] = useState(defaultValue);

    const timeoutRef = useRef();

    const trigger = () => {
        setAnimating(true);

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setAnimating(false), duration);
    };

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    return [animating, trigger];
}
