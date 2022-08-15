import cn from 'classnames';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import SVG from 'react-inlinesvg';
import useClickOutsideRef from '../hooks/useClickOutsideRef';

import { API } from '../contexts/API';

import CloseIcon from '../resources/icons/close.svg';
import NextIcon from '../resources/icons/next.svg';
import PrevIcon from '../resources/icons/prev.svg';

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function FinishedOn({
    bookId,
    monthFinished,
    yearFinished,
    type,
    index,
    onUpdateReread,
    onDeleteReread,
    lowerYear,
    lowerMonth
}) {
    const { changeBookFinishDate } = useContext(API);

    const today = new Date();
    const currYear = today.getFullYear();
    const currMonth = today.getMonth();

    // #################################################
    //   SELECTOR
    // #################################################

    const [month, setMonth] = useState(monthFinished);
    const [year, setYear] = useState(yearFinished);

    // #################################################
    //   EXPAND
    // #################################################

    const [expanded, setExpanded] = useState(false);

    const handleButtonClicked = () => {
        setExpanded((prev) => !prev);
    };

    const handleSaveButtonClicked = () => {
        if (!expanded) return;

        setExpanded(false);

        if (type === 'finish') changeBookFinishDate(bookId, month, year);
        else onUpdateReread(index, month, year);
    };

    // #################################################
    //   CLICK OUTSIDE
    // #################################################

    const handleClickOutside = useCallback(() => {
        setExpanded(false);
    }, []);

    const statusRef = useRef();
    useClickOutsideRef(statusRef, handleClickOutside);

    // #################################################
    //   UPDATE SELECTOR IF PROPS CHANGE
    // #################################################

    useEffect(() => {
        setMonth(monthFinished);
        setYear(yearFinished);
    }, [monthFinished, yearFinished]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className={cn('FinishedOn', 'neoPopup', { expanded })} ref={statusRef}>
            <div className="main">
                <div className="mainContainer" onClick={handleButtonClicked}>
                    <p className="label">{type === 'finish' ? 'finished on' : 'read again on'}</p>

                    <p className="date">{`${
                        monthFinished >= 0 && monthFinished <= 11 ? MONTHS[monthFinished] : ''
                    } ${yearFinished}`}</p>
                </div>

                {type === 'reread' && (
                    <SVG className="removeIcon" src={CloseIcon} onClick={() => onDeleteReread(index)} />
                )}
            </div>

            <div className={cn('selector', { visible: expanded })}>
                <div className="yearSelector">
                    <SVG
                        className={cn('icon', { disabled: year <= 1 || year <= lowerYear })}
                        src={PrevIcon}
                        onClick={() => setYear((prev) => --prev)}
                    />
                    <p className="year">{year}</p>
                    <SVG
                        className={cn('icon', { disabled: year >= currYear })}
                        src={NextIcon}
                        onClick={() => setYear((prev) => ++prev)}
                    />
                </div>

                <div className="monthSelector">
                    {MONTH_NAMES_SHORT.map((monthName, i) => (
                        <div
                            className={cn(
                                'month',
                                { selected: month === i },
                                {
                                    disabled:
                                        (year === currYear && i > currMonth) || (year === lowerYear && i < lowerMonth)
                                }
                            )}
                            onClick={() => setMonth(i)}
                            key={monthName}
                        >
                            {monthName}
                        </div>
                    ))}
                </div>

                <div className="saveButton" onClick={handleSaveButtonClicked}>
                    save
                </div>
            </div>
        </div>
    );
}
