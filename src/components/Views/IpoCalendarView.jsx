import React from 'react';
import DatePicker from '../Forms/DatePicker/DatePicker.jsx';
import { Button } from '@material-ui/core';
import IpoCalendarList from '../Lists/IpoCalendarList.jsx';

const IpoCalendarView = props => {
    
    let {
        submitIpoDates,
        setIpoDate,
        ipoCalendarItems
    } = props;

    return (
        <div className="ipoCalendarView">
            <h1>IPO Calendar</h1>
            <p>Search for historical and future IPO dates.</p>
            <div className="flex">
                <DatePicker 
                    setIpoDate={setIpoDate} 
                    label={"From"}
                />
                <DatePicker
                    setIpoDate={setIpoDate} 
                    label={"To"}
                    className="margin-right"
                />
                <Button
                    onClick={submitIpoDates}
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