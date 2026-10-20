import RestClient from "@/lib/Client/RESTClient.js";

const restClient = new RestClient();

/**
 * Create or update processing notes for a record.
 *
 * @param {number} idRecord - FAIRsharing record ID.
 * @param {string} notesText - Processing notes text.
 * @param {Object} item - Record object.
 * @param {string} token - Authentication token.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function saveProcessingNotes(idRecord, notesText, item, token) {
  try {
    let response;

    if (item.processingNoteId) {
      response = await restClient.updateProcessingNotes(
        item.processingNoteId,
        notesText,
        idRecord,
        token,
      );
    }
    else {
      response = await restClient.createProcessingNotes(
        notesText,
        idRecord,
        token,
      );
    }

    // Handle API and network errors
    const error = response?.error ?? response?.data?.error;

    if (error) {
      console.error("Failed to save processing notes:", error);

      return {
        success: false,
        error: `The processing notes for record ${item.recordName} could not be saved.`,
      };
    }

    // Ensure the API returned a response
    if (!response) {
      throw new Error("No response received from server");
    }

    // Update local state only after successful API response
    if (!item.processingNoteId) {
      const newId = response.data?.id ?? response.id;

      if (newId == null) {
        throw new Error("Processing note ID missing from server response");
      }

      item.processingNoteId = newId;
    }

    item.processingNotes = notesText;

    return {
      success: true,
    };
  }
  catch (error) {
    console.error("Unexpected error saving processing notes:", error);

    return {
      success: false,
      error: `The processing notes for record ${item.recordName} could not be saved.`,
    };
  }
}

/**
 * Delete processing notes for a record.
 *
 * @param {Object} item - Record object.
 * @param {string} token - Authentication token.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteProcessingNotes(item, token) {
  if (!item.processingNoteId) {
    item.processingNotes = "";

    return {
      success: true,
    };
  }

  try {
    const response = await restClient.deleteProcessingNote(
      item.processingNoteId,
      token,
    );

    // Handle API and network errors
    const error = response?.error ?? response?.data?.error;

    if (error) {
      console.error("Failed to delete processing note:", error);

      return {
        success: false,
        error: `The processing notes for record ${item.recordName} could not be deleted.`,
      };
    }

    // Ensure the API returned a response
    if (!response) {
      throw new Error("No response received from server");
    }

    // Clear local state only after successful deletion
    item.processingNotes = "";
    item.processingNoteId = null;

    return {
      success: true,
    };
  }
  catch (error) {
    console.error("Unexpected error deleting processing note:", error);

    return {
      success: false,
      error: `The processing notes for record ${item.recordName} could not be deleted.`,
    };
  }
}
