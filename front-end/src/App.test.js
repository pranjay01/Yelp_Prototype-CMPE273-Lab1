import React from 'react';

import { shallow, configure, mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
chai.use(sinonChai);

import MenuBlock from './components/Customer/CommonArea/MenuBlock';
import App from './App';
import OrdersList from './components/Customer/OrdersTab/OrdersList';
import EventForCustomer from './components/Customer/Events/EventForCustomer';
import Review from './components/Restaurant/Reviews/Review';

configure({ adapter: new Adapter() });

const mockStore = configureMockStore();
const store = mockStore({});

it('APP renders without crashing', () => {
  shallow(<App />);
});

it('MenuBlock renders without crashing', () => {
  shallow(
    <Provider store={store}>
      <MenuBlock />
    </Provider>
  );
});

it('Cout of ul components in Order List', () => {
  const ORDERS = {
    restroId: 1,
    ID: 1,
    Bill: 10,
    DeliverStatusValue: 4,
    OrderedTime: '',
    OrderType: 'DElivery',
  };
  const wrapper = shallow(<OrdersList ORDERS={ORDERS} />);
  expect(wrapper.find('ul')).to.have.lengthOf(3);
});

it('Event details geting passed and displayed at proper positions', () => {
  const event = {
    ID: 1,
    Name: 'Testing Event',
    Description: 'Testing Description',
    EventDate: new Date(),
    EventStartTime: '',
    EventEndTime: '',
    Address: 'Elan',
    hashtags: '#Testing',
  };
  const registeredEventIds = [1, 2];
  const wrapper = shallow(
    <EventForCustomer registeredEventIds={registeredEventIds} event={event} />
  );
  expect(wrapper.find('#Description').text()).to.be.equal(event.Description);
  expect(wrapper.find('#Address').text()).to.be.equal(event.Address);
  expect(wrapper.find('#Hashtags').text()).to.be.equal(event.hashtags);
});

it('Verifying if 2 image elements are present in Review component', () => {
  const review = {
    ID: 1,
    Rating: 5,
    Date: new Date(),
    Description: 'Testing Description',
    CustomerId: 1,
    CustomerName: 'Pranjay',
    CustomerAddr: '330',
    ImageUrl: '',
  };
  const wrapper = shallow(<Review review={review} />);

  expect(wrapper.find('img')).to.have.lengthOf(2);
});
