import { Observable } from 'rxjs';
import {
  IAreaList,
  ILocationList,
  ITeamList,
  IPositionList,
  IDivisionList,
  IKakariList,
} from 'src/models/viewboard-model';
import { z } from 'zod';

export const FilterTypes = z.object({
  areaID: z.number().array(),
  locID: z.number().array(),
  teamID: z.number().array(),
  posID: z.number().array(),
  divID: z.number().array(),
  kakariID: z.number().array(),
});

export type IFilterTypes = z.infer<typeof FilterTypes>;

export type ISelectedItem = {
  areaSelected: (selected: number) => Observable<IAreaList[]>;
  locSelected: (selected: number) => Observable<ILocationList[]>;
  teamSelected: (selected: number) => Observable<ITeamList[]>;
  posSelected: (selected: number) => Observable<IPositionList[]>;
  divSelected: (selected: number) => Observable<IDivisionList[]>;
  kakariSelected: (selected: number) => Observable<IKakariList[]>;
};
