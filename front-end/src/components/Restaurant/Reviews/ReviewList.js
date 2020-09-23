import Review from './Review';
import React, { Component } from 'react';
import './Reviews.css';

class ReviewList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      REVIEWS: [
        {
          ID: 1,
          Rating: 5,
          Date: null,
          Description: 'bdjewdjehwbdeb',
          CustomerId: 1,
          CustomerName: 'pranjay',
          reviewCount: 8,
          CustomerAddr: 'jgjg',
        },
        {
          ID: 2,
          Rating: 4,
          Date: null,
          Description: 'bdjewdjehwbdeb',
          CustomerId: 1,
          CustomerName: 'pranjay',
          reviewCount: 8,
          CustomerAddr: 'jgjg',
        },
        {
          ID: 3,
          Rating: 3,
          Date: null,
          Description: 'bdjewdjehwbdeb',
          CustomerId: 1,
          CustomerName: 'pranjay',
          reviewCount: 8,
          CustomerAddr: 'jgjg',
        },
        {
          ID: 4,
          Rating: 2,
          Date: null,
          Description: 'bdjewdjehwbdeb',
          CustomerId: 1,
          CustomerName: 'pranjay',
          reviewCount: 8,
          CustomerAddr: 'jgjg',
        },
        {
          ID: 5,
          Rating: 1,
          Date: null,
          Description: 'bdjewdjehwbdeb',
          CustomerId: 1,
          CustomerName: 'pranjay',
          reviewCount: 8,
          CustomerAddr: 'jgjg',
        },
        {
          ID: 6,
          Rating: 0,
          Date: null,
          Description: 'bdjewdjehwbdeb',
          CustomerId: 1,
          CustomerName: 'pranjay',
          reviewCount: 8,
          CustomerAddr: 'jgjg',
        },
      ],
    };
  }
  render() {
    return (
      <div>
        <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
          {this.state.REVIEWS.map((review) => (
            <Review
              review={review}
              //   CUISINES={this.state.CUISINES}
              //   editableId={this.state.editableId}
              //   makeEditable={(ID) => this.makeEditable(ID)}
              //   onDelete={this.deleteFoodItem}
              //   onCancelUpdate={() => this.cancelFoodUpdate(food.ID)}
              //   onSave={() => this.updateFoodItem(food.ID)}
              //   onNameChangeHandler={(evt, id) => this.onNameChangeHandlerUpdate(evt, id)}
              //   onPriceChangeHandler={(evt, id) => this.onPriceChangeHandlerUpdate(evt, id)}
              //   onCusineChangeHandler={(evt, id) => this.onCusineChangeHandlerUpdate(evt, id)}
              //   onIngredentsChangeHandler={(evt, id) => this.onIngredentsChangeHandlerUpdate(evt, id)}
              //   onDescriptionChangeHandler={(evt, id) =>
              //     this.onDescriptionChangeHandlerUpdate(evt, id)
              //   }
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default ReviewList;
