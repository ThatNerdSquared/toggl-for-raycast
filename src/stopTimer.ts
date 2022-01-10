import { closeMainWindow, showHUD } from "@raycast/api"

export default async () => {
    await closeMainWindow()
    await showHUD(`Timer stopped! 🎉`)
}
