export default class InputError extends Error {
  constructor(message, inputField) {
    super(message);
    this.inputField = inputField;
  }
}
