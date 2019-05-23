import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import ExitToApp from "@material-ui/icons/ExitToApp";
import {withRouter} from 'react-router-dom';
import compose from 'recompose/compose';

const styles = {
  root: {
    width: '100%'
  }
};

class UpNavigation extends Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  clickExit = () =>{
    this.props.history.push("/", {
        state: this.state,
        username: this.state.username
    });
  }
  clickAcitivities = () =>{
    this.props.history.push("/parentview", {
        state: this.state,
        username: this.state.username
    });
  }


  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction onClick={this.clickActivities} label="Recents Acitivities" icon={<RestoreIcon />} />
        <BottomNavigationAction onClick={this.clickExit} label="Exit" icon={< ExitToApp/>} />
      </BottomNavigation>
    );
  }
}

UpNavigation.propTypes = {
  classes: PropTypes.object.isRequired
};
//export default withStyles(styles)(UpNavigation);
export default compose(
    withRouter,
    withStyles(styles)
  )(UpNavigation);
