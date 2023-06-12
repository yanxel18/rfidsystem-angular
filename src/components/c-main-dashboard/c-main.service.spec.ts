import { mainServiceData } from "./../../../test-data/total-area-data";
import { TestBed } from "@angular/core/testing";
import {
  ApolloTestingController,
  ApolloTestingModule,
} from "apollo-angular/testing";
import { CMainService } from "./c-main.service";
import { GET_TOTALPERAREASTAT } from "./c-main-dashboard-gql";
fdescribe("CMainService", () => {
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
    const dateNow = new Date();
    mainService.getTotalArea(dateNow.toString()).subscribe((AreaData) => {
      expect(AreaData).withContext("No Data retrieved.").toBeTruthy();
      expect(AreaData.data.PerArea.length)
        .withContext("No Per area data")
        .toBeGreaterThan(1);
      expect(AreaData.data.TotalArea.length)
        .withContext("No total area data")
        .toEqual(1);
        return AreaData
    });
    const req = apolloController.expectOne(GET_TOTALPERAREASTAT);
    req.flush({
      data: { ...mainServiceData },
    });
  });
});
