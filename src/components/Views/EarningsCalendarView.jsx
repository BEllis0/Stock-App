import React from 'react';
import DatePicker from '../Forms/DatePicker/DatePicker.jsx';
import { Button } from '@material-ui/core';
import EarningsCalendarList from '../Lists/EarningsCalendarList.jsx';

const EarningsCalendarView = props => {
    
    let {
        submitDates,
        setDate,
        earningsCalendarItems
    } = props;

    return (
        <div className="ipoCalendarView">
            <h1>Earnings Calendar</h1>
            <p>Search for historical and future earnings call dates.</p>
            <div className="flex">
                <DatePicker
                    calendarType={"earnings calendar"}
                    setDate={setDate} 
                    label={"From"}
                />
                <DatePicker
                    calendarType={"earnings calendar"}
                    setDate={setDate} 
                    label={"To"}
                    className="margin-right"
                />
                <Button
                    onClick={() => submitDates('earnings calendar')}
                    type="submit"
                    label="Search"
                    id="ipo-search-btn"
                    color="primary"
                    size="large"
                >Search</Button>
            </div>

            {earningsCalendarItems !== undefined &&
                <EarningsCalendarList
                    earningsCalendarData={earningsCalendarItems}
                />
            }
        </div>
    )
};

export default EarningsCalendarView;