export const sendSMSNotification = async (userId: string, content: string) => {
  console.log("SMS to:", userId, "Message:", content);
  return true;
};
