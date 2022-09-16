import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from './CreateStatementUseCase';

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Should be able to create a deposit statement", async () => {

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

    expect(await createStatementUseCase.execute(statementDeposit)).toHaveProperty("id");
  });

  it("Should be able to create a withdraw statement", async () => {

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

    const statementWitdraw = {
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 200,
      description: "description test"
    }

    expect(await createStatementUseCase.execute(statementWitdraw)).toHaveProperty("id");
  });

  it("should not be able to create an statement for an unexisting user", async () => {

    const statement = {
      user_id: '123abc',
      type: OperationType.DEPOSIT,
      amount: 200,
      description: "description test"
    }

    await expect(createStatementUseCase.execute(statement)).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it("should not be able to withdraw with insufficient funds", async () => {

    const userTest = {
      name: "ana julia",
      email: "teste@email.com",
      password: "123456"
    }

    const user = await createUserUseCase.execute(userTest);

    const statementDeposit = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "description test"
    }

    await createStatementUseCase.execute(statementDeposit);

    const statementWitdraw = {
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 200,
      description: "description test"
    }

    await expect(createStatementUseCase.execute(statementWitdraw))
      .rejects
      .toEqual(new CreateStatementError.InsufficientFunds());
  });

});
