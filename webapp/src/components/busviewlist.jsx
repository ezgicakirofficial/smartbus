import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TablePaginationActions from './pagenavigation';
import {withRouter} from 'react-router-dom';
import compose from 'recompose/compose';
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import ExitToApp from "@material-ui/icons/ExitToApp";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});
const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);
const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const TitleTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.blue,
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 20,
    fontWeight:'bold'
  },
}))(TableCell);

const styles = theme => ({
  root: {
    marginLeft: 80,
    marginRight: 80,
    marginTop: theme.spacing.unit * 3,
    float: 'center' 
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  logoutbutton:{
    float: 'right' 
  }
});

class BusViewComponent extends Component {
  
  constructor(props){
    super(props);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.getListActivities = this.getListActivities.bind(this);
    this.clickExit = this.clickExit.bind(this);
    this.clickBusses = this.clickBusses.bind(this);
    this.getListActivities();
  }
  state = {
    value:-1,
    plateno:this.props.location.state.plate_no,
    username:this.props.location.state.username,
    rows: [],
    page: 0,
    rowsPerPage: 5,
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  clickExit = () =>{
    this.props.history.push("/", {
    });
  }
  clickBusses = () =>{
    this.props.history.push("/companyview", {
        username: this.state.username
    });}

    //got ın or got out not returned!!!!
  getListActivities() {
    return fetch("http://34.65.33.103:80/bus", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        plate_number: this.props.location.state.plate_no
        
      })})
      .then((response) => response.json())
      .then((responseData) => {
      if( Object.keys(responseData).length> 0 ){
        for (var i =0; i < Object.keys(responseData).length; i++){
          if(responseData[i][4] == 1){
            responseData[i][4] = "In"
          }
          else if (responseData[i][4] == 0){
            responseData[i][4] = "Out"
  
          }
        }
        this.setState({rows: responseData.sort((a, b) => (a[3] < b[3] ? -1 : 1))});
      }
      else{
        alert( "No Activity Exists")
      }
      return responseData;
    })
    .catch(error => console.warn(error));
   
  };

  render() {
    const { classes } = this.props;
    const { value, plateno,company_id, rows, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    

    return (
      <div>
         <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction onClick={this.clickBusses} label="List of Buses" icon={<RestoreIcon />} />
        <BottomNavigationAction onClick={this.clickExit} label="Exit" icon={< ExitToApp/>} />
      </BottomNavigation>
      
      <Paper className={classes.root}>
      
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
          <TableHead>
          <TableRow>
            <CustomTableCell>Child Name</CustomTableCell>
            <CustomTableCell >Situation</CustomTableCell>
         
          </TableRow>
      
        </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                return (
                  <TableRow key={row[0]}  >
                    <TableCell component="th" scope="row">
                      {row[3]}
                    </TableCell>
                    <TableCell >{row[4]}</TableCell> 
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter >
              <TableRow>
                <TablePagination
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActionsWrapped}
                /> 
              </TableRow>
              Bus Plate Number : {plateno}
            </TableFooter>
          </Table>
        </div>
        
      </Paper>
      </div>
    );
  }
}

BusViewComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withStyles(styles)
)(BusViewComponent);
//export default withStyles(styles)(ParentViewComponent);