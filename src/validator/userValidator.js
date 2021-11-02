const Validator = require("./validator");
const { yup, ValidationError } = require("../constants");

class UserValidator extends Validator {
  async validateCreateUserProfile(firstName, lastName, birthDate, gender) {
    const schema = yup.object().shape({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      birthDate: yup.string().required(),
      gender: yup.string().required(),
    })
    await this.validateYupSchema(schema, { firstName, lastName, birthDate, gender });
    await this.validateUserBirthDate(birthDate);
  };

  async validateEditDetails(args) {
    const { birthDate, email, phone } = args;
    const schema = yup.object().shape({
      firstName: yup.string(),
      lastName: yup.string(),
      email: yup.string(),
      birthDate: yup.string(),
      country: yup.string(),
      city: yup.string(),
      phone: yup.string()
    })
    await this.validateYupSchema(schema, args);
    await this.validateEmail(email);
    await this.validateUserBirthDate(birthDate);
    await this.validatePhoneNumber(phone);
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
