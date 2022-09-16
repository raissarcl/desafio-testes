import { usersTable1616681812086 } from "../../../../database/migrations/1616681812086-users-table";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUserUserRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {

  beforeEach(() => {
    inMemoryUserUserRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserUserRepository);
  });

  it("should be able to authenticate an user", async () => {
    const userTest = {
      name: "ana julia",
      email: "teste@email.com",
      password: "123456"
    }

    await createUserUseCase.execute(userTest);

    const email = userTest.email;
    const password = userTest.password;

    expect(await authenticateUserUseCase.execute({ email, password })).toHaveProperty("token");
  });

  it("Should not be able to create an user with incorrect password", async () => {
    const userTest = {
      name: "ana julia",
      email: "teste@email.com",
      password: "123456"
    }

    await createUserUseCase.execute(userTest);

    const email = userTest.email;
    const password = "incorrectpassword";

    await expect(authenticateUserUseCase.execute({ email, password })).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("Should not be able to create an user with incorrect email", async () => {
    const userTest = {
      name: "ana julia",
      email: "teste@email.com",
      password: "123456"
    }

    await createUserUseCase.execute(userTest);

    const email = "incorrectemail@email.com";
    const password = userTest.password;

    await expect(authenticateUserUseCase.execute({ email, password })).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

});
