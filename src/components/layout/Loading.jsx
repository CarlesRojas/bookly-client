import cn from "classnames";
import SVG from "react-inlinesvg";
import useGlobalState from "../../hooks/useGlobalState";

import LoadingIcon from "../../resources/icons/book.svg";

export default function Loading() {
    const [visible] = useGlobalState("loadingVisible");

    return (
        <div className={cn("Loading", { visible })}>
            <SVG className={cn("icon", "pulse", "infinite")} src={LoadingIcon} />
        </div>
    );
}
