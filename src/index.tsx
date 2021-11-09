import { ActionPanel, List } from "@raycast/api"
import timers from "./timers"

const timerArray = timers.map(timer => {
	return (
		<List.Item
			title={timer.name}
			subtitle={timer.project}
			actions={
				<ActionPanel>
					<ActionPanel.Item title="Start Timer" onAction={() => console.log("Close PR #1")} />
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
