import { Test, TestingModule } from "@nestjs/testing";
import { CoffeesService } from "./coffees.service";
import { Connection, Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Flavor } from "./entities/flavor.entity/flavor.entity";
import { Coffee } from "./entities/coffee.entity";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
})

describe("CoffeesService", () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: Connection, useValue: {} },
        { provide: getRepositoryToken(Flavor), useValue: {} },
        { provide: getRepositoryToken(Coffee), useValue: {} },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee))
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('When coffeewith ID exists', () => {
      it('Should return the coffee object', async () => {
        const coffeeId = 3
        const expectedCoffee = {}

        coffeeRepository.findOne.mockReturnValue(expectedCoffee)
        const coffee = await service.findOne(coffeeId)
        expect(coffee).toEqual(expectedCoffee)
      })
    })
    describe('otherwise', () => {
      it('Should throw the "NotFoundException"', async () => {
        const coffeeId = 3
        coffeeRepository.findOne.mockReturnValue(undefined)

        try {
          await service.findOne(coffeeId)
        } catch(err) {
          expect(err).toBeInstanceOf(NotFoundException)
          expect(err.message).toEqual(`Coffee #${coffeeId} not found`)
        }
      })
    })
  })
});
