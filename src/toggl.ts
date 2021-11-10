import { getPreferenceValues } from "@raycast/api"
import fetch from "node-fetch"

interface Timer {
	"name": string,
	"project": string
}

interface Preferences {
	"apiToken": string
}

async function startTimer(timerObject: Timer) {
	const baseURL = "https://api.toggl.com/v8/time_entries/start"
	const data = {
		"description": timerObject.name,
		"project": timerObject.project
	}
	await fetch(baseURL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data),
	})
}

async function getProjects(workspaceID: string) {
	const prefs: Preferences = getPreferenceValues()
	const baseURL = `https://api.track.toggl.com/api/v8/workspaces/${workspaceID}/projects`
	const auth = "Basic " + new Buffer(prefs.apiToken + ":api_token").toString("base64");
	let projects 

	await fetch(baseURL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": auth
		},
	})
	.then(response => response.json())
	.then(response => {
		console.log(response)
		projects = response
	})
	return projects
}

async function getWorkspaceID(): Promise<string> {
	const prefs: Preferences = getPreferenceValues()
	const baseURL = "https://api.track.toggl.com/api/v8/workspaces"
	const auth = "Basic " + new Buffer(prefs.apiToken + ":api_token").toString("base64");
	
	let workspaceID = ""

	await fetch(baseURL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": auth
		},
	})
	.then(response => response.json())
	.then(response => {
		workspaceID = response[0].id
	})
	return workspaceID
}


export { getProjects, getWorkspaceID }
