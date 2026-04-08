import { waitlistService } from "@/lib/services/waitlistService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function PATCH(request, { params }) {
  try {
    const data = await request.json();
    const { action } = data;

    if (action === "book") {
      const result = await waitlistService.bookFromWaitlist(params.id, data);
      return corsResponse({
        message: "Booked from waitlist",
        appointment: result.appointment,
      });
    }

    return corsResponse({ error: "Invalid action" }, 400);
  } catch (error) {
    console.error("Error updating waitlist entry:", error);
    return corsResponse({ error: error.message || "Failed to update waitlist entry" }, 400);
  }
}

export async function DELETE(request, { params }) {
  try {
    await waitlistService.cancelWaitlist(params.id);
    return corsResponse({ message: "Waitlist entry cancelled" });
  } catch (error) {
    console.error("Error cancelling waitlist entry:", error);
    return corsResponse({ error: error.message || "Failed to cancel waitlist entry" }, 400);
  }
}
