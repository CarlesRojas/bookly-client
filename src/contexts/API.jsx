import { createContext, useContext } from "react";

// Contexts
import { Utils } from "./Utils";
import { Data } from "./Data";
import { Events } from "./Events";

const API_VERSION = "api_v1";
const API_URL = "https://bookly-server.herokuapp.com/"; // "http://localhost:3100/"
const OPEN_LIB_API_URL = "https://openlibrary.org";
const IMAGE_SIZE = "L"; // "M" "L"

export const API = createContext();
const APIProvider = (props) => {
    const { getInfo, setInfo, clearInfo } = useContext(Utils);
    const {
        APP_NAME,
        token,
        user,
        books,
        authors,
        changeUserBookStatus,
        changeUserBookScore,
        changeUserBookFinishDate,
        filterDuplicateAuthors,
        filterDuplicateBooks,
    } = useContext(Data);
    const { emit } = useContext(Events);

    // #################################################
    //   USER API
    // #################################################

    const register = async (email, password) => {
        const postData = { email: email.toLowerCase(), password };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/register`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            // Save new user
            if ("error" in response) return response;
            return response;
        } catch (error) {
            console.log(error);
            return { error: `Unknown registration error` };
        }
    };

    const login = async (email, password) => {
        const postData = { email: email.toLowerCase(), password };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/login`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            // Return with error if it is the case
            if ("error" in response) return response;

            // Save token
            if ("token" in response) {
                token.current = response.token;
                setInfo(`${APP_NAME}_token`, token.current);

                // Save user info
                await getUserInfo();
            }

            return response;
        } catch (error) {
            console.log(error);
            return { error: "Unknown login error" };
        }
    };

    const testToken = async (token) => {
        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/testToken`, {
                method: "get",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token,
                },
            });

            const response = await rawResponse.json();

            // Return with error if it is the case
            if ("error" in response) return response;

            return response;
        } catch (error) {
            console.log(error);
            return { error: `Test token error: ${error}` };
        }
    };

    const getUserInfo = async () => {
        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/getUserInfo`, {
                method: "get",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: token.current,
                },
            });

            const response = await rawResponse.json();

            // Save new user
            if ("error" in response) {
                logout();
                return response;
            }
            user.current = response;

            return response;
        } catch (error) {
            logout();
            console.log(error);
            return { error: `Get user info error: ${error}` };
        }
    };

    const isLoggedIn = async () => {
        const tokenInCookie = getInfo(`${APP_NAME}_token`);
        if (!tokenInCookie) return false;

        const response = await testToken(tokenInCookie);
        if ("error" in response) return false;

        // Set token
        token.current = tokenInCookie;
        setInfo(`${APP_NAME}_token`, token.current);

        // Save user info
        const userInfoResponse = await getUserInfo();
        if ("error" in userInfoResponse) return false;

        return true;
    };

    const logout = () => {
        token.current = null;
        user.current = null;

        clearInfo(APP_NAME);
        emit("onLogout");
    };

    const tryToLogInWithToken = async () => {
        const tokenInCookie = getInfo(`${APP_NAME}_token`);

        // If token in cookie
        if (tokenInCookie) {
            token.current = tokenInCookie;

            const result = await getUserInfo();
            if ("error" in result) {
                logout();
                return false;
            }

            return true;
        }
        return false;
    };

    const changeEmail = async (password, newEmail) => {
        const postData = { password, email: newEmail.toLowerCase() };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/changeEmail`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: token.current,
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            // Save new user
            if ("error" in response) return response;
            user.current = response;

            return response;
        } catch (error) {
            console.log(error);
            return { error: `Change email error: ${error}` };
        }
    };

    const changePassword = async (password, newPassword) => {
        const postData = { password, newPassword };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/changePassword`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: token.current,
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            // Save new user
            if ("error" in response) return response;
            user.current = response;

            return response;
        } catch (error) {
            console.log(error);
            return { error: `Change password error: ${error}` };
        }
    };

    const deleteAccount = async (password) => {
        const postData = { password };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/deleteAccount`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: token.current,
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            // Logout
            if ("success" in response) logout();

            return response;
        } catch (error) {
            console.log(error);
            return { error: `Delete account error: ${error}` };
        }
    };

    // #################################################
    //   BOOK API
    // #################################################

    const changeBookStatus = async (bookId, oldStatus, status) => {
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();

        const postData = { bookId, status, month, year };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/book/changeStatus`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: token.current,
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();
            if ("error" in response) return false;
            else changeUserBookStatus(bookId, oldStatus, status, response);

            return response;
        } catch (error) {
            console.log(error);
            return { error: "Unknown error" };
        }
    };

    const changeBookScore = async (bookId, score) => {
        const postData = { bookId, score };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/book/changeScore`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: token.current,
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            if ("error" in response) return false;
            else changeUserBookScore(bookId, response);

            return response;
        } catch (error) {
            console.log(error);
            return { error: "Unknown error" };
        }
    };

    const changeBookFinishDate = async (bookId, month, year) => {
        const postData = { bookId, month, year };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/book/changeFinishDate`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: token.current,
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            if ("error" in response) return false;
            else changeUserBookFinishDate(bookId, response);

            return response;
        } catch (error) {
            console.log(error);
            return { error: "Unknown error" };
        }
    };

    const getAllUserBooks = async () => {
        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/book/getAll`, {
                method: "get",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: token.current,
                },
            });

            const response = await rawResponse.json();

            await Promise.all(response.books.map(async ({ bookId }) => await searchBooks(bookId, true)));

            return response;
        } catch (error) {
            console.log(error);
            return { error: "Unknown error" };
        }
    };

    // #################################################
    //   OPEN LIBRARY API
    // #################################################

    const getBookInfo = async (bookId, extraInfo = {}) => {
        try {
            if (bookId in books.current) return books.current[bookId];

            const rawResponse = await fetch(`${OPEN_LIB_API_URL}/works/${bookId}.json`);

            const response = await rawResponse.json();
            const { description, links, title, authors: bookAuthors, covers } = response;

            // Parse response
            let parsedResponse = {
                bookId,
                description,
                links,
                title,
                authors: bookAuthors.map(({ author }) => author.key.replace("/authors/", "")),
                covers:
                    covers && covers.length
                        ? covers
                              .filter((coverKey) => coverKey !== -1)
                              .map((coverKey) => `https://covers.openlibrary.org/b/id/${coverKey}-${IMAGE_SIZE}.jpg`)
                        : null,
            };

            if (parsedResponse.covers && parsedResponse.covers.length <= 0) parsedResponse.covers = null;

            // Add extra info
            parsedResponse = { ...parsedResponse, ...extraInfo };

            // Update book
            books.current[bookId] = parsedResponse;
            setInfo(`${APP_NAME}_books`, { ...books.current });

            // Get authors info
            await Promise.all(parsedResponse.authors.map(async (authorId) => await getAuthorInfo(authorId)));

            return parsedResponse;
        } catch (error) {
            console.log(error);
            return { error: `Get book info error: ${error}` };
        }
    };

    const getAuthorInfo = async (authorId) => {
        try {
            if (authorId in authors.current) return authors.current[authorId];

            const rawResponse = await fetch(`${OPEN_LIB_API_URL}/authors/${authorId}.json`);

            const response = await rawResponse.json();
            const { links, name, birth_date, bio, photos } = response;

            // Parse response
            const parsedResponse = {
                links,
                authorId,
                name,
                birth_date,
                bio,
                works: null,
                photos:
                    photos && photos.length
                        ? photos
                              .filter((photoKey) => photoKey !== -1)
                              .map((photoKey) => `https://covers.openlibrary.org/b/id/${photoKey}-${IMAGE_SIZE}.jpg`)
                        : null,
            };

            if (parsedResponse.photos && parsedResponse.photos.length <= 0) parsedResponse.photos = null;

            // Update author
            authors.current[authorId] = parsedResponse;
            setInfo(`${APP_NAME}_authors`, { ...authors.current });

            return parsedResponse;
        } catch (error) {
            console.log(error);
            return { error: `Get author info error: ${error}` };
        }
    };

    const getAuthorWorks = async (authorId) => {
        if (authorId in authors.current && "works" in authors.current[authorId] && authors.current[authorId].works)
            return authors.current[authorId].works;

        try {
            const rawResponse = await fetch(`${OPEN_LIB_API_URL}/search.json?author=${authorId}&language=eng`);

            const response = await rawResponse.json();

            let parsedResponse = response.docs
                .filter(({ type }) => type === "work")
                .map(({ key }) => key.replace("/works/", ""));

            parsedResponse = parsedResponse.slice(0, 30);

            await Promise.all(parsedResponse.map(async (bookId) => await searchBooks(bookId, true)));

            // Sort by cover
            parsedResponse.sort((first, second) => {
                if (!(first in books.current) || books.current[first] === null) return 1;
                if (!(second in books.current) || books.current[second] === null) return -1;

                const result =
                    (!books.current[first].covers && !books.current[second].covers) ||
                    (books.current[first].covers && books.current[second].covers)
                        ? 0
                        : books.current[first].covers && !books.current[second].covers
                        ? -1
                        : 1;

                return result;
            });

            // Update author
            authors.current[authorId].works = parsedResponse;
            setInfo(`${APP_NAME}_authors`, { ...authors.current });

            return parsedResponse;
        } catch (error) {
            console.log(error);
            return { error: `Get author info error: ${error}` };
        }
    };

    const searchBooks = async (bookQuery, single = false) => {
        if (!bookQuery.length) return { parsedWorks: [], parsedAuthors: [] };

        if (single && bookQuery in books.current) return;

        try {
            const rawResponse = await fetch(
                `${OPEN_LIB_API_URL}/search.json?language=eng&limit=30&q=${bookQuery
                    .toLowerCase()
                    .replaceAll(" ", "+")}`
            );

            const response = await rawResponse.json();

            // Parse ids
            let parsedWorks = response.docs
                .filter(({ type }) => type === "work")
                .map(({ key }) => key.replace("/works/", ""));

            let parsedAuthors = response.docs
                .filter(({ type }) => type === "work")
                .map(({ author_key }) => author_key || [])
                .flat();
            parsedAuthors = [...new Set(parsedAuthors)];

            // Get aditional info
            const extraWorksInfo = {};
            for (const result of response.docs) {
                const { key, publish_date, id_amazon, id_goodreads, id_librarything, number_of_pages_median } = result;

                const bookKey = key.replace("/works/", "");

                if (parsedWorks.includes(bookKey))
                    extraWorksInfo[bookKey] = {
                        publishDate: publish_date && publish_date.length > 0 ? publish_date[0] : null,
                        amazonId: id_amazon && id_amazon.length > 0 ? id_amazon[0] : null,
                        goodreadsId: id_goodreads && id_goodreads.length > 0 ? id_goodreads[0] : null,
                        libraryThingId: id_librarything && id_librarything.length > 0 ? id_librarything[0] : null,
                        numPages: number_of_pages_median || null,
                    };
            }

            await Promise.all(parsedWorks.map(async (bookId) => await getBookInfo(bookId, extraWorksInfo[bookId])));

            // Remove books without cover
            // parsedWorks = parsedWorks.filter((id) => !!books.current[id].covers);
            // parsedAuthors = parsedAuthors.filter((id) => !!authors.current[id].photos);

            // Remove duplicates
            parsedWorks = filterDuplicateBooks(parsedWorks);
            parsedAuthors = filterDuplicateAuthors(parsedAuthors);

            // Sort by cover
            parsedWorks.sort((first, second) => {
                if (!(first in books.current) || books.current[first] === null) return 1;
                if (!(second in books.current) || books.current[second] === null) return -1;

                const result =
                    (!books.current[first].covers && !books.current[second].covers) ||
                    (books.current[first].covers && books.current[second].covers)
                        ? 0
                        : books.current[first].covers && !books.current[second].covers
                        ? -1
                        : 1;

                return result;
            });

            // Sort by photo
            parsedAuthors.sort((first, second) => {
                if (!(first in authors.current) || authors.current[first] === null) return 1;
                if (!(second in authors.current) || authors.current[second] === null) return -1;

                const result =
                    (!authors.current[first].photos && !authors.current[second].photos) ||
                    (authors.current[first].photos && authors.current[second].photos)
                        ? 0
                        : authors.current[first].photos && !authors.current[second].photos
                        ? -1
                        : 1;

                return result;
            });

            return { parsedWorks, parsedAuthors };
        } catch (error) {
            console.log(error);
            return { error: `Get author info error: ${error}` };
        }
    };

    return (
        <API.Provider
            value={{
                // USER API
                register,
                login,
                isLoggedIn,
                logout,
                tryToLogInWithToken,
                changeEmail,
                changePassword,
                deleteAccount,

                // BOOK API
                changeBookStatus,
                changeBookScore,
                changeBookFinishDate,
                getAllUserBooks,

                // OPEN LIBRARY API
                getBookInfo,
                getAuthorInfo,
                getAuthorWorks,
                searchBooks,
            }}
        >
            {props.children}
        </API.Provider>
    );
};

export default APIProvider;
