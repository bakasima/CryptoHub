import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a unique ticket number
export function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TKT-${timestamp}-${random}`.toUpperCase();
}

// Generate QR code data for a ticket
export function generateQRCodeData(ticketId: string, eventId: string, ticketNumber: string): string {
  return JSON.stringify({
    ticketId,
    eventId,
    ticketNumber,
    timestamp: Date.now()
  });
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format time for display
export function formatTime(timeString: string): string {
  return timeString;
}

export function generateEventLink(eventId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/event/${eventId}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

export function shareEvent(eventId: string, eventTitle: string): void {
  const eventLink = generateEventLink(eventId);
  
  if (navigator.share) {
    // Use native sharing if available (mobile devices)
    navigator.share({
      title: eventTitle,
      text: `Check out this crypto event: ${eventTitle}`,
      url: eventLink,
    }).catch((error) => {
      console.log('Error sharing:', error);
      // Fallback to copying link
      copyToClipboard(eventLink);
    });
  } else {
    // Fallback to copying link
    copyToClipboard(eventLink);
  }
}
