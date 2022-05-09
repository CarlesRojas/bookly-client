import { useContext } from "react";

import { Events } from "../../contexts/Events";

export default function Settings() {
    const { sub, unsub, emit } = useContext(Events);

    // const [author, setAuthor] = useState(false);

    // const handleBackButtonClicked = useCallback(() => {
    //     emit("onShowBackButton", false);
    //     setAuthor(false);
    // }, [emit]);

    const showAuthor = () => {
        emit("onNewPage", "first");
    };
    // #################################################
    //   EVENTS
    // #################################################

    // useEffect(() => {
    //     sub("onBackButtonClicked", handleBackButtonClicked);

    //     return () => {
    //         unsub("onBackButtonClicked", handleBackButtonClicked);
    //     };
    // }, [handleBackButtonClicked, sub, unsub]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="Settings" onClick={showAuthor}>
            Settings
        </div>
    );
}
