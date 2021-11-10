import { ActionPanel, List } from "@raycast/api"
import timers from "./timers"
import { getProjects, getWorkspaceID } from "./toggl"

async function itemChosen() {
	const workspaceID: string = await getWorkspaceID()
	console.log(workspaceID)
	const projects = await getProjects(workspaceID)
	console.log(projects)
}

const timerArray = timers.map(timer => {
	return (
		<List.Item
			title={timer.name}
			subtitle={timer.project}
			actions={
				<ActionPanel>
					<ActionPanel.Item title="Start Timer" onAction={() => itemChosen()} />
				</ActionPanel>
			}
		/>
	)
})

export default function Command() {
	return (
		<List>
			{timerArray}
		</List>
	)
}
