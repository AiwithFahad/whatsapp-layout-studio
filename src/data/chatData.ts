import aliceAvatar from "@/assets/avatars/alice.png";
import davidAvatar from "@/assets/avatars/david.png";
import momAvatar from "@/assets/avatars/mom.png";
import rehanAvatar from "@/assets/avatars/rehan.png";
import sarahAvatar from "@/assets/avatars/sarah.png";
import devteamAvatar from "@/assets/avatars/devteam.png";
import mikeAvatar from "@/assets/avatars/mike.png";
import emmaAvatar from "@/assets/avatars/emma.png";
import collegeAvatar from "@/assets/avatars/college.png";
import workgroupAvatar from "@/assets/avatars/workgroup.png";
import pizzaAvatar from "@/assets/avatars/pizza.png";

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  typing?: boolean;
  isGroup?: boolean;
}

export interface Message {
  id: number;
  text: string;
  time: string;
  sent: boolean;
}

export const initialChats: Chat[] = [
  { id: 1, name: "Alice Johnson", avatar: aliceAvatar, lastMessage: "Hey! How are you doing? 😊", time: "10:30 AM", unread: 2, online: true, typing: false },
  { id: 2, name: "Dev Team", avatar: devteamAvatar, lastMessage: "Build deployed successfully ✅", time: "9:45 AM", unread: 5, online: false, isGroup: true },
  { id: 3, name: "Mom ❤️", avatar: momAvatar, lastMessage: "Don't forget to eat lunch, beta!", time: "9:12 AM", unread: 0, online: false },
  { id: 4, name: "David Park", avatar: davidAvatar, lastMessage: "Let's catch up this weekend 🎉", time: "Yesterday", unread: 0, online: true },
  { id: 5, name: "Sarah Chen", avatar: sarahAvatar, lastMessage: "The presentation looks great 👍", time: "Yesterday", unread: 0, online: false },
  { id: 6, name: "Work Group", avatar: workgroupAvatar, lastMessage: "Meeting at 3pm tomorrow", time: "Yesterday", unread: 1, online: false, isGroup: true },
  { id: 7, name: "Rehan Ahmed", avatar: rehanAvatar, lastMessage: "Check out this new design! 🎨", time: "Monday", unread: 3, online: true },
  { id: 8, name: "Mike Wilson", avatar: mikeAvatar, lastMessage: "Thanks for your help!", time: "Monday", unread: 0, online: false },
  { id: 9, name: "Emma Davis", avatar: emmaAvatar, lastMessage: "See you at the gym 💪", time: "Monday", unread: 0, online: true },
  { id: 10, name: "College Friends", avatar: collegeAvatar, lastMessage: "Who's coming to the reunion?", time: "Sunday", unread: 12, online: false, isGroup: true },
  { id: 11, name: "Pizza Place 🍕", avatar: pizzaAvatar, lastMessage: "Your order is on its way!", time: "Sunday", unread: 0, online: false },
];

export const initialMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Hey Alice! Long time no see 😊", time: "10:00 AM", sent: true },
    { id: 2, text: "Hi! I know right? How have you been?", time: "10:02 AM", sent: false },
    { id: 3, text: "Been great! Working on some exciting projects lately.", time: "10:05 AM", sent: true },
    { id: 4, text: "That sounds amazing! Tell me more about it 🤩", time: "10:08 AM", sent: false },
    { id: 5, text: "It's a premium messaging app called GhupShup!", time: "10:12 AM", sent: true },
    { id: 6, text: "No way! That's so cool. I love the name 😄", time: "10:15 AM", sent: false },
    { id: 7, text: "Thanks! The UI is coming together beautifully 🔥", time: "10:18 AM", sent: true },
    { id: 8, text: "I'd love to see it when it's done!", time: "10:22 AM", sent: false },
    { id: 9, text: "Absolutely! I'll share the live link soon 🚀", time: "10:25 AM", sent: true },
    { id: 10, text: "Hey! How are you doing? 😊", time: "10:30 AM", sent: false },
  ],
  2: [
    { id: 1, text: "Pipeline running for v2.3.1", time: "9:30 AM", sent: false },
    { id: 2, text: "All tests passed ✅", time: "9:35 AM", sent: false },
    { id: 3, text: "Great work team! 🎉", time: "9:38 AM", sent: true },
    { id: 4, text: "Build deployed successfully ✅", time: "9:45 AM", sent: false },
  ],
  3: [
    { id: 1, text: "Good morning Mom! ☀️", time: "8:30 AM", sent: true },
    { id: 2, text: "Good morning beta! Did you sleep well?", time: "8:45 AM", sent: false },
    { id: 3, text: "Yes, slept great! Heading to work now", time: "9:00 AM", sent: true },
    { id: 4, text: "Don't forget to eat lunch, beta!", time: "9:12 AM", sent: false },
  ],
  4: [
    { id: 1, text: "Hey David! How's it going?", time: "Yesterday", sent: true },
    { id: 2, text: "Pretty good! Been busy with work", time: "Yesterday", sent: false },
    { id: 3, text: "Same here. We should catch up!", time: "Yesterday", sent: true },
    { id: 4, text: "Let's catch up this weekend 🎉", time: "Yesterday", sent: false },
  ],
  5: [
    { id: 1, text: "Here's the updated presentation", time: "Yesterday", sent: true },
    { id: 2, text: "The presentation looks great 👍", time: "Yesterday", sent: false },
  ],
  6: [
    { id: 1, text: "Team sync at 3pm tomorrow", time: "Yesterday", sent: false },
    { id: 2, text: "I'll be there!", time: "Yesterday", sent: true },
    { id: 3, text: "Meeting at 3pm tomorrow", time: "Yesterday", sent: false },
  ],
  7: [
    { id: 1, text: "Rehan! Check this out", time: "Monday", sent: false },
    { id: 2, text: "Whoa, that design is fire 🔥", time: "Monday", sent: true },
    { id: 3, text: "Check out this new design! 🎨", time: "Monday", sent: false },
  ],
  8: [
    { id: 1, text: "Hey Mike, can you review this PR?", time: "Monday", sent: true },
    { id: 2, text: "Sure thing! Looks good to me", time: "Monday", sent: false },
    { id: 3, text: "Thanks for your help!", time: "Monday", sent: false },
  ],
  9: [
    { id: 1, text: "Gym at 6pm today?", time: "Monday", sent: true },
    { id: 2, text: "See you at the gym 💪", time: "Monday", sent: false },
  ],
  10: [
    { id: 1, text: "Reunion is next month! 🎓", time: "Sunday", sent: false },
    { id: 2, text: "I'm definitely coming!", time: "Sunday", sent: true },
    { id: 3, text: "Who's coming to the reunion?", time: "Sunday", sent: false },
  ],
  11: [
    { id: 1, text: "Order #4521 confirmed 🍕", time: "Sunday", sent: false },
    { id: 2, text: "Your order is on its way!", time: "Sunday", sent: false },
  ],
};
