import { ActionPanel, Icon, List, ListItem, PushAction, showHUD } from "@raycast/api";
import { useEffect, useState } from "react";
import { getProjects, getWorkspaceID, startTimer, getTimers, stopTimer } from "./toggl";
import NewTimerForm from "./NewTimerForm";

interface Timer {
  name: string;
  pid: number;
  project: string;
  colour: string;
}

interface EntryFromAPI {
  id: number;
  wid: number;
  pid: number;
  billable: boolean;
  start: string;
  stop: string;
  duration: number;
  description: string;
  tags: Array<string>;
  at: string;
}

interface Project {
  id: number;
  wid: number;
  name: string;
  billable: boolean;
  is_private: boolean;
  active: boolean;
  template: boolean;
  at: string;
  created_at: string;
  color: string;
  auto_estimates: boolean;
  actual_hours: number;
  hex_color: string;
}

async function itemChosen(item: Timer) {
  const timeEntry = {
    name: item.name,
    project: item.pid,
  };
  await startTimer(timeEntry);
  await showHUD(`Timer for "${item.name}" started! 🎉`);
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
  const [timers, setTimers] = useState<Timer[]>();

  useEffect(() => {
    const getEntries = async () => {
      const data: Array<EntryFromAPI> = await getTimers();
      const fullData = data.reverse();
      const workspaceID: string = await getWorkspaceID();
      const projects: Array<Project> = await getProjects(workspaceID);
      const newTimers: Array<Timer> = [];

      fullData.forEach((entry: EntryFromAPI) => {
        const project = entry.pid;
        const description = entry.description;
        const timer: Timer = {
          name: description,
          pid: project,
          project: "",
          colour: "",
        };
        projects.forEach((proj) => {
          if (proj.id == project) {
            timer.project = proj.name;
            timer.colour = proj.hex_color;
          }
        });
        const isAlreadyAdded = newTimers.some((item) => {
          return JSON.stringify(item) == JSON.stringify(timer);
        });
        if (!isAlreadyAdded) {
          newTimers.push(timer);
        }
      });
      setTimers(newTimers);
    };
    getEntries();
  }, []);

  return (
    <List isLoading={timers === undefined}>
      <List.Section title="Actions">
        <CreateNewAction />
      </List.Section>
      <List.Section title="Previous Timers">
        {timers?.map((timer, index) => (
          <List.Item
            key={index}
            icon={{ source: Icon.Clock, tintColor: timer.colour }}
            title={timer.name}
            accessoryTitle={timer.project}
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
