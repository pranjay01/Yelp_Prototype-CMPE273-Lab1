import React, { Component } from 'react';
import Menu from './menu';
class menuBlock extends Component {
  constructor(props) {
    super(props);
    this.state = { menuDisabled: true };
  }
  showMenu = () => {
    this.setState({
      menuDisabled: !this.state.menuDisabled,
    });
  };
  render() {
    return (
      <div className="arrange_unit nowrap">
        <div class="main-header_account">
          <div class="user-account clearfix drop-menu-origin" onClick={this.showMenu}>
            <a class="ybtn ybtn--primary drop-menu-link user-account_button">
              <span class="user-account_avatar responsive-visible-large-block">
                <img
                  alt="Pranjay S."
                  class="photo-box-img"
                  height="90"
                  loading="lazy"
                  src="https://s3-media0.fl.yelpcdn.com/assets/public/user_medium_square.yji-bf5ff8a79310030f79328ae60713730f.png"
                  width="90"
                />
              </span>
              <span
                style={{ width: '14px', height: '14px' }}
                class="icon icon--14-triangle-down icon--size-14 icon--inverse icon--fallback-inverted u-triangle-direction-down user-account_button-arrow responsive-visible-large-inline-block"
              >
                <svg role="img" class="icon_svg"></svg>
              </span>
              <span
                style={{ width: '24px', height: '24px' }}
                class="icon icon--24-hamburger icon--size-24 icon--inverse icon--fallback-inverted drop-menu-link_open"
              >
                <svg role="img" class="icon_svg"></svg>
              </span>
              <span
                aria-hidden="true"
                style={{ width: '24px', height: '24px' }}
                class="icon icon--24-close icon--size-24 icon--inverse icon--fallback-inverted drop-menu-link_close"
              >
                <svg role="img" class="icon_svg"></svg>
              </span>
            </a>
            {!this.state.menuDisabled && <Menu />}
          </div>
        </div>
      </div>
    );
  }
}

export default menuBlock;
