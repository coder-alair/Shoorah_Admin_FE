import validator from 'validator';

function ConfigValidations(data, isAndroid) {
  const errors = {};
  const pattern = /^[0-9](\.[0-9]{1,2})*$/;
  if (isAndroid) {
    if (validator.isEmpty(data?.minAndroidVersion.trim()))
      errors.minAndroidVersion = 'Please enter minimum Android version.';
    if (!pattern.test(data?.minAndroidVersion))
      errors.minAndroidVersion = 'Please enter valid minimum Android version.';
  } else {
    if (validator.isEmpty(data?.minIOSVersion.trim()))
      errors.minIOSVersion = 'Please enter minimum iOS version.';
    if (!pattern.test(data?.minIOSVersion))
      errors.minIOSVersion = 'Please enter valid minimum iOS version.';
  }
  if (validator.isEmpty(data?.updateMessage.trim()))
    errors.updateMessage = 'Please enter update message.';
  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default ConfigValidations;
