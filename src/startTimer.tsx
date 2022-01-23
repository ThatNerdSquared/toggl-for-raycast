import { ActionPanel, Icon, List, ListItem, PushAction, showHUD } from "@raycast/api";
import { useEffect, useState } from "react";
import { getProjects, getWorkspaces, startTimer, getTimers } from "./toggl";
import NewTimerForm from "./NewTimerForm";
import { isProject, NewTimeEntry, Project, State, Timer, Workspace } from "./types";

async function itemChosen(item: Timer) {
  const data: NewTimeEntry = {
    description: item.description,
    pid: item.pid,
  };
  await startTimer(data);
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
      const workspaces: Array<Workspace> = await getWorkspaces();
      const projects: Array<Project> = await getProjects(workspaces[0].id.toString());

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
        workspaces: workspaces,
        projects: projects,
      };
      setState(newState);
    };
    getState();
  }, []);

  function getProjectFromTimer(timer: Timer): Project {
    const foundProj = state?.projects.filter((item: Project) => item.id == timer.pid);
    if (isProject(foundProj)) {
      return foundProj[0];
    } else {
      throw "Corresponding project not found!";
    }
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
