import React from 'react';
import PropTypes from 'prop-types';
import stylesheet from './TitleSection.scss';

const TitleSection = props =>
  (
    <section className={'TitleSection-zone'}>
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      <h1 className={'TitleSection-title'}>{props.titleFonts}</h1>
      <p className={'TitleSection-text'}>
        {props.contentFonts}
      </p>
    </section>
  );

TitleSection.propTypes = {
  titleFonts: PropTypes.string.isRequired,
  contentFonts: PropTypes.string.isRequired,
};

export default TitleSection;
