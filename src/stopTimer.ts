import { closeMainWindow, showHUD } from "@raycast/api";
import { getCurrentTimer, stopTimer } from "./toggl";
import { CurrentEntry } from "./types";

export default async () => {
  await closeMainWindow();
  const entry: CurrentEntry = await getCurrentTimer();
  await stopTimer(entry.data.id);
  await showHUD("Timer stopped! 🎉");
};
