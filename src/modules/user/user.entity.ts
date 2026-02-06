export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  setFirstName(firstName: string) {
    this.firstName = firstName;
    return this;
  }

  setLastName(lastName: string) {
    this.lastName = lastName;
    return this;
  }

  setEmail(email: string) {
    this.email = email;
    return this;
  }

  setPassword(password: string) {
    this.password = password;
    return this;
  }
}
