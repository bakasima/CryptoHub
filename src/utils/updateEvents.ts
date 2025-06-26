import { supabase } from '@/integrations/supabase/client';

export const updateExistingEvents = async () => {
  try {
    console.log('Updating existing events with payment information...');
    
    // Get all existing events
    const { data: events, error: fetchError } = await supabase
      .from('events')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching events:', fetchError);
      return;
    }
    
    if (!events || events.length === 0) {
      console.log('No events found to update');
      return;
    }
    
    console.log(`Found ${events.length} events to update`);
    
    // Update each event with payment information
    for (const event of events) {
      // Skip if already has payment info
      if (event.is_paid !== null && event.price !== null) {
        console.log(`Event "${event.title}" already has payment info, skipping`);
        continue;
      }
      
      // Set default payment info based on event type
      let isPaid = false;
      let price = 0;
      let paymentCurrency = 'USD';
      let adminWalletAddress = null;
      
      // Make conferences and workshops paid events
      if (event.event_type === 'conference' || event.event_type === 'workshop') {
        isPaid = true;
        price = event.event_type === 'conference' ? 299.99 : 99.99;
        adminWalletAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      }
      
      // Update the event
      const { error: updateError } = await supabase
        .from('events')
        .update({
          is_paid: isPaid,
          price: price,
          payment_currency: paymentCurrency,
          admin_wallet_address: adminWalletAddress
        })
        .eq('id', event.id);
      
      if (updateError) {
        console.error(`Error updating event "${event.title}":`, updateError);
      } else {
        console.log(`Updated event "${event.title}" - Paid: ${isPaid}, Price: ${price} ${paymentCurrency}`);
      }
    }
    
    console.log('Finished updating events');
  } catch (error) {
    console.error('Error in updateExistingEvents:', error);
  }
}; 