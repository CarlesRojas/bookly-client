import { useContext, useEffect, useRef, useState } from 'react';
import SVG from 'react-inlinesvg';
import ShowMoreText from 'react-show-more-text';
import MarkdownView from 'react-showdown';
import useResize from '../../hooks/useResize';

import { API } from '../../contexts/API';
import { Data } from '../../contexts/Data';
import { Events } from '../../contexts/Events';

import AmazonIcon from '../../resources/icons/amazon.svg';
import GoodreadsIcon from '../../resources/icons/goodreads.svg';
import LibrarythingIcon from '../../resources/icons/librarything.svg';
import LinkIcon from '../../resources/icons/link.svg';
import Logo from '../../resources/icons/logo.svg';
import PlusIcon from '../../resources/icons/plus.svg';
import FinishedOn from '../FinishedOn';
import Score from '../Score';
import Status from '../Status';

export default function Book({ id }) {
    const { books, authors, getBookUserData } = useContext(Data);
    const { emit } = useContext(Events);
    const { setBookRereads } = useContext(API);

    // #################################################
    //   NEW PAGE FOR LINKS
    // #################################################

    useEffect(() => {
        document.querySelectorAll('div #description a').forEach((item) => (item.target = '_blank'));
    });

    // #################################################
    //   LINK CONTAINER
    // #################################################

    const linksContainerRef = useRef();
    const [linksContainerBox, setLinksContainerBox] = useState({ width: 0 });

    const handleResize = () => {
        const box = linksContainerRef.current ? linksContainerRef.current.getBoundingClientRect() : { width: 0 };

        setLinksContainerBox(box);
    };
    useResize(handleResize, true);

    // #################################################
    //   BOOK DATA
    // #################################################

    if (!(id in books.current)) return null;

    const {
        amazonId,
        authors: bookAuthors,
        covers,
        description,
        goodreadsId,
        libraryThingId,
        links,
        numPages,
        publishDate,
        title
    } = books.current[id];

    const authorInfo = bookAuthors.map((id) => (id in authors.current ? authors.current[id] : null));

    const { monthFinished, score, status, yearFinished, rereads } = getBookUserData(id);

    const correctStatus = status || 'addToLibrary';
    const correctDescription =
        typeof description === 'string'
            ? description
            : description && 'value' in description
            ? description.value
            : null;

    let bookLinks = [];
    if (amazonId)
        bookLinks.push({
            title: 'amazon',
            url: `https://www.amazon.com/exec/obidos/ASIN/${amazonId}`,
            icon: AmazonIcon
        });
    if (goodreadsId)
        bookLinks.push({
            title: 'goodreads',
            url: `https://www.goodreads.com/book/show/${goodreadsId}`,
            icon: GoodreadsIcon
        });
    if (libraryThingId)
        bookLinks.push({
            title: 'librarything',
            url: `https://www.librarything.com/work/${libraryThingId}`,
            icon: LibrarythingIcon
        });
    if (links)
        for (const linkInfo of links) bookLinks.push({ title: linkInfo.title, url: linkInfo.url, icon: LinkIcon });
    bookLinks = bookLinks.slice(0, 4);

    const userRereads = rereads || [];

    // #################################################
    //   HANDLERS
    // #################################################

    const handleAuthorClicked = (authorId) => {
        emit('onNewPage', { pageId: authorId, type: 'author' });
    };

    const onAddReread = () => {
        const today = new Date();
        const currYear = today.getFullYear();
        const currMonth = today.getMonth();

        let newRereads = [...userRereads, { month: currMonth, year: currYear }];
        newRereads = newRereads.map(({ month, year }) => ({ month, year }));
        setBookRereads(id, newRereads);
    };

    const onUpdateReread = (index, newMonth, newYear) => {
        const newRereads = userRereads.map(({ month, year }, i) => {
            return i === index ? { month: newMonth, year: newYear } : { month, year };
        });
        const sortedArray = sortRereads(newRereads);
        console.log(sortedArray);

        setBookRereads(id, sortedArray);
    };

    const onDeleteReread = (index) => {
        let newRereads = [...userRereads];
        newRereads.splice(index, 1);
        newRereads = newRereads.map(({ month, year }) => ({ month, year }));

        setBookRereads(id, newRereads);
    };

    const sortRereads = (rereadsToSort) => {
        const newArray = [...rereadsToSort];
        newArray.sort((a, b) => {
            if (a.year > b.year) return 1;
            else if (a.year < b.year) return -1;

            if (a.month > b.month) return 1;
            return -1;
        });

        return newArray;
    };

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="Book">
            <div className="mainContent neoDiv">
                {covers && covers.length ? (
                    <img src={covers[0]} alt="" className="cover neoDiv" />
                ) : (
                    <div className="noCover neoDiv">
                        <SVG className="icon" src={Logo} />
                    </div>
                )}

                {(publishDate || numPages) && (
                    <div className="details">
                        {publishDate && <span>{`published on ${publishDate}`}</span>}
                        {numPages && <span>{`${numPages} pages`}</span>}
                    </div>
                )}

                <p className="title">{title || 'untitled'}</p>

                {authorInfo.length ? (
                    <p className="author" onClick={() => handleAuthorClicked(authorInfo[0].authorId)}>
                        {authorInfo[0].name}
                    </p>
                ) : (
                    <p className="author">unknown author</p>
                )}

                {correctStatus && <Status bookId={id} status={correctStatus} />}

                {status === 'finished' && <Score score={score} bookId={id} />}

                {status === 'finished' && yearFinished && (
                    <FinishedOn
                        bookId={id}
                        monthFinished={monthFinished}
                        yearFinished={yearFinished}
                        type="finish"
                        lowerYear={1}
                        lowerMonth={-1}
                    />
                )}

                {status === 'finished' && (
                    <div className="rereads">
                        {userRereads.map(({ month, year }, i) => (
                            <FinishedOn
                                key={i}
                                bookId={id}
                                monthFinished={month}
                                yearFinished={year}
                                index={i}
                                onUpdateReread={onUpdateReread}
                                onDeleteReread={onDeleteReread}
                                type="reread"
                                lowerYear={yearFinished}
                                lowerMonth={monthFinished}
                            />
                        ))}

                        <div className="addReread" onClick={onAddReread}>
                            <SVG className="icon" src={PlusIcon} />
                            <p>add reread</p>
                        </div>
                    </div>
                )}

                {correctDescription && (
                    <MarkdownView
                        className="description"
                        id="description"
                        markdown={correctDescription}
                        options={{ omitExtraWLInCodeBlocks: true, tables: true, emoji: true }}
                    />
                )}

                <div className="links">
                    {bookLinks.map(({ title, url, icon }, i) => (
                        <div className="link neoDiv" onClick={() => window.open(url, '_blank')} key={i}>
                            <div className="linkInfoContainer" ref={linksContainerRef}>
                                <SVG className="linkIcon" src={icon} />
                                <ShowMoreText
                                    lines={1}
                                    className="linkName"
                                    anchorClass="anchor"
                                    expanded={false}
                                    width={linksContainerBox.width}
                                    truncatedEndingComponent={'...'}
                                >
                                    <p>{title}</p>
                                </ShowMoreText>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
