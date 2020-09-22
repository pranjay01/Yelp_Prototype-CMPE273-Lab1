import React, { Component } from 'react';

class NewFoodForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <li class="job-form-section-group-viewer-styles__viewer--2SPgS">
        <div data-ui="group">
          <form
            onSubmit={this.props.onSaveCreateNew}
            class="yform signup-form  city-hidden"
            id="signup-form"
          >
            <div class="js-password-meter-container">
              <ul class="inline-layout clearfix">
                <li style={{ width: '12%' }}>
                  <p style={{ margin: '5px' }}>Name</p>
                </li>
                <li style={{ width: '38%' }}>
                  <label class="placeholder-sub">Name</label>
                  <input
                    maxLength="50"
                    id="Name"
                    name="Name"
                    placeholder="Name"
                    required="required"
                    type="text"
                    onChange={(event) => this.props.onNameChangeHandler(event.target.value)}
                    value={this.props.food.Name}
                  />
                </li>
                <li style={{ width: '5%' }}></li>
                <li style={{ width: '10%' }}>
                  <p style={{ margin: '5px' }}>Price</p>
                </li>
                <li style={{ width: '22%' }}>
                  <label class="placeholder-sub">Price</label>
                  <input
                    id="Price"
                    name="Price"
                    placeholder="Price"
                    required="required"
                    type="text"
                    onChange={(event) => this.props.onPriceChangeHandler(event.target.value)}
                    value={this.props.food.Price}
                  />
                </li>
                <li style={{ width: '8%' }}>
                  <p style={{ margin: '10px' }}>'$'</p>
                </li>
              </ul>

              <ul class="inline-layout clearfix">
                <li style={{ width: '13%' }}>
                  <p style={{ margin: '4px' }}>Cusine:</p>
                </li>

                <li style={{ width: '22%' }}>
                  <label class="placeholder-sub">CUISINE</label>
                  <select
                    placeholder="CUISINE"
                    className="form-control"
                    onChange={(event) => this.props.onCusineChangeHandler(event.target.value)}
                    value={this.props.food.CuisineID}
                    required
                  >
                    <option className="Dropdown-menu" key="" value="">
                      select
                    </option>
                    {this.props.CUISINES.map((CUISINE) => (
                      <option className="Dropdown-menu" key={CUISINE.key} value={CUISINE.key}>
                        {CUISINE.value}
                      </option>
                    ))}
                  </select>
                </li>
                <li style={{ width: '23%' }}>
                  <p style={{ margin: '5px' }}>Main Ingredents</p>
                </li>
                <li style={{ width: '40%' }}>
                  <label class="placeholder-sub"></label>
                  <input
                    maxLength="100"
                    id="MainIngredents"
                    name="MainIngredents"
                    placeholder="Ingredents"
                    type="text"
                    onChange={(event) => this.props.onIngredentsChangeHandler(event.target.value)}
                    value={this.props.food.MainIngredients}
                  />
                </li>
              </ul>

              <ul class="inline-layout clearfix">
                <li style={{ width: '17%' }}>
                  <p style={{ margin: '5px' }}>Description</p>
                </li>

                <li style={{ width: '81%' }}>
                  <label class="placeholder-sub">Description</label>
                  <input
                    maxLength="100"
                    id="Description"
                    name="Description"
                    placeholder="Description"
                    type="text"
                    onChange={(event) => this.props.onDescriptionChangeHandler(event.target.value)}
                    value={this.props.food.Description}
                  />
                </li>
              </ul>
            </div>

            <div style={{ position: 'absolute', bottom: '10px', right: '322px' }}>
              <button
                type="submit"
                data-ui="add-section"
                aria-describedby="education_label"
                class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
              >
                Save
              </button>
            </div>
          </form>
          <div class="job-form-section-group-viewer-styles__dotsWrapper--Jt82u">
            <span aria-hidden="true" class="icon--24-deal-v2 css-1mpk29p">
              <a onClick={() => this.props.cancelAddition()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="icon_svg">
                  <path
                    fill="none"
                    d="M10,1.344c-4.781,0-8.656,3.875-8.656,8.656c0,4.781,3.875,8.656,8.656,8.656c4.781,0,8.656-3.875,8.656-8.656C18.656,5.219,14.781,1.344,10,1.344z M10,17.903c-4.365,0-7.904-3.538-7.904-7.903S5.635,2.096,10,2.096S17.903,5.635,17.903,10S14.365,17.903,10,17.903z M13.388,9.624H6.613c-0.208,0-0.376,0.168-0.376,0.376s0.168,0.376,0.376,0.376h6.775c0.207,0,0.377-0.168,0.377-0.376S13.595,9.624,13.388,9.624z"
                  ></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </li>
    );
  }
}

export default NewFoodForm;
