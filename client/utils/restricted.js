import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';

import { logout, isAuthenticated } from '../auth/authenticator';

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        marginBottom: "24px"
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        textAlign: 'center'
    },
});

export default function restricted(BaseComponent) {
    class Restricted extends Component {
                
        constructor () {
            super();
            this.state = {
            }
        }
        
        componentDidMount() {
            this.checkAuthentication(this.props);
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.location !== this.props.location) {
                this.checkAuthentication(nextProps);
            }
        }

        checkAuthentication(params) {
            const { history } = params;
            if (!isAuthenticated()) {
                history.replace({ pathname: '/login' });
            }
        }

        render () {
            const { classes } = this.props;
            return (
                <div className={classes.root}>
                    <AppBar position="absolute">
                        <Toolbar>
                            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                JifCast
                            </Typography>
                            <Button color="inherit" onClick={() => { logout(); this.props.history.push('/login'); } }>Logout</Button>
                        </Toolbar>
                    </AppBar>
                    
                    <BaseComponent {...this.props} />
                    
                </div>
            );
        }

    }
    
    

    return withRouter(withStyles(styles)(Restricted));
}
