
import { Lead, LeadStatus, LeadPriority, Suggestion } from './types';

export const getApproachSuggestions = (lead: Lead): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  if (lead.status === LeadStatus.NEW) {
    suggestions.push({
      title: 'Immediate Welcome',
      description: 'Send an automated welcome message with a link to your portfolio or services list.',
      type: 'immediate'
    });
    suggestions.push({
      title: 'Quick Intro Call',
      description: 'Schedule a 5-minute introduction call to qualify their needs immediately.',
      type: 'immediate'
    });
  }

  if (lead.status === LeadStatus.IN_PROGRESS) {
    suggestions.push({
      title: 'Share Product Demo',
      description: 'Provide a personalized video demo or case study relevant to their industry.',
      type: 'nurture'
    });
    suggestions.push({
      title: 'Schedule Follow-up',
      description: 'The last activity was a while ago. A gentle nudge via WhatsApp or email is recommended.',
      type: 'nurture'
    });
  }

  if (lead.priority === LeadPriority.URGENT || lead.priority === LeadPriority.HIGH) {
    suggestions.push({
      title: 'Owner Involvement',
      description: 'Escalate to the business owner for a "Specialist" touch to increase trust.',
      type: 'escalation'
    });
    suggestions.push({
      title: 'Priority Support',
      description: 'Offer a direct line for any immediate questions to bypass standard queues.',
      type: 'escalation'
    });
  }

  if (lead.status === LeadStatus.LOST) {
    suggestions.push({
      title: 'Limited-Time Deal',
      description: 'Offer a 10% discount if they re-consider within the next 48 hours.',
      type: 'retention'
    });
    suggestions.push({
      title: 'Feedback Request',
      description: 'Ask for specific reasons for dropping to improve future sales processes.',
      type: 'retention'
    });
  }

  return suggestions;
};
