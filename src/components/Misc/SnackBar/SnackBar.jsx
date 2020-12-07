import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
    
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SnackBar(props) {

    let {
        displaySnackBar,
        snackBarMessage,
        loginError,
        removeSnackBar
    } = props;
    
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Snackbar open={displaySnackBar} autoHideDuration={5000} onClose={removeSnackBar}>
        <Alert onClose={removeSnackBar} severity={loginError ? 'error' : 'info'}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}