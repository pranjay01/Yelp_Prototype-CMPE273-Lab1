import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import serverUrl from '../../../config';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: '',
      Country_ID: '',
      State_ID: '',
      City: '',
      Zip: '',
      Street: '',
      Phone_no: '',
      Country_Code: '',
      Opening_Time: '',
      Closing_Time: '',
      Countries: [],
      States: [],
      CountryCodes: [],
    };
  }

  componentDidMount() {
    axios.get(serverUrl + 'biz/restaurantCompleteProfile', { withCredentials: true }).then(
      (response) => {
        if (response.status === 200) {
          console.log('Name', response.data[0][0]);
          this.setState({});
          console.log(this.state);
          console.log(response.data);
        }
      },
      (error) => {
        console.log(error.response.data);
      }
    );

    axios.get(serverUrl + 'static/signupMasterData').then((response) => {
      console.log(response.data);
      let allCountries = response.data[0].map((country) => {
        return { key: country.ID, value: country.Name };
      });
      let allStates = response.data[1].map((state) => {
        return { key: state.ID, value: state.Name };
      });
      let allCountrieCodes = response.data[0].map((countryCode) => {
        return { key: countryCode.ID, value: countryCode.Country_Code };
      });
      this.setState({
        Countries: this.state.Countries.concat(allCountries),
        States: this.state.States.concat(allStates),
        CountryCodes: this.state.CountryCodes.concat(allCountrieCodes),
      });
    });
  }
  render(/**<fieldset disabled> */) {
    return (
      <div>
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formGridAddress1">
            <Form.Label>Address</Form.Label>
            <Form.Control placeholder="1234 Main St" />
          </Form.Group>

          <Form.Group controlId="formGridAddress2">
            <Form.Label>Address 2</Form.Label>
            <Form.Control placeholder="Apartment, studio, or floor" />
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>City</Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>State</Form.Label>
              <Form.Control as="select" defaultValue="Choose...">
                <option>Choose...</option>
                <option>...</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>Zip</Form.Label>
              <Form.Control />
            </Form.Group>
          </Form.Row>

          <Form.Group id="formGridCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default Profile;
