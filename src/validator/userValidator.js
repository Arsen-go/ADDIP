const Validator = require("./validator");
const { yup, ValidationError } = require("../constants");

class UserValidator extends Validator {
  async validateCreateUserProfile(firstName, lastName, birthDate, password, faculty, course) {
    const schema = yup.object().shape({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      birthDate: yup.string().required(),
      password: yup.string().required(),
      faculty: yup.string(),
      course: yup.number().integer().min(1, "Նման կուրս գոյություն չունի․").max(5, "Նման կուրս գոյություն չունի․"),
    })
    await this.validateYupSchema(schema, { firstName, lastName, birthDate, password, faculty, course });
    await this.validateUserBirthDate(birthDate);
  };

  async validateEditDetails(firstName, lastName, birthDate, password, faculty, course) {
    const schema = yup.object().shape({
      firstName: yup.string(),
      lastName: yup.string(),
      birthDate: yup.string(),
      password: yup.string(),
      faculty: yup.string(),
      course: yup.number().integer().min(1, "Նման կուրս գոյություն չունի․").max(5, "Նման կուրս գոյություն չունի․"),
    })
    await this.validateYupSchema(schema, { firstName, lastName, birthDate, password, faculty, course });
    await this.validateUserBirthDate(birthDate);
  };

  async validate(input) {
    const { firstName, lastName, birthDate, email, city, phone } = input;
    const schema = yup.object().shape({
      firstName: yup.string(),
      lastName: yup.string(),
      birthDate: yup.string(),
      email: yup.string(),
      city: yup.string(),
    });
    await this.validateYupSchema(schema, { firstName, lastName, birthDate, email, city });
    await this.validateEmail(email);
    await this.validateDate(birthDate);
    await this.validateUserBirthDate(birthDate);
    await this.validatePhoneNumber(phone);
  };

  async validateUserLogin(email, password) {
    const schema = yup.object().shape({
      email: yup.string().required(),
      password: yup.string().required(),
    });

    await this.validateEmail(email);
    await this.validateYupSchema(schema, { email, password });
  };

  async validateSort(sortBy, sortOrder) {
    const ifCanSort = ["Age", "City", "First Name", "Last Name"];
    if (!ifCanSort.includes(sortBy)) {
      throw new ValidationError(`It\`s not possible to sort ${sortBy}`);
    }
    if (sortOrder !== 1 && sortOrder !== -1 && sortOrder !== 0) {
      throw new ValidationError("Invalid sort type.");
    }
  };

  async validateUserBirthDate(birthDate) {
    const date = new Date(birthDate);
    const userAge = new Date().getFullYear() - date.getUTCFullYear();
    if (userAge > 100) {
      throw new ValidationError("User age is too big.");
    }
  };
};

module.exports = UserValidator;
