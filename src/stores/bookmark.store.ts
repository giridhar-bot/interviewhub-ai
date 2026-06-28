import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarkItem {
  entityType: string;
  entityId: string;
  title: string;
  href: string;
}

interface BookmarkState {
  bookmarks: BookmarkItem[];
  addBookmark: (item: BookmarkItem) => void;
  removeBookmark: (entityType: string, entityId: string) => void;
  isBookmarked: (entityType: string, entityId: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (item) =>
        set((s) => ({ bookmarks: [...s.bookmarks, item] })),
      removeBookmark: (entityType, entityId) =>
        set((s) => ({
          bookmarks: s.bookmarks.filter(
            (b) => !(b.entityType === entityType && b.entityId === entityId)
          ),
        })),
      isBookmarked: (entityType, entityId) =>
        get().bookmarks.some(
          (b) => b.entityType === entityType && b.entityId === entityId
        ),
    }),
    { name: "interviewhub-bookmarks" }
  )
);
