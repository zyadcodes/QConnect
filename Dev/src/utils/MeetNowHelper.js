export async function getMeetingLink(meetingName) {
  console.log("getting a link for meeting name: " + meetingName)
  const request = {
    method: "POST",
    body: JSON.stringify({ title: meetingName }),
    headers: { "content-type": "application/json" }
  };

  try {
    const response = await fetch(
      "http://api.join.skype.com/v1/meetnow/createjoinlinkguest",
      request
    );
    const responseJson = await response.json();
    return responseJson.joinLink;
  } catch (error) {
    console.log(`Error retrieving the meeting link: ${error}`);
  }
}
