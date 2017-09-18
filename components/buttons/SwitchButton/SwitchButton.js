import React from 'react';
import PropTypes from 'prop-types';

import stylesheet from './SwitchButton.scss';

class SwitchButton extends React.Component {
  constructor(props) {
    super(props);

    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick() {
    this.props.onClick();
  }

  render() {
    return (
      <div
        onClick={this.onButtonClick}
        style={{ height: '40px', width: '100px', borderRadius: '20px' }}
        className={'SwitchButton-zone'}
        role={'button'}
        tabIndex={0}
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className={`SwitchButton-circle ${!this.props.isOn ? 'SwitchButton-circleLeft' : 'SwitchButton-circleRight'}`} />
        <span className={`SwitchButton-text ${!this.props.isOn ? 'SwitchButton-textRight' : 'SwitchButton-textLeft'}`}>
          {this.props.text}
        </span>
      </div>
    );
  }
}

SwitchButton.propTypes = {
  isOn: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SwitchButton;
