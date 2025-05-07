import axios from "axios";
import { getMessaging, getToken } from "firebase/messaging";

const subscribeToTopic = async (token: string, topic: string) => {
  const messaging = getMessaging();
    try {
      const token = await getToken(messaging, { vapidKey: 'BNOqMNcX3bBmJyw0m5lOBvDmcTvGCnnJlVJGGCRJ3vov_hcHwPJRK-bfrmILh7U9Q2btT1g7OrHPwujpJgESfAI' });
      const response = await axios.post('https://dashboardapi.duvdu.com/api/notification/users', {
          to: `/topics/${topic}`,
          registration_tokens: [token],
        })
      console.log('Subscription response:', response.data);
    } catch (error) {
      console.error('Error subscribing to topic:', error);
    }
  };
  
  export default subscribeToTopic;
  