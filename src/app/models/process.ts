import { UUID } from '../utils/uuid';

export class Process {
  private _id: string;
  get id(): string {
    if (this._id) {
      return this._id;
    }
    this._id = UUID.newUUID();
  }
}
