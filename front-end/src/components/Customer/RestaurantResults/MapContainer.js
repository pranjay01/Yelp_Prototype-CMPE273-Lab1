import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import googleApiKey from './mapKey';
export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={11}
        // bounds={bounds}
        initialCenter={{
          lat: 37.32325,
          lng: -121.89069,
        }}
      >
        {this.props.markers.map((marker) => (
          <Marker title={marker.title} name={marker.name} position={marker.position} />
        ))}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: googleApiKey,
})(MapContainer);
