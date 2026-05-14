/**
 * Domain row shapes persisted by the BFF mock store (no ORM).
 */

export type User = {
  id: string;
  email: string;
  password: string | null;
  name: string | null;
  emailVerified: boolean;
  image: string | null;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Chat = {
  id: string;
  createdAt: Date;
  title: string;
  userId: string;
  visibility: "public" | "private";
};

/** Persisted chat message row — JSON columns match prior DB shape. */
export type DBMessage = {
  id: string;
  chatId: string;
  role: string;
  parts: unknown;
  attachments: unknown;
  createdAt: Date;
};

export type Vote = {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
};

export type DocumentArtifactKind = "text" | "code" | "image" | "sheet";

export type Document = {
  id: string;
  createdAt: Date;
  title: string;
  content: string | null;
  kind: DocumentArtifactKind;
  userId: string;
};

export type Suggestion = {
  id: string;
  documentId: string;
  documentCreatedAt: Date;
  originalText: string;
  suggestedText: string;
  description: string | null;
  isResolved: boolean;
  userId: string;
  createdAt: Date;
};

export type Stream = {
  id: string;
  chatId: string;
  createdAt: Date;
};
