import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const SurveyContext = createContext();

export const PreviewSurveyContext = ({ children }) => {
  const [surveyMeta, setSurveyMeta] = useState(null);

  return (
    <SurveyContext.Provider value={{ surveyMeta, setSurveyMeta }}>
      {children}
    </SurveyContext.Provider>
  );
};

PreviewSurveyContext.propTypes = {
  children: PropTypes.any
};
