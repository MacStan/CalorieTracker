import { RecordModel } from './record';
import { FoodKindModel } from './food-kind-model';

export class DatabaseModel {
    records: RecordModel[] = [];
    foodKinds: FoodKindModel[] = [];
}
