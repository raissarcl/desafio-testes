import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUserUserRepository: InMemoryUsersRepository;

describe("Create User", () => {

  beforeEach(() => {
    inMemoryUserUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserUserRepository);
  });

  it("it should be able to create a new user", async () => {
    const user = {
      name: "ana julia",
      email: "teste@email.com",
      password: "123456"
    }

    expect(await createUserUseCase.execute(user)).toHaveProperty("id");
  });

  it("should not be able to create an already existing user", async () => {
    const user = {
      name: "ana julia",
      email: "teste@email.com",
      password: "123456"
    }

    await createUserUseCase.execute(user);

    await expect(createUserUseCase.execute(user)).rejects.toEqual(new CreateUserError());
  });

});
