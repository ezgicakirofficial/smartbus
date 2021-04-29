import React, { Component } from 'react';

let google = window.google;
const fetch = require("isomorphic-fetch");
const { compose, withProps, withHandlers } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL: "url",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `800px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
      console.log(`Current clicked markers length: ${clickedMarkers.length}`)
      console.log(clickedMarkers)
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={3}
    defaultCenter={{ lat: 25.0391667, lng: 121.525 }}
  >
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.map(marker => (
        <Marker
          position={{ lat: marker[0], lng: marker[1] }}
          label = {marker[3]}
          icon= { {url: marker[2]} }
        />
      ))}
    </MarkerClusterer>
  </GoogleMap>
);

class DemoApp extends React.PureComponent {
  componentWillMount() {
    this.setState({ markers: [] })
  }

  componentDidMount() {
    const url = [
      // Length issue
      `https://gist.githubusercontent.com`,
      `/farrrr/dfda7dd7fccfec5474d3`,
      `/raw/758852bbc1979f6c4522ab4e92d1c92cba8fb0dc/data.json`
    ].join("")

    fetch(url)
      .then(res => res.json())
      .then(data => {
        
        var markerslist = this.props.location.state.marker;
        for (var i =0; i < markerslist.length; i++){
            if(markerslist[i][2] == 0){
                markerslist[i][2] = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
            }
            else if (markerslist[i][2] == 1){
                markerslist[i][2] = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
            }
          }
        console.log(markerslist)
        this.setState({ markers: markerslist });
      });
  }

  render() {
    return (
      <MapWithAMarkerClusterer markers={this.state.markers} />
    )
  }
}
export default (DemoApp);
//<DemoApp />
