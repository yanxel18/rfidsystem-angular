import { mainServiceData } from "../../test-data/total-area-data";
import { TestBed } from "@angular/core/testing";
import {
  ApolloTestingController,
  ApolloTestingModule,
} from "apollo-angular/testing";
import { CMainService } from "./c-main.service";
import {
  GET_DROPDOWN_LIST,
  GET_TOTALPERAREASTAT,
} from "./c-main-dashboard-gql";
import { dateSelectData } from "src/test-data/date-select-data";

describe("CMainService", () => {
  let mainService: CMainService;
  let apolloController: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [CMainService],
    });

    mainService = TestBed.inject(CMainService);
    apolloController = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    apolloController.verify();
  });

  it("should be created", () => {
    expect(mainService).toBeTruthy();
  });

  it("should return total areas", () => {
    const dateNow: Date = new Date();
    mainService.getTotalArea(dateNow.toString()).subscribe(({ data }) => {
      expect(data).withContext("No data retrieved.").toBeTruthy();
      expect(data.PerArea.length)
        .withContext("No Per area data")
        .toBeGreaterThan(1);
      expect(data.TotalArea.length)
        .withContext("No total area data")
        .toEqual(1);
    });

    const op = apolloController.expectOne(GET_TOTALPERAREASTAT);

    expect(op.operation.operationName).toBe("TotalArea");
    op.flush({
      data: { ...mainServiceData },
    });
  });

  it("should return time list", () => {
    const dateNow: Date = new Date();
    mainService.getDateList(dateNow.toString()).subscribe(({ data }) => {
      expect(data.DateList).withContext("No Date list returned").toBeTruthy();
      expect(data.DateList.length)
        .withContext("No Date list returned")
        .toBeGreaterThan(1);
    });

    const op = apolloController.expectOne(GET_DROPDOWN_LIST);
    expect(op.operation.operationName).toBe("DateSelectList");
    op.flush({ data: { ...dateSelectData } });
  });
});
