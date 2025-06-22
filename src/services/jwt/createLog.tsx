import axios from "axios";

const webhookUrl = "https://discord.com/api/webhooks/1368915099082817536/5KzYwHke95Fo_YZFVQexh3v09zdwGCLwSlIDieDoWHhCztgkJ2I4JJpKw5LtFNdyc-VC";

const createLog = async (message: string) => {
  try {
    await axios.post(webhookUrl, {
      content: message.split(".").join(".\n"),
    });
    console.log("Message sent to Discord");
  } catch (error: any) {
    console.error("Failed to send message:", error.message);
  }
};

export default createLog;
