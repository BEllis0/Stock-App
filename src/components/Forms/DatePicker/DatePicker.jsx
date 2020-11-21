import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

const DatePicker = props => {

    let {
        label,
        setDate,
        calendarType
    } = props;

    const [selectedDate, setSelectedDate] = React.useState(new Date(moment()));

    const handleDateChange = (date) => {
        console.log('date seelected', date)
        setSelectedDate(date);
        
        // send data back
        setDate({
            calendarType: calendarType,
            action: label,
            date: date
        });
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label={label}
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </Grid>
        </MuiPickersUtilsProvider>
    );
};

export default DatePicker;