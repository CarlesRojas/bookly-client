import SVG from "react-inlinesvg";

import Logo from "../../resources/icons/logo.svg";
import LoadingIcon from "../../resources/icons/loading.svg";

export default function Loading() {
    return (
        <div className="Loading">
            <SVG className="icon" src={Logo} />
            <p className="title">bookly</p>
            <SVG className="loading spin infinite" src={LoadingIcon} />
        </div>
    );
}
