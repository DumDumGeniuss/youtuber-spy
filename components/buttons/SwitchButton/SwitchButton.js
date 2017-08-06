import React from 'react';
import PropTypes from 'prop-types';

import stylesheet from './SwitchButton.scss';

class SwitchButton extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(newProps) {
  }

  componentDidMount() {
  }

  onButtonClick() {
    this.props.onClick();
  }

  componentWillUnmount() {
  }
  render() {

    return (
      <div onClick={this.onButtonClick.bind(this)} style={ { height: '40px', width: '100px', borderRadius: '20px' } } className={'SwitchButton-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className={'SwitchButton-circle ' + (!this.props.isOn ? 'SwitchButton-circleLeft' : 'SwitchButton-circleRight')}/>
        <span className={'SwitchButton-text ' + (!this.props.isOn ? 'SwitchButton-textRight' : 'SwitchButton-textLeft')}>{this.props.text}</span>
      </div>
    );
  }
}

export default SwitchButton;
