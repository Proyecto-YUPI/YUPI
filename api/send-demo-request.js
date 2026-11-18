import { replyJson, sendDemoRequest } from '../server/send-demo-request.js';

export default async function handler(request, response) {
  const result = await sendDemoRequest(request);
  replyJson(response, result.status, result.body);
}
