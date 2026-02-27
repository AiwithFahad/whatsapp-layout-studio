export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export interface Message {
  id: number;
  text: string;
  time: string;
  sent: boolean;
}

export const chats: Chat[] = [
  { id: 1, name: "Alice Johnson", avatar: "AJ", lastMessage: "Hey! How are you doing?", time: "10:30 AM", unread: 2, online: true },
  { id: 2, name: "Dev Team", avatar: "DT", lastMessage: "Build deployed successfully ✅", time: "9:45 AM", unread: 5, online: false },
  { id: 3, name: "Mom ❤️", avatar: "M", lastMessage: "Don't forget to eat lunch!", time: "9:12 AM", unread: 0, online: false },
  { id: 4, name: "David Park", avatar: "DP", lastMessage: "Let's catch up this weekend", time: "Yesterday", unread: 0, online: true },
  { id: 5, name: "Sarah Chen", avatar: "SC", lastMessage: "The presentation looks great 👍", time: "Yesterday", unread: 0, online: false },
  { id: 6, name: "Work Group", avatar: "WG", lastMessage: "Meeting at 3pm tomorrow", time: "Yesterday", unread: 1, online: false },
  { id: 7, name: "Mike Wilson", avatar: "MW", lastMessage: "Thanks for your help!", time: "Monday", unread: 0, online: false },
  { id: 8, name: "Emma Davis", avatar: "ED", lastMessage: "See you at the gym 💪", time: "Monday", unread: 0, online: true },
  { id: 9, name: "College Friends", avatar: "CF", lastMessage: "Who's coming to the reunion?", time: "Sunday", unread: 12, online: false },
  { id: 10, name: "Pizza Place 🍕", avatar: "PP", lastMessage: "Your order is on its way!", time: "Sunday", unread: 0, online: false },
];

export const messages: Message[] = [
  { id: 1, text: "Hey Alice! Long time no see 😊", time: "10:00 AM", sent: true },
  { id: 2, text: "Hi! I know right? How have you been?", time: "10:02 AM", sent: false },
  { id: 3, text: "Been good! Working on some exciting projects lately", time: "10:05 AM", sent: true },
  { id: 4, text: "That sounds amazing! Tell me more about it", time: "10:08 AM", sent: false },
  { id: 5, text: "It's a WhatsApp clone actually 😄 Building it with React and Tailwind", time: "10:12 AM", sent: true },
  { id: 6, text: "No way! That's so cool. How's it going?", time: "10:15 AM", sent: false },
  { id: 7, text: "Pretty well! The UI is coming together nicely. Dark mode looks 🔥", time: "10:18 AM", sent: true },
  { id: 8, text: "I'd love to see it when it's done!", time: "10:22 AM", sent: false },
  { id: 9, text: "Definitely! I'll share the link soon", time: "10:25 AM", sent: true },
  { id: 10, text: "Hey! How are you doing?", time: "10:30 AM", sent: false },
];
