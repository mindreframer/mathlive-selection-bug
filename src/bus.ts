import { EventBus, createEventDefinition } from "ts-bus";
export const bus = new EventBus();

export const selectionChanged = createEventDefinition<{
  latex: string;
  start: number;
  end?: number;
  depth?: number;
}>()("selection.changed");

export const deleteMathInput = createEventDefinition<{
  position: number;
}>()("mathinput.delete");
