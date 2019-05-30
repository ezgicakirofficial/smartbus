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
import Geocode from 'react-geocode';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 10,
    marginRight:  500,
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
  pagination:{
    float:'right'
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

class ParentViewComponent extends Component {
  
  constructor(props) {
    super(props);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.getListActivities = this.getListActivities.bind(this);
    this.handleRowClicked = this.handleRowClicked.bind(this);
    Geocode.setApiKey('AIzaSyANO5B3CQp9ZpPtZjnZN-B-nKbttZFHmgE');

    this.getListActivities();
    //Geocode.setLanguage('en');
  }
  state = {
    username: this.props.location.state.username,
    markers:[],
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
  
  getListActivities() {
    return fetch('http://34.65.33.103:80/see_activities', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username
      })
    }).then((response) => response.json())
    .then((responseData) => {
      console.log(responseData);
      if( Object.keys(responseData).length > 0 ){
        for (var i =0; i < Object.keys(responseData).length; i++){
          
          if(responseData[i][5] == 1){
            responseData[i][5] = "Got In"
          }
          else if (responseData[i][5] == 0){
            responseData[i][5] = "Got Out"
        
          }
          responseData[i][2]= responseData[i][2].split(".")[0];
       
          let j = i;
          Geocode.fromLatLng( responseData[j][3], responseData[j][4]).then(
            response => {
              const address = response.results[0].formatted_address;
              responseData[j].push(address)
              this.setState({rows: responseData});
              
              return address;

            },
            error => {
              console.error(error);
            }
          );

        }

      }
      else{
        alert( "No Activity Exists")
      }
    
    return responseData;
      }).catch(error => {
        console.warn(error);
      });

  };

  handleRowClicked(row) {
    console.log(row)
    return fetch('http://34.65.33.103:80/bus/get_location', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plate_number: row[7]
      })
    }).then((response) => response.json())
    .then((responseData) => {

    
    console.log(loc)
    if(row[5] == "Got In"){
      var loc = [responseData[0][0],responseData[0][1],0, "BUS & CHILD"]
      this.setState({ markers:[loc] });
      
    }
    else{
      var loc = [responseData[0][0],responseData[0][1],0, "BUS "]

      var marker = [loc, [ row[3], row[4],1, "YOUR CHILD"]];
      
      this.setState({ markers:marker });
    }
    
    console.log(this.state.markers);
    
    this.props.history.push("/map", {
      marker: this.state.markers,
      username: this.state.username
    });
    return responseData;
      }).catch(error => {
        console.warn(error);
      });

  };

  render() {
    const { classes } = this.props;
    const { username, rows, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    
    return (
      
      <Paper className={classes.root}>
      
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
          <TableHead>
          <TableRow>
            <CustomTableCell>Child Name</CustomTableCell>
            <CustomTableCell >Location</CustomTableCell>
            <CustomTableCell >Activity</CustomTableCell>
            <CustomTableCell >Time</CustomTableCell>
          </TableRow>
        </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                return (
                  <TableRow className={classes.focusableRow} key={row[0]}  onClick={() =>{this.handleRowClicked(row)}}>
                    <TableCell component="th" scope="row">
                      {row[8]}
                    </TableCell>
                    <TableCell >{row[11]} </TableCell>
                    <TableCell >{row[5]}</TableCell>
                    <TableCell >{row[2]}</TableCell>
                   
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
            </TableFooter>
          </Table>
        </div>
        
      </Paper>
     
    );
  }
}

ParentViewComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withStyles(styles)
)(ParentViewComponent);
//export default withStyles(styles)(ParentViewComponent);