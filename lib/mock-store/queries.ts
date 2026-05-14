import "server-only";

import type { ArtifactKind } from "@/components/chat/artifact";
import type { VisibilityType } from "@/components/chat/visibility-selector";
import type {
  Chat,
  DBMessage,
  Document,
  Stream,
  Suggestion,
  User,
  Vote,
} from "@/lib/domain-types";
import { generateHashedPassword } from "@/lib/password-utils";
import { generateUUID } from "@/lib/utils";

const DEFAULT_USER_ID = "00000000-0000-4000-8000-000000000001";
const DEFAULT_CHAT_ID = "00000000-0000-4000-8000-000000000101";
const DEFAULT_MESSAGE_ID = "00000000-0000-4000-8000-000000001001";
const DEFAULT_ASSISTANT_MESSAGE_ID = "00000000-0000-4000-8000-000000001002";
const DEFAULT_DOCUMENT_ID = "00000000-0000-4000-8000-000000002001";
const MOCK_PASSWORD = "password";

const createDate = (offsetMinutes = 0) =>
  new Date(Date.now() - offsetMinutes * 60 * 1000);

const users: User[] = [
  {
    id: DEFAULT_USER_ID,
    email: "guest-mock@example.com",
    password: generateHashedPassword(MOCK_PASSWORD),
    name: "Mock Guest",
    emailVerified: false,
    image: null,
    isAnonymous: true,
    createdAt: createDate(120),
    updatedAt: createDate(120),
  },
];

const chats: Chat[] = [
  {
    id: DEFAULT_CHAT_ID,
    createdAt: createDate(60),
    title: "Mock chat conversation",
    userId: DEFAULT_USER_ID,
    visibility: "private",
  },
];

const messages: DBMessage[] = [
  {
    id: DEFAULT_MESSAGE_ID,
    chatId: DEFAULT_CHAT_ID,
    role: "user",
    parts: [{ type: "text", text: "请介绍一下这个前端基座。" }],
    attachments: [],
    createdAt: createDate(58),
  },
  {
    id: DEFAULT_ASSISTANT_MESSAGE_ID,
    chatId: DEFAULT_CHAT_ID,
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "这是一个 Mock 会话，用来在没有数据库的情况下渲染 UI。",
      },
    ],
    attachments: [],
    createdAt: createDate(57),
  },
];

const votes: Vote[] = [];

const documents: Document[] = [
  {
    id: DEFAULT_DOCUMENT_ID,
    createdAt: createDate(45),
    title: "Mock document",
    content: "这是一份模拟文档内容，用于无数据库开发模式。",
    kind: "text",
    userId: DEFAULT_USER_ID,
  },
];

const suggestions: Suggestion[] = [];
const streams: Stream[] = [];

function ensureUserSeedData(userId: string) {
  if (chats.some((chat) => chat.userId === userId)) {
    return;
  }

  const chatId = generateUUID();
  chats.unshift({
    id: chatId,
    createdAt: new Date(),
    title: "Mock welcome chat",
    userId,
    visibility: "private",
  });
  messages.push(
    {
      id: generateUUID(),
      chatId,
      role: "user",
      parts: [{ type: "text", text: "这是一个无需数据库的本地开发会话。" }],
      attachments: [],
      createdAt: createDate(2),
    },
    {
      id: generateUUID(),
      chatId,
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "当前数据来自内存 Mock，刷新或重启服务后会重置。",
        },
      ],
      attachments: [],
      createdAt: createDate(1),
    }
  );
}

function sortByCreatedAtDesc(left: Chat, right: Chat) {
  return right.createdAt.getTime() - left.createdAt.getTime();
}

function sortByCreatedAtAsc<T extends { createdAt: Date }>(left: T, right: T) {
  return left.createdAt.getTime() - right.createdAt.getTime();
}

async function waitForMockStore() {
  await Promise.resolve();
}

export async function getUser(email: string): Promise<User[]> {
  await waitForMockStore();
  return users.filter((user) => user.email === email);
}

export async function createUser(email: string, password: string) {
  await waitForMockStore();
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return [existingUser];
  }

  const newUser: User = {
    id: generateUUID(),
    email,
    password: generateHashedPassword(password),
    name: null,
    emailVerified: false,
    image: null,
    isAnonymous: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(newUser);
  ensureUserSeedData(newUser.id);
  return [newUser];
}

