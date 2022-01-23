import { ActionPanel, Icon, List, ListItem, PushAction, showHUD } from "@raycast/api";
import { useEffect, useState } from "react";
import { getProjects, getWorkspaceID, startTimer, getTimers } from "./toggl";
import NewTimerForm from "./NewTimerForm";
import { Project, State, Timer } from "./types";

async function itemChosen(item: Timer) {
  await startTimer(item);
  await showHUD(`Timer for "${item.description}" started! 🎉`);
}

const CreateNewAction = () => {
  return (
    <ListItem
      key={0}
      icon={Icon.ArrowRight}
      title={"Create New Timer"}
      actions={
        <ActionPanel>
          <PushAction title="Create New Timer" target={<NewTimerForm />} />
        </ActionPanel>
      }
    />
  );
};

export default function Command() {
  const [state, setState] = useState<State>();

  useEffect(() => {
    const getState = async () => {
      const data: Array<Timer> = await getTimers();
      const fullData = data.reverse();
      const workspaceID: string = await getWorkspaceID();
      const projects: Array<Project> = await getProjects(workspaceID);

      const newTimers: Array<Timer> = [];
      fullData.forEach((entry: Timer) => {
        const isAlreadyAdded = newTimers.some((item) => {
          return entry.pid == item.pid && entry.description == item.description;
        });
        if (!isAlreadyAdded) {
          newTimers.push(entry);
        }
      });

      const newState = {
        timers: newTimers,
        workspaceID: workspaceID,
        projects: projects,
      };
      setState(newState);
    };
    getState();
  }, []);

  function getProjectFromTimer(timer: Timer): Project {
    const foundProj = state?.projects.filter((item: Project) => item.id == timer.pid);
    return foundProj[0];
  }

  return (
    <List isLoading={state === undefined}>
      <List.Section title="Actions">
        <CreateNewAction />
      </List.Section>
      <List.Section title="Previous Timers">
        {state?.timers?.map((timer, index) => (
          <List.Item
            key={index}
            icon={{ source: Icon.Clock, tintColor: getProjectFromTimer(timer).hex_color }}
            title={timer.description}
            accessoryTitle={getProjectFromTimer(timer).name}
            actions={
              <ActionPanel>
                <ActionPanel.Item title="Start Timer" onAction={() => itemChosen(timer)} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
