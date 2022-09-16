import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUserUserRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {

  beforeEach(() => {
    inMemoryUserUserRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserUserRepository);
  });

  it("should be able to get an user's profile", async () => {

    const user = await createUserUseCase.execute({
      name: "ana julia",
      email: "teste@email.com",
      password: "123456"
    });

    expect(await showUserProfileUseCase.execute(user.id as string)).toEqual(user);
  });

  it("should not be able to show an unexistent user's profile", async () => {

    const userId = 'abc123';

    await expect(showUserProfileUseCase.execute(userId)).rejects.toEqual(new ShowUserProfileError());
  });

});
