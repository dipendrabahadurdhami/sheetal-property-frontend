import React, { Component } from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker,
} from "react-google-maps";
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyAjQbpLmWtP5SBJQ6RWzplfIg0Sd0rpDYg");
Geocode.enableDebug();
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      city: "",
      area: "",
      state: "",
      mapPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
      },
    };
  }
  /**
   * Get the current address from the default map position and set those values in the state
   */
  componentDidMount() {
    Geocode.fromLatLng(
      this.state.mapPosition.lat,
      this.state.mapPosition.lng
    ).then(
      (response) => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

        this.setState({
          address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : "",
        });
        this.onLocationUpdate(
          this.state.mapPosition.lat,
          this.state.mapPosition.lng,
          address
        );
      },
      (error) => {
        console.error(error);
      }
    );
  }
  /**
   * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
   *
   * @param nextProps
   * @param nextState
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.markerPosition.lat !== this.props.center.lat ||
      this.state.address !== nextState.address ||
      this.state.city !== nextState.city ||
      this.state.area !== nextState.area ||
      this.state.state !== nextState.state
    ) {
      return true;
    } else if (this.props.center.lat === nextProps.center.lat) {
      return false;
    }
  }
  /**
   * Get the city and set the city input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getCity = (addressArray) => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  /**
   * Get the area and set the area input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getArea = (addressArray) => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };
  /**
   * Get the address and set the address input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getState = (addressArray) => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };
  /**
   * And function for city,state and address input
   * @param event
   */
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  /**
   * This Event triggers when the marker window is closed
   *
   * @param event
   */
  onInfoWindowClose = (event) => {};
  /**
   * When the user types an address in the search box
   * @param place
   */
  onPlaceSelected = (place) => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    // Set these values in the state.
    this.setState({
      address: address ? address : "",
      area: area ? area : "",
      city: city ? city : "",
      state: state ? state : "",
      markerPosition: {
        lat: latValue,
        lng: lngValue,
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue,
      },
    });

    this.onLocationUpdate(latValue, lngValue, address);
  };
  /**
   * When the marker is dragged you get the lat and long using the functions available from event object.
   * Use geocode to get the address, city, area and state from the lat and lng positions.
   * And then set those values in the state.
   *
   * @param event
   */
  onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng(),
      addressArray = [],
      address = "",
      city = "",
      state = "",
      area = "";

    Geocode.fromLatLng(newLat, newLng).then(
      (response) => {
        address = response.results[0].formatted_address;
        addressArray = response.results[0].address_components;
        city = this.getCity(addressArray);
        area = this.getArea(addressArray);
        state = this.getState(addressArray);
        this.setState({
          address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : "",
          mapPosition: {
            lat: newLat,
            lng: newLng,
          },
          markerPosition: {
            lat: newLat,
            lng: newLng,
          },
        });

        this.onLocationUpdate(newLat, newLng, address);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  onLocationUpdate = (lat, lng, address) => {
    this.props.mapLocation(lat, lng, address);
  };
  render() {
    const AsyncMap = withScriptjs(
      withGoogleMap((props) => (
        <div className="relative mb-6">
          <GoogleMap
            google={this.props.google}
            defaultZoom={this.props.zoom}
            defaultCenter={{
              lat: this.state.mapPosition.lat,
              lng: this.state.mapPosition.lng,
            }}
            onClick={this.onMarkerDragEnd}
          >
            {/* For Auto complete Search Box */}
            <Autocomplete
              apiKey="AIzaSyAjQbpLmWtP5SBJQ6RWzplfIg0Sd0rpDYg"
              style={{
                width: "100%",
                height: "45px",
                paddingLeft: "16px",
                marginTop: "2px",
                marginBottom: "0",
                borderBottomLeftRadius: "4px",
                borderBottomRightRadius: "4px",
                border: "1px solid #dedede",
              }}
              onPlaceSelected={this.onPlaceSelected}
              options={{
                types: [],
                componentRestrictions: { country: "np" },
              }}
            />
            {/*Marker*/}
            <Marker
              google={this.props.google}
              name={"Dolores park"}
              draggable={true}
              onDragEnd={this.onMarkerDragEnd}
              position={{
                lat: this.state.markerPosition.lat,
                lng: this.state.markerPosition.lng,
              }}
            />
            {/* <Marker /> */}
            {/* InfoWindow on top of marker */}
            <InfoWindow
              onClose={this.onInfoWindowClose}
              position={{
                lat: this.state.markerPosition.lat + 0.0018,
                lng: this.state.markerPosition.lng,
              }}
            >
              <div>
                <span style={{ padding: 0, margin: 0 }}>
                  {this.state.address}
                </span>
              </div>
            </InfoWindow>
          </GoogleMap>
        </div>
      ))
    );
    let map;
    if (this.props.center.lat !== undefined) {
      map = (
        <div className="mb-6">
          {/* <div>
            <div className="form-group">
              <label htmlFor="">City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.city}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Area</label>
              <input
                type="text"
                name="area"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.area}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">State</label>
              <input
                type="text"
                name="state"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.state}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.address}
              />
            </div>
          </div> */}
          <AsyncMap
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAjQbpLmWtP5SBJQ6RWzplfIg0Sd0rpDYg&libraries=geometry,drawing,places&sensor=true"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={
              <div
                style={{ minHeight: this.props.minHeight, height: "100%" }}
              />
            }
            mapElement={<div style={{ height: `300px` }} />}
          />
        </div>
      );
    } else {
      map = (
        <div style={{ minHeight: this.props.minHeight }} className="mb-6" />
      );
    }
    return map;
  }
}
export default Map;
