import React, { Component } from 'react';
import './RestaurantHome.css';
class DefaultHome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className="lemon--div__06b83__1mboc grid-column-item__06b83__1-eL7 border-color--default__06b83__3-ifU"
        style={{ order: 'initial' }}
      >
        <div class="lemon--div__06b83__1mboc business-information-header__06b83__31Hz9 border-color--default__06b83__3-ifU">
          <div class="lemon--div__06b83__1mboc border-color--default__06b83__3-ifU">
            <img
              class="lemon--img__06b83__3GQUb"
              src="https://s3-media0.fl.yelpcdn.com/assets/public/defaultBusinessHeaderImage.yji-a94634351a246719545b17b9bddc388f.png"
              width="100%"
            />
          </div>
          <div class="lemon--div__06b83__1mboc business-information__06b83__1mOZN padding-b1__06b83__3erWW padding-l3__06b83__1scQ0 border-color--default__06b83__3-ifU">
            <div class="lemon--div__06b83__1mboc arrange__06b83__2C9bH gutter-auto__06b83__1Ep_j grid__06b83__1Pz7f layout-stack-medium__06b83__2_hKD vertical-align-bottom__06b83__2xIbs border-color--default__06b83__3-ifU">
              <div class="lemon--div__06b83__1mboc arrange-unit__06b83__o3tjT arrange-unit-grid-column--8__06b83__2dUx_ border-color--default__06b83__3-ifU">
                <div class="lemon--div__06b83__1mboc arrange__06b83__2C9bH gutter-auto__06b83__1Ep_j border-color--default__06b83__3-ifU">
                  <div class="lemon--div__06b83__1mboc arrange-unit__06b83__o3tjT arrange-unit-fill__06b83__3Sfw1 border-color--default__06b83__3-ifU">
                    <div class="lemon--div__06b83__1mboc fs-block border-color--default__06b83__3-ifU">
                      <div class="lemon--div__06b83__1mboc border-color--default__06b83__3-ifU">
                        <div class="lemon--div__06b83__1mboc business-name__06b83__2Y1ql display--inline-block__06b83__1ZKqC border-color--default__06b83__3-ifU">
                          <div class="lemon--div__06b83__1mboc border-color--default__06b83__3-ifU">
                            <h2 class="lemon--h2__06b83__hjA2W heading--h2__06b83__1g9VN">
                              {this.props.profileInfo.restroName}
                            </h2>
                          </div>
                        </div>
                      </div>
                      <div class="lemon--div__06b83__1mboc border-color--default__06b83__3-ifU">
                        <div class="lemon--div__06b83__1mboc business-info__06b83__1dQLw display--inline-block__06b83__1ZKqC border-color--default__06b83__3-ifU">
                          <div class="lemon--div__06b83__1mboc border-color--default__06b83__3-ifU">
                            <p class="lemon--p__06b83__3Qnnj text__06b83__2Kxyz text-color--white__06b83__22aE8 text-align--left__06b83__2XGa- text-weight--semibold__06b83__2l0fe">
                              {this.props.profileInfo.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="lemon--div__06b83__1mboc border-color--default__06b83__3-ifU">
                      <div class="lemon--div__06b83__1mboc business-info__06b83__1dQLw display--inline-block__06b83__1ZKqC padding-t1__06b83__2aTOb border-color--default__06b83__3-ifU">
                        <div class="lemon--div__06b83__1mboc border-color--default__06b83__3-ifU">
                          <span class="lemon--span__06b83__3997G text__06b83__2Kxyz text-color--normal__06b83__3xep9 text-align--left__06b83__2XGa-">
                            {this.props.profileInfo.reviewCOunt} reviews
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="lemon--div__06b83__1mboc border-color--default__06b83__3-ifU">
                      <div class="lemon--div__06b83__1mboc business-info__06b83__1dQLw display--inline-block__06b83__1ZKqC padding-t1__06b83__2aTOb border-color--default__06b83__3-ifU">
                        <div class="lemon--div__06b83__1mboc border-color--default__06b83__3-ifU">
                          <span class="lemon--span__06b83__3997G text__06b83__2Kxyz text-color--normal__06b83__3xep9 text-align--left__06b83__2XGa-">
                            Food Delivery Services
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="lemon--div__06b83__1mboc arrange-unit__06b83__o3tjT arrange-unit-grid-column--4__06b83__33Wpc border-color--default__06b83__3-ifU">
                <div class="lemon--div__06b83__1mboc padding-r3__06b83__57InZ border-color--default__06b83__3-ifU">
                  <a
                    class="lemon--a__06b83__IEZFH link__06b83__1G70M link-color--blue-dark__06b83__85-Nu link-size--default__06b83__7tls6"
                    href="/biz_info/a6ykWNxlBKARvLN67kCllA"
                    target=""
                    name=""
                    rel=""
                    role="link"
                  >
                    Edit business information
                    <span
                      class="lemon--span__06b83__3997G icon__06b83__ehCWV icon--16-arrow-right-v2 icon--white__06b83__3vmFJ undefined icon--v2__06b83__1yp8c"
                      aria-hidden="true"
                      style={{ width: '16px', height: '16px' }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        class="icon_svg"
                      >
                        <path d="M13.46 7.3l-3-3.06A1.015 1.015 0 1 0 9 5.65L10.37 7H3.25a1 1 0 0 0 0 2h7.12L9 10.35a1 1 0 0 0 0 1.42 1 1 0 0 0 .7.28 1 1 0 0 0 .71-.29l3-3.06a1 1 0 0 0 .05-1.4z"></path>
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DefaultHome;