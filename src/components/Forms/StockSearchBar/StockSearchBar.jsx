import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

const StockSearchBar = props => {
    
    let [searchTerm, setSearchTerm] = useState('');

    let {
        colorDisplay
    } = props;

    let style = {
        input: {
            color: colorDisplay === 'dark' ? 'white !important' : '',
            borderBottom: colorDisplay === 'dark' ? 'white !important' : ''
          },
          label: {
            color: colorDisplay === 'dark' ? 'white !important' : ''
          }
    }

    return (
        <form
            onSubmit={(e) => {e.preventDefault()}}
        >
            <TextField 
                id="standard-search" 
                label="Search.." 
                type="search"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
                type="submit"
                label="Search"
                id="ipo-search-btn"
                color="primary"
                size="large"
                onClick={() => {props.onStockSearch(searchTerm)}}
            >Search</Button>
        </form>
    )
};  

export default StockSearchBar;