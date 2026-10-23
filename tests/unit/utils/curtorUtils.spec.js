import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  deleteProcessingNotes,
  saveProcessingNotes,
} from "@/utils/curatorUtils.js";

// Mock RESTClient methods before module initialization
const {
  mockCreateProcessingNotes,
  mockUpdateProcessingNotes,
  mockDeleteProcessingNote,
} = vi.hoisted(() => ({
  mockCreateProcessingNotes: vi.fn(),
  mockUpdateProcessingNotes: vi.fn(),
  mockDeleteProcessingNote: vi.fn(),
}));

vi.mock("@/lib/Client/RESTClient.js", () => ({
  default: vi.fn().mockImplementation(function () {
    return {
      createProcessingNotes: mockCreateProcessingNotes,
      updateProcessingNotes: mockUpdateProcessingNotes,
      deleteProcessingNote: mockDeleteProcessingNote,
    };
  }),
}));

describe("curatorUtils.js", () => {
  const token = "test-token";

  const saveError =
    "The processing notes for record Test Record could not be saved.";

  const deleteError =
    "The processing notes for record Test Record could not be deleted.";

  let item;
  let consoleSpy;

  beforeEach(() => {
    // Reset mocks without removing the RestClient constructor implementation
    mockCreateProcessingNotes.mockReset();
    mockUpdateProcessingNotes.mockReset();
    mockDeleteProcessingNote.mockReset();

    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    item = {
      id: 123,
      recordName: "Test Record",
      processingNoteId: null,
      processingNotes: "",
    };
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // --------------------------------------------------
  // SAVE PROCESSING NOTES
  // --------------------------------------------------

  describe("saveProcessingNotes", () => {
    it("creates new processing notes successfully", async () => {
      mockCreateProcessingNotes.mockResolvedValue({ id: 10 });

      const result = await saveProcessingNotes(item, "New note", token);

      expect(mockCreateProcessingNotes).toHaveBeenCalledWith(
        "New note",
        item.id,
        token,
      );

      expect(mockUpdateProcessingNotes).not.toHaveBeenCalled();

      expect(item.processingNoteId).toBe(10);
      expect(item.processingNotes).toBe("New note");
      expect(result).toEqual({ success: true });
    });

    it("updates existing processing notes successfully", async () => {
      item.processingNoteId = 10;
      item.processingNotes = "Old note";

      mockUpdateProcessingNotes.mockResolvedValue({ success: true });

      const result = await saveProcessingNotes(item, "Updated note", token);

      expect(mockUpdateProcessingNotes).toHaveBeenCalledWith(
        10,
        "Updated note",
        item.id,
        token,
      );

      expect(mockCreateProcessingNotes).not.toHaveBeenCalled();

      expect(item.processingNoteId).toBe(10);
      expect(item.processingNotes).toBe("Updated note");
      expect(result).toEqual({ success: true });
    });

    it("handles nested response data when creating notes", async () => {
      mockCreateProcessingNotes.mockResolvedValue({
        data: { id: 20 },
      });

      const result = await saveProcessingNotes(item, "New note", token);

      expect(result).toEqual({ success: true });
      expect(item.processingNoteId).toBe(20);
      expect(item.processingNotes).toBe("New note");
    });

    it.each([
      {
        name: "direct API error",
        response: { error: new Error("API error") },
      },
      {
        name: "nested API error",
        response: { data: { error: new Error("API error") } },
      },
    ])("handles $name without modifying notes", async ({ response }) => {
      mockCreateProcessingNotes.mockResolvedValue(response);

      const result = await saveProcessingNotes(item, "New note", token);

      expect(result).toEqual({
        success: false,
        error: saveError,
      });

      expect(item.processingNoteId).toBeNull();
      expect(item.processingNotes).toBe("");
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("preserves existing notes when update fails", async () => {
      item.processingNoteId = 10;
      item.processingNotes = "Original note";

      mockUpdateProcessingNotes.mockResolvedValue({
        error: new Error("Server error"),
      });

      const result = await saveProcessingNotes(item, "Updated note", token);

      expect(result).toEqual({
        success: false,
        error: saveError,
      });

      expect(mockUpdateProcessingNotes).toHaveBeenCalledWith(
        10,
        "Updated note",
        item.id,
        token,
      );

      expect(item.processingNoteId).toBe(10);
      expect(item.processingNotes).toBe("Original note");
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("handles network errors when creating notes", async () => {
      mockCreateProcessingNotes.mockRejectedValue(new Error("Network Error"));

      const result = await saveProcessingNotes(item, "New note", token);

      expect(result).toEqual({
        success: false,
        error: saveError,
      });

      expect(item.processingNoteId).toBeNull();
      expect(item.processingNotes).toBe("");
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("handles network errors when updating notes", async () => {
      item.processingNoteId = 10;
      item.processingNotes = "Original note";

      mockUpdateProcessingNotes.mockRejectedValue(new Error("Network Error"));

      const result = await saveProcessingNotes(item, "Updated note", token);

      expect(result).toEqual({
        success: false,
        error: saveError,
      });

      expect(item.processingNoteId).toBe(10);
      expect(item.processingNotes).toBe("Original note");
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("handles missing API response", async () => {
      mockCreateProcessingNotes.mockResolvedValue(undefined);

      const result = await saveProcessingNotes(item, "New note", token);

      expect(result).toEqual({
        success: false,
        error: saveError,
      });

      expect(item.processingNoteId).toBeNull();
      expect(item.processingNotes).toBe("");
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("handles missing processing note ID", async () => {
      mockCreateProcessingNotes.mockResolvedValue({});

      const result = await saveProcessingNotes(item, "New note", token);

      expect(result).toEqual({
        success: false,
        error: saveError,
      });

      expect(item.processingNoteId).toBeNull();
      expect(item.processingNotes).toBe("");
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------
  // DELETE PROCESSING NOTES
  // --------------------------------------------------

  describe("deleteProcessingNotes", () => {
    beforeEach(() => {
      item.processingNoteId = 10;
      item.processingNotes = "Existing note";
    });

    it("deletes processing notes successfully", async () => {
      mockDeleteProcessingNote.mockResolvedValue({ success: true });

      const result = await deleteProcessingNotes(item, token);

      expect(mockDeleteProcessingNote).toHaveBeenCalledWith(10, token);

      expect(item.processingNotes).toBe("");
      expect(item.processingNoteId).toBeNull();
      expect(result).toEqual({ success: true });
    });

    it("clears notes without API call when no note ID exists", async () => {
      item.processingNoteId = null;

      const result = await deleteProcessingNotes(item, token);

      expect(result).toEqual({ success: true });
      expect(item.processingNotes).toBe("");
      expect(item.processingNoteId).toBeNull();
      expect(mockDeleteProcessingNote).not.toHaveBeenCalled();
    });

    it.each([
      {
        name: "direct API error",
        response: { error: new Error("API error") },
      },
      {
        name: "nested API error",
        response: { data: { error: new Error("API error") } },
      },
    ])("handles $name without deleting notes", async ({ response }) => {
      mockDeleteProcessingNote.mockResolvedValue(response);

      const result = await deleteProcessingNotes(item, token);

      expect(result).toEqual({
        success: false,
        error: deleteError,
      });

      expect(item.processingNoteId).toBe(10);
      expect(item.processingNotes).toBe("Existing note");
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("handles network errors", async () => {
      mockDeleteProcessingNote.mockRejectedValue(new Error("Network Error"));

      const result = await deleteProcessingNotes(item, token);

      expect(result).toEqual({
        success: false,
        error: deleteError,
      });

      expect(item.processingNoteId).toBe(10);
      expect(item.processingNotes).toBe("Existing note");
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("handles missing API response", async () => {
      mockDeleteProcessingNote.mockResolvedValue(undefined);

      const result = await deleteProcessingNotes(item, token);

      expect(result).toEqual({
        success: false,
        error: deleteError,
      });

      expect(item.processingNoteId).toBe(10);
      expect(item.processingNotes).toBe("Existing note");
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