export async function createGuestUser() {
  await waitForMockStore();
  const guestUser: User = {
    id: generateUUID(),
    email: `guest-${Date.now()}`,
    password: generateHashedPassword(generateUUID()),
    name: "Mock Guest",
    emailVerified: false,
    image: null,
    isAnonymous: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(guestUser);
  ensureUserSeedData(guestUser.id);

  return [{ id: guestUser.id, email: guestUser.email }];
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  await waitForMockStore();
  const existingChat = chats.find((chat) => chat.id === id);

  if (existingChat) {
    existingChat.title = title;
    existingChat.visibility = visibility;
    return [existingChat];
  }

  const newChat: Chat = {
    id,
    createdAt: new Date(),
    userId,
    title,
    visibility,
  };

  chats.unshift(newChat);
  return [newChat];
}

export async function deleteChatById({ id }: { id: string }) {
  await waitForMockStore();
  const chatIndex = chats.findIndex((chat) => chat.id === id);

  if (chatIndex === -1) {
    return undefined;
  }

  const [deletedChat] = chats.splice(chatIndex, 1);
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].chatId === id) {
      messages.splice(index, 1);
    }
  }
  for (let index = votes.length - 1; index >= 0; index -= 1) {
    if (votes[index].chatId === id) {
      votes.splice(index, 1);
    }
  }
  for (let index = streams.length - 1; index >= 0; index -= 1) {
    if (streams[index].chatId === id) {
      streams.splice(index, 1);
    }
  }

  return deletedChat;
}

export async function deleteAllChatsByUserId({ userId }: { userId: string }) {
  await waitForMockStore();
  const userChatIds = new Set(
    chats.filter((chat) => chat.userId === userId).map((chat) => chat.id)
  );
  const deletedCount = userChatIds.size;

  for (let index = chats.length - 1; index >= 0; index -= 1) {
    if (userChatIds.has(chats[index].id)) {
      chats.splice(index, 1);
    }
  }
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (userChatIds.has(messages[index].chatId)) {
      messages.splice(index, 1);
    }
  }
  for (let index = votes.length - 1; index >= 0; index -= 1) {
    if (userChatIds.has(votes[index].chatId)) {
      votes.splice(index, 1);
    }
  }

  return { deletedCount };
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  await waitForMockStore();
  ensureUserSeedData(id);

  const sortedChats = chats
    .filter((chat) => chat.userId === id)
    .sort(sortByCreatedAtDesc);
  let startIndex = 0;

  if (startingAfter) {
    const cursorIndex = sortedChats.findIndex(
      (chat) => chat.id === startingAfter
    );
    startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
  } else if (endingBefore) {
    const cursorIndex = sortedChats.findIndex(
      (chat) => chat.id === endingBefore
    );
    startIndex = cursorIndex >= 0 ? Math.max(cursorIndex - limit, 0) : 0;
  }

  const page = sortedChats.slice(startIndex, startIndex + limit);

  return {
    chats: page,
    hasMore: startIndex + limit < sortedChats.length,
  };
}

export async function getChatById({ id }: { id: string }) {
  await waitForMockStore();
  return chats.find((chat) => chat.id === id) ?? null;
}

export async function saveMessages({
  messages: nextMessages,
}: {
  messages: DBMessage[];
}) {
  await waitForMockStore();
  for (const nextMessage of nextMessages) {
    const index = messages.findIndex(
      (message) => message.id === nextMessage.id
    );

    if (index >= 0) {
      messages[index] = nextMessage;
    } else {
      messages.push(nextMessage);
    }
  }

  return nextMessages;
}

export async function updateMessage({
  id,
  parts,
}: {
  id: string;
  parts: DBMessage["parts"];
}) {
  await waitForMockStore();
  const selectedMessage = messages.find((message) => message.id === id);

  if (selectedMessage) {
    selectedMessage.parts = parts;
  }

  return selectedMessage ? [selectedMessage] : [];
}

export async function getMessagesByChatId({ id }: { id: string }) {
  await waitForMockStore();
  return messages
    .filter((message) => message.chatId === id)
    .sort(sortByCreatedAtAsc);
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  await waitForMockStore();
  const existingVote = votes.find(
    (vote) => vote.chatId === chatId && vote.messageId === messageId
  );

  if (existingVote) {
    existingVote.isUpvoted = type === "up";
    return [existingVote];
  }

  const newVote: Vote = {
    chatId,
    messageId,
    isUpvoted: type === "up",
  };

  votes.push(newVote);
  return [newVote];
}

