import React, { Component } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import classNames from "classnames";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {withRouter} from 'react-router-dom';
import compose from 'recompose/compose';
import logo from './photo.jpeg';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing.unit
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  },
  textField: {
    flexBasis: 200
  }
});
class LoginComponent extends Component {
  constructor(props){
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.handleRegisterClick = this.handleRegisterClick.bind(this);

  }
  state = { username: "", password: "" };
  handleChange = prop => event => {
    this.setState({ password: event.target.value });
  };

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleRegisterClick = () => {
    this.props.history.push("/register", {});
  };
  handleLoginClick =()=>{
    return fetch('http://34.65.33.103:80/login', {
      method: 'POST',
      
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    }).then((response) => response.json())
    .then((responseData) => {
    if( responseData[0][2] == "parent"){
      console.log(this.state)
      this.props.history.push("/parentview", {
        username: this.state.username
      });
    }
    else if (responseData[0][2] == "company"){
      this.props.history.push("/companyview", {
        username: this.state.username
      });
    }
    console.log(responseData);
    return responseData;
      }).catch(error => {
        alert("INCORRECT PASSWORD OR USERNAME!");
        console.warn(error);
      });

  }
 
  
  render() {
    const { classes } = this.props;
   
    return (
      <div className={classes.container} align="center">
        <img src={logo} width="420" height="250"/>
        <div className="row">
          <TextField
            id="with-placeholder"
            label="Username"
            placeholder="Username"
            className={classes.textField}
            margin="normal"
            onChange={this.handleUsernameChange}
          />
        </div>
        <div className="row">
          <FormControl
            className={classNames(classes.margin, classes.textField)}
          >
            <InputLabel htmlFor="adornment-password">Password</InputLabel>
            <Input
              id="adornment-password"
              type={this.state.showPassword ? "text" : "password"}
              value={this.state.password}
              onChange={this.handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <Button
          onClick={this.handleLoginClick}
          variant="contained"
          color="secondary"
          className={classes.button}
        >
          SIGN IN
        </Button>
        <Button
          onClick={this.handleRegisterClick}
          variant="contained"
          color="secondary"
          className={classes.button}
        >
          REGISTER
        </Button>
      </div>
    );
  }
}

LoginComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

//export default withRouter(connect()(withStyles(styles)(LoginComponent)))
export default compose(
  withRouter,
  withStyles(styles)
)(LoginComponent);