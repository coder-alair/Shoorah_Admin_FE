import validator from 'validator';

function AddEditSoundVali(data, categoriesList, selectedFile, selectedSound,expertId) {
  const errors = {};
  if (validator.isEmpty(data.soundTitle.trim())) errors.soundTitle = 'Please enter the title.';
  if (validator.isEmpty(data.description.trim()))
    errors.description = 'Please enter the description.';
  if (!categoriesList) errors.focus = 'Please select the category.';
  if (!selectedFile && selectedFile === '' && selectedFile !== File)
    errors.soundFile = 'Please select the file.';
  if (!selectedSound && selectedSound === '' && selectedSound !== File)
    errors.selectedSound = 'Please select the sound image.';
  if (!expertId?.id )
    errors.expertId = 'Please select expert.';
  // if (data.soundBy === 2) {
  //   if (validator.isEmpty(data?.expertName?.trim())) errors.expertName = 'Please enter the title.';
  // }
  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AddEditSoundVali;
