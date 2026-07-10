import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { customerName, customerEmail, date, time, partySize, restaurantName } = await req.json();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "Particle Bookings <onboarding@resend.dev>",
        to: customerEmail,
        subject: `Booking Confirmed - ${restaurantName}`,
        html: `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
          <h2 style="font-size: 20px; font-weight: 600; color: #18181B;">Booking Confirmed</h2>
          <p style="color: #71717A; font-size: 14px;">Hi ${customerName}, your table at ${restaurantName} is reserved.</p>
          <div style="background: #FAFAFA; border: 1px solid #E4E4E7; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="font-size: 14px; color: #71717A; margin: 0 0 8px;">Date: <strong style="color: #18181B;">${date}</strong></p>
            <p style="font-size: 14px; color: #71717A; margin: 0 0 8px;">Time: <strong style="color: #18181B;">${time}</strong></p>
            <p style="font-size: 14px; color: #71717A; margin: 0;">Guests: <strong style="color: #18181B;">${partySize}</strong></p>
          </div>
          <p style="color: #71717A; font-size: 13px;">See you soon - ${restaurantName}</p>
        </div>`,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    });
  }
});