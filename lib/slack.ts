import { WebClient } from "@slack/web-api";

const slackUserToken = process.env.SLACK_USER_TOKEN || "";
const slackBotToken = process.env.SLACK_BOT_TOKEN || "";

export const slack = new WebClient(slackUserToken);
