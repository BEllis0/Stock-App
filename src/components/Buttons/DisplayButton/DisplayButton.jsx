import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function DisplayButton() {
    const [state, setState] = React.useState({
      checkedA: true,
      checkedB: true,
    });
  
    const handleChange = (event) => {
      setState({ ...state, [event.target.name]: event.target.checked });
    };
  
    return (
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={state.checkedB}
              onChange={handleChange}
              name="checkedB"
              color="primary"
            />
          }
          labelPlacement="start"
          label="Color Mode"
        />
      </FormGroup>
    );
  }