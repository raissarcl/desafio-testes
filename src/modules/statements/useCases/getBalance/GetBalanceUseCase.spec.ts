import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it("should be able to get an user's balance", async () => {

    const userTest = {
      name: "Test name",
      email: "teste@email.com",
      password: "123456"
    }

    const user = await createUserUseCase.execute(userTest);

    const statementDeposit = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 200,
      description: "description test"
    }

    await createStatementUseCase.execute(statementDeposit);

    expect(await getBalanceUseCase.execute({ user_id: user.id as string })).toHaveProperty("balance");
  });

  it("should not be able to get an unexistent user's balance", async () => {

    const user_id = "123abc";

    await expect(getBalanceUseCase.execute({ user_id })).rejects.toEqual(new GetBalanceError());
  });

})
