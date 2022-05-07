import { useContext } from "react";

import { Events } from "../../contexts/Events";

export default function Settings() {
    const { emit } = useContext(Events);
    return (
        <div className="Settings" onClick={() => emit("onSetPage", 4)}>
            Settings
        </div>
    );
}
