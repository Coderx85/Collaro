import { User } from "./class";

const user = new User();
const newUser = user.createUser({
  name: "John Doe",
  email: "john.doe@example.com",
  password: "securepassword",
  username: "johndoe",
});

console.log(newUser);