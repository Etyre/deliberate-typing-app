import { authenticateUser } from "../utils/authentication-utils.js";

console.log(await authenticateUser("test@test.com", "test"));

// console.log(authenticateUser("test@test", "test"));

// console.log(authenticateUser("test@test.com", "pop"));
