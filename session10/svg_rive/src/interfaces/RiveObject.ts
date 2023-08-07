import { StateAction } from "./StateAction";

export interface RiveObject {
  name: string,
  animations: string[],
  actions: StateAction[],
  style: {
    width: number,
    height: number,
    marginTop: number,
    marginBottom: number
  }
}
