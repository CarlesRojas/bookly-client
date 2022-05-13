import { useState, useCallback, useRef, useContext } from "react";
import SVG from "react-inlinesvg";
import cn from "classnames";
import useClickOutsideRef from "../../hooks/useClickOutsideRef";

import { API } from "../../contexts/API";

import LoadingIcon from "../../resources/icons/loading.svg";

const TYPES = {
    changeEmail: "change email",
    changePassword: "change password",
    deleteAccount: "delete account",
};

export default function Settings() {
    const { changeEmail, changePassword, logout, deleteAccount } = useContext(API);

    // #################################################
    //   LOADING &/ ERROR
    // #################################################

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // #################################################
    //   EXPAND
    // #################################################

    const [emailExpanded, setEmailExpanded] = useState(false);
    const [passwordExpanded, setPasswordExpanded] = useState(false);
    const [deleteExpanded, setDeleteExpanded] = useState(false);

    const handleButtonClicked = (type) => {
        if (type === TYPES.changeEmail) {
            if (emailExpanded) return;
            setEmailExpanded(true);
        } else if (type === TYPES.changePassword) {
            if (passwordExpanded) return;
            setPasswordExpanded(true);
        } else if (type === TYPES.deleteAccount) {
            if (deleteExpanded) return;
            setDeleteExpanded(true);
        }
    };

    const handleOptionClicked = async (event, type) => {
        // Prevent page reload
        event.preventDefault();

        setLoading(true);

        if (type === TYPES.changeEmail) {
            let emailValue = document.getElementById("newEmailEmail").value;
            let passwordValue = document.getElementById("newEmailPassword").value;

            const response = await changeEmail(passwordValue, emailValue);
            if ("error" in response) setError(response.error);
            else setEmailExpanded(false);
        } else if (type === TYPES.changePassword) {
            let newPasswordValue = document.getElementById("newPasswordPassword").value;
            let passwordValue = document.getElementById("newPasswordOldPassword").value;

            const response = await changePassword(passwordValue, newPasswordValue);
            if ("error" in response) setError(response.error);
            else setPasswordExpanded(false);
        } else if (type === TYPES.deleteAccount) {
            let passwordValue = document.getElementById("deleteAccountPassword").value;

            const response = await deleteAccount(passwordValue);
            if ("error" in response) setError(response.error);
            else setDeleteExpanded(false);
        }

        setLoading(false);
    };

    // #################################################
    //   CLICK OUTSIDE
    // #################################################

    const handleClickOutside = useCallback((type) => {
        if (type === TYPES.changeEmail) setEmailExpanded(false);
        else if (type === TYPES.changePassword) setPasswordExpanded(false);
        else if (type === TYPES.deleteAccount) setDeleteExpanded(false);
    }, []);

    const emailRef = useRef();
    const passwordRef = useRef();
    const accountRef = useRef();
    useClickOutsideRef(emailRef, () => handleClickOutside(TYPES.changeEmail));
    useClickOutsideRef(passwordRef, () => handleClickOutside(TYPES.changePassword));
    useClickOutsideRef(accountRef, () => handleClickOutside(TYPES.deleteAccount));

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="Settings">
            <div
                className={cn("expandableSection", "neoPopup", { expanded: emailExpanded })}
                onClick={() => handleButtonClicked(TYPES.changeEmail)}
                ref={emailRef}
            >
                <p className="title" onClick={() => handleClickOutside(TYPES.changeEmail)}>
                    {TYPES.changeEmail}
                </p>

                <form
                    className={cn("form", { visible: emailExpanded })}
                    onSubmit={(event) => handleOptionClicked(event, TYPES.changeEmail)}
                >
                    <input
                        className="input neoInput"
                        type="text"
                        name="email"
                        placeholder={"new email"}
                        autocomlete={"new-password"}
                        id="newEmailEmail"
                        required
                    />
                    <input
                        className="input neoInput"
                        type="password"
                        name="password"
                        placeholder={"confirm with password"}
                        autocomlete={"current-password"}
                        id="newEmailPassword"
                        required
                    />
                    <button className="submit neoButton" type="submit">
                        {loading ? <SVG className="loadingIcon spin infinite" src={LoadingIcon} /> : TYPES.changeEmail}
                    </button>
                </form>
            </div>

            <div
                className={cn("expandableSection", "neoPopup", { expanded: passwordExpanded })}
                onClick={() => handleButtonClicked(TYPES.changePassword)}
                ref={passwordRef}
            >
                <p className="title" onClick={() => handleClickOutside(TYPES.changePassword)}>
                    {TYPES.changePassword}
                </p>

                <form
                    className={cn("form", { visible: passwordExpanded })}
                    onSubmit={(event) => handleOptionClicked(event, TYPES.changePassword)}
                >
                    <input
                        className="input neoInput"
                        type="password"
                        name="newPassword"
                        placeholder={"new password"}
                        autocomlete={"new-password"}
                        id="newPasswordPassword"
                        required
                    />
                    <input
                        className="input neoInput"
                        type="password"
                        name="password"
                        placeholder={"confirm with password"}
                        autocomlete={"current-password"}
                        id="newPasswordOldPassword"
                        required
                    />
                    <button className="submit neoButton" type="submit">
                        {loading ? (
                            <SVG className="loadingIcon spin infinite" src={LoadingIcon} />
                        ) : (
                            TYPES.changePassword
                        )}
                    </button>
                </form>
            </div>

            <div className="logoutDiv neoButton danger" onClick={logout}>
                log out
            </div>

            <div
                className={cn("expandableSection", "small", "neoPopup", { expanded: deleteExpanded })}
                onClick={() => handleButtonClicked(TYPES.deleteAccount)}
                ref={accountRef}
            >
                <p className="title danger" onClick={() => handleClickOutside(TYPES.deleteAccount)}>
                    {TYPES.deleteAccount}
                </p>

                <form
                    className={cn("form", "small", { visible: deleteExpanded })}
                    onSubmit={(event) => handleOptionClicked(event, TYPES.deleteAccount)}
                >
                    <input
                        className="input neoInput"
                        type="password"
                        name="password"
                        placeholder={"confirm with password"}
                        autocomlete={"current-password"}
                        id="deleteAccountPassword"
                        required
                    />
                    <button className="submit neoButton danger" type="submit">
                        {loading ? (
                            <SVG className="loadingIcon spin infinite" src={LoadingIcon} />
                        ) : (
                            TYPES.deleteAccount
                        )}
                    </button>
                </form>
            </div>

            <div className={cn("error", { visible: !!error })}>{error || "-"}</div>
        </div>
    );
}