export async function getVotesByChatId({ id }: { id: string }) {
  await waitForMockStore();
  return votes.filter((vote) => vote.chatId === id);
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  await waitForMockStore();
  const newDocument: Document = {
    id,
    title,
    kind,
    content,
    userId,
    createdAt: new Date(),
  };

  documents.push(newDocument);
  return [newDocument];
}

export async function updateDocumentContent({
  id,
  content,
}: {
  id: string;
  content: string;
}) {
  await waitForMockStore();
  const latestDocument = documents
    .filter((document) => document.id === id)
    .sort(
      (left, right) => right.createdAt.getTime() - left.createdAt.getTime()
    )[0];

  if (!latestDocument) {
    return [];
  }

  latestDocument.content = content;
  return [latestDocument];
}

export async function getDocumentsById({ id }: { id: string }) {
  await waitForMockStore();
  return documents
    .filter((document) => document.id === id)
    .sort(sortByCreatedAtAsc);
}

export async function getDocumentById({ id }: { id: string }) {
  await waitForMockStore();
  return documents
    .filter((document) => document.id === id)
    .sort(
      (left, right) => right.createdAt.getTime() - left.createdAt.getTime()
    )[0];
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  await waitForMockStore();
  const deletedDocuments: Document[] = [];

  for (let index = documents.length - 1; index >= 0; index -= 1) {
    const currentDocument = documents[index];

    if (
      currentDocument.id === id &&
      currentDocument.createdAt.getTime() > timestamp.getTime()
    ) {
      deletedDocuments.push(...documents.splice(index, 1));
    }
  }

  for (let index = suggestions.length - 1; index >= 0; index -= 1) {
    const currentSuggestion = suggestions[index];

    if (
      currentSuggestion.documentId === id &&
      currentSuggestion.documentCreatedAt.getTime() > timestamp.getTime()
    ) {
      suggestions.splice(index, 1);
    }
  }

  return deletedDocuments;
}

export async function saveSuggestions({
  suggestions: nextSuggestions,
}: {
  suggestions: Suggestion[];
}) {
  await waitForMockStore();
  suggestions.push(...nextSuggestions);
  return nextSuggestions;
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  await waitForMockStore();
  return suggestions.filter(
    (suggestion) => suggestion.documentId === documentId
  );
}

export async function getMessageById({ id }: { id: string }) {
  await waitForMockStore();
  return messages.filter((message) => message.id === id);
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  await waitForMockStore();
  const deletedMessages: DBMessage[] = [];
  const deletedMessageIds = new Set<string>();

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const currentMessage = messages[index];

    if (
      currentMessage.chatId === chatId &&
      currentMessage.createdAt.getTime() >= timestamp.getTime()
    ) {
      deletedMessageIds.add(currentMessage.id);
      deletedMessages.push(...messages.splice(index, 1));
    }
  }

  for (let index = votes.length - 1; index >= 0; index -= 1) {
    if (
      votes[index].chatId === chatId &&
      deletedMessageIds.has(votes[index].messageId)
    ) {
      votes.splice(index, 1);
    }
  }

  return deletedMessages;
}

export async function updateChatVisibilityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) {
  await waitForMockStore();
  const selectedChat = chats.find((chat) => chat.id === chatId);

  if (selectedChat) {
    selectedChat.visibility = visibility;
  }

  return selectedChat ? [selectedChat] : [];
}

export async function updateChatTitleById({
  chatId,
  title,
}: {
  chatId: string;
  title: string;
}) {
  await waitForMockStore();
  const selectedChat = chats.find((chat) => chat.id === chatId);

  if (selectedChat) {
    selectedChat.title = title;
  }

  return selectedChat ? [selectedChat] : undefined;
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  await waitForMockStore();
  const cutoffTime = Date.now() - differenceInHours * 60 * 60 * 1000;
  const userChatIds = new Set(
    chats.filter((chat) => chat.userId === id).map((chat) => chat.id)
  );

  return messages.filter(
    (message) =>
      userChatIds.has(message.chatId) &&
      message.role === "user" &&
      message.createdAt.getTime() >= cutoffTime
  ).length;
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  await waitForMockStore();
  streams.push({
    id: streamId,
    chatId,
    createdAt: new Date(),
  });
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  await waitForMockStore();
  return streams
    .filter((stream) => stream.chatId === chatId)
    .sort(sortByCreatedAtAsc)
    .map((stream) => stream.id);
}
