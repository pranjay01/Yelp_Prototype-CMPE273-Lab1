import React, { Component } from 'react';

class SuggestedNames extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ul className="suggestions-list">
        {this.props.searchStrings.map((string) => (
          <li
            className="item suggestion suggestions-list-item "
            role="option"
            tabIndex="0"
            aria-label="category"
            onClick={() => this.props.openRestroListPage(string)}
          >
            <div className="media-block">
              <div className="media-story">
                <span className="suggestion-detail">
                  <span className="suggestion-detail suggestion-title suggestion-name">
                    {string}
                  </span>
                </span>
                <small className="suggestion-detail suggestion-subtitle suggestion-location"></small>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

export default SuggestedNames;
