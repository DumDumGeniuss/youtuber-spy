import React from 'react';
import PropTypes from 'prop-types';

import stylesheet from './TitleSection.scss';

class TitleSection extends React.Component {
  static getInitialProps({ isServer }) {
    return {
      isServer,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <section className={'TitleSection-titleSection'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <h1 className={'TitleSection-title'}>{this.props.titleFonts}</h1>
        <p className={'TitleSection-text'}>
          {this.props.contentFonts}
        </p>
      </section>
    );
  }
}

export default TitleSection;
