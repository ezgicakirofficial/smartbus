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
import Map from "@material-ui/icons/AddLocation";


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
  },
  focusableRow:{
    alignItems: 'center',
    boxSizing: 'border-box',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
  }
});

class CompanyBusListComponent extends Component {
  constructor(props){
    super(props);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleRowClicked = this.handleRowClicked.bind(this);
    this.getBusList = this.getBusList.bind(this);
    this.clickExit = this.clickExit.bind(this);
    this.clickMap = this.clickMap.bind(this);
    this.clickBusses = this.clickBusses.bind(this);

    this.getBusList();
  }
  state = {
    value :0,
    username :this.props.location.state.username,
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

  handleRowClicked =(row) =>{
    this.props.history.push("/busview", {
      plate_no: row[0],
      username: this.state.username
    });
  };
  clickMap = ()=>{
   
    this.props.history.push("/busmap", {
      marker: this.state.rows,
      username: this.state.username
    });
  }

  // TO DO bunun get req doğru değil    
  getBusList() {
    return fetch("http://34.65.33.103:80/company", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.props.location.state.username
      })})
      .then((response) =>  response.json())
      .then((responseData) => {
      if( Object.keys(responseData).length> 0 ){
        this.setState({rows: responseData.sort((a, b) => (a[0] < b[0] ? -1 : 1))});
      }
      else{
        alert( "No Bus Exists")
      }
      return responseData;
    })
    .catch(error => console.warn(error));
   
  };

  clickExit = () =>{
    this.props.history.push("/", {
    });
  }
  clickBusses = () =>{
    this.props.history.push("/companyview", {
      username: this.props.location.state.username
    });
  }

  render() {
    const { classes } = this.props;
    const { value , username, rows, rowsPerPage, page } = this.state;
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
        <BottomNavigationAction onClick={this.clickMap} label="Map" icon={< Map/>} />
        <BottomNavigationAction onClick={this.clickExit} label="Exit" icon={< ExitToApp/>} />
      </BottomNavigation>
      
      <Paper className={classes.root}>
      
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
          <TableHead>
          <TableRow>
            <CustomTableCell>Bus Plate Number</CustomTableCell>
            <CustomTableCell >Location</CustomTableCell>
            <CustomTableCell >Number of Children</CustomTableCell>
          </TableRow>
         
        </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                return (
                  <TableRow className={classes.focusableRow} key={row.id} onClick={() =>{this.handleRowClicked(row)}} >
                    <TableCell component="th" scope="row">{row[0]}</TableCell>
                    <TableCell >{row[1]}, {row[2]}</TableCell>
                    <TableCell >{row[3]}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
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
            </TableFooter>
          </Table>
        </div>
        
      </Paper>
      </div>
    );
  }
}

CompanyBusListComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withStyles(styles)
)(CompanyBusListComponent);
