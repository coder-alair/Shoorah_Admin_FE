import validator from 'validator';

function AddEditSurveyVali(data, focusList, selectedFile, selectedMeditation) {
  const errors = {};

  if (validator.isEmpty(data.surveyTitle.trim()))
    errors.surveyTitle = 'Please enter the Survey Title.';
  if (focusList.length === 0) errors.focus = 'Please select the focus.';
  if (!selectedFile && selectedFile === '' && selectedFile !== File)
    errors.meditationFile = 'Please select the file.';
  if (!selectedMeditation && selectedMeditation === '' && selectedMeditation !== File)
    errors.meditationImage = 'Please select the meditation image.';
  if (data.meditationBy === 2) {
    if (validator.isEmpty(data?.expertName?.trim())) errors.expertName = 'Please enter the title.';
  }
  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AddEditSurveyVali;
