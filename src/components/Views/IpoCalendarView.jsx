import React from 'react';
import DatePicker from '../Forms/DatePicker/DatePicker.jsx';
import { Button } from '@material-ui/core';
import IpoCalendarList from '../Lists/IpoCalendarList.jsx';

const IpoCalendarView = props => {
    
    let {
        submitDates,
        setDate,
        ipoCalendarItems
    } = props;

    return (
        <div className="ipoCalendarView">
            <h1>IPO Calendar</h1>
            <p>Search for historical and future IPO dates.</p>
            <div className="flex">
                <DatePicker 
                    calendarType={"ipo calendar"}
                    setDate={setDate} 
                    label={"From"}
                />
                <DatePicker
                    calendarType={"ipo calendar"}
                    setDate={setDate}
                    label={"To"}
                    className="margin-right"
                />
                <Button
                    onClick={() => submitDates('ipo calendar')}
                    type="submit"
                    label="Search"
                    id="ipo-search-btn"
                    color="primary"
                    size="large"
                >Search</Button>
            </div>

            {ipoCalendarItems !== undefined &&
                <IpoCalendarList
                    ipoCalendarData={ipoCalendarItems}
                />
            }
        </div>
    )
};

export default IpoCalendarView;