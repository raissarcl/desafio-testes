import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to get an statement", async () => {

    const userTest = {
      name: "ana julia",
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

    const statement = await createStatementUseCase.execute(statementDeposit);

    const user_id = user.id as string;
    const statement_id = statement.id as string;

    expect(await getStatementOperationUseCase.execute({ user_id, statement_id })).toEqual(statement);
  });

  it("should not be able to return an statement operation for an unexisting user", async () => {

    const user_id = "123abc";
    const statement_id = "statementtest";

    await expect(getStatementOperationUseCase.execute({ user_id, statement_id })).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("should not be able to return an statement operation for an unexisting operation", async () => {

    const userTest = {
      name: "ana julia",
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

    const user_id = user.id as string;
    const statement_id = 'statementtest';

    await expect(getStatementOperationUseCase.execute({ user_id, statement_id })).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });

});
;
