import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import nodemailer from 'nodemailer'; // For sending email
import fs from 'fs'; // For email attachments
import path from 'path'; // For email attachments
import crypto from 'crypto'; // For HMAC SHA256 signature verification

const prismaClient = new PrismaClient();

// Shared secret for IPN signature verification (MUST be set in environment variables)
// const COPECART_IPN_SHARED_SECRET = process.env.COPECART_IPN_SHARED_SECRET; // This line seems to be shadowed by the one in the POST handler. Ensure correct one is used.

// Define a more specific type for orderData used in email
interface OrderDataForEmail {
  id: string;
  email: string;
  vorname: string;
  nachname: string;
  // Add other fields if sendConfirmationEmail uses them directly from orderData
}

// Helper function to send email (adapted from /api/send-email/route.ts)
async function sendConfirmationEmail(orderData: OrderDataForEmail) {
  const transporter = nodemailer.createTransport({
    host: "smtps.udag.de",
    port: 465,
    secure: true,
    auth: {
      user: "service@heizungsplakette.de",
      pass: "!BesterHelpdesk2024!!" // TODO: Use environment variables for sensitive data
    }
  });

  const userEmailHtml = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          h1 { color: #0066cc; }
        </style>
      </head>
      <body>
        <h1>Vielen Dank für Ihre Bestellung und Bezahlung der Heizungsplakette</h1>
        <p>Sehr geehrte(r) ${orderData.vorname} ${orderData.nachname},</p>
        <p>wir bestätigen hiermit den erfolgreichen Eingang Ihrer Zahlung für die Heizungsplakette (Bestellnummer: ${orderData.id}).</p>
        <p>Ihre Anfrage befindet sich nun in der finalen Bearbeitung. Die nächsten Schritte sind:</p>
        <ol>
          <li>Wir prüfen Ihre eingereichten Daten (falls noch nicht geschehen).</li>
          <li>Wir erstellen Ihre individuelle Heizungsplakette.</li>
          <li>Wir senden Ihnen die Heizungsplakette per E-Mail zu.</li>
        </ol>
        <p>Sollten Sie zwischenzeitlich Fragen haben, können Sie sich jederzeit an uns unter <a href="mailto:service@heizungsplakette.de">service@heizungsplakette.de</a> wenden.</p>
        <p>Wir bedanken uns für Ihr Vertrauen und wünschen Ihnen einen schönen Tag!</p>
        <p>Mit freundlichen Grüßen,<br>Ihr Team von Heizungsplakette.de</p>
      </body>
    </html>
  `;

  const serviceEmailHtml = `
    <html>
      <body>
        <h1>Zahlungseingang für Heizungsplakette (Bestellnummer: ${orderData.id})</h1>
        <p>Bestelldetails:</p>
        <pre>${JSON.stringify(orderData, null, 2)}</pre>
      </body>
    </html>`;

  const datenschutzhinweisPath = path.join(process.cwd(), 'public', 'Datenschutzhinweis.pdf');
  const nutzungsbedingungenPath = path.join(process.cwd(), 'public', 'Nutzungsbedingungen.pdf');

  try {
    await transporter.sendMail({
      from: '"Heizungsplakette Service" <service@heizungsplakette.de>',
      to: orderData.email,
      subject: `Zahlungsbestätigung für Ihre Heizungsplakette - Bestellnr. ${orderData.id}`,
      html: userEmailHtml,
      attachments: [
        { filename: 'Datenschutzhinweis.pdf', content: fs.createReadStream(datenschutzhinweisPath) },
        { filename: 'Nutzungsbedingungen.pdf', content: fs.createReadStream(nutzungsbedingungenPath) }
      ]
    });

    await transporter.sendMail({
      from: '"Heizungsplakette Service" <service@heizungsplakette.de>',
      to: "service@heizungsplakette.de", 
      subject: `Zahlungseingang für Bestellung ${orderData.id}`,
      html: serviceEmailHtml
    });
    console.log(`Confirmation emails sent for order ${orderData.id}`);
    return { success: true };
  } catch (error) {
    console.error(`Error sending confirmation emails for order ${orderData.id}:`, error);
    return { success: false, error: 'Confirmation email could not be sent' };
  }
}

export async function POST(request: NextRequest) {
  console.log("IPN Endpoint Hit: Received a request"); 

  const copecartSignature = request.headers.get("x-copecart-signature");
  const rawBody = await request.text(); 

  const headersObject: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headersObject[key] = value;
  });
  console.log("IPN Request Headers:", JSON.stringify(headersObject, null, 2)); 
  console.log("IPN Raw Body:", rawBody); 

  if (!copecartSignature) {
    console.error("IPN Error: Missing X-Copecart-Signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const sharedSecret = process.env.COPECART_IPN_SHARED_SECRET;
  if (!sharedSecret) {
    console.error("IPN Error: COPECART_IPN_SHARED_SECRET is not set in environment variables.");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const hmac = crypto.createHmac("sha256", sharedSecret);
    hmac.update(rawBody, "utf8"); 
    const calculatedSignature = hmac.digest("base64"); // Changed from 'hex' to 'base64'

    console.log("IPN Calculated Signature:", calculatedSignature); 
    console.log("IPN Received Signature:", copecartSignature); 

    if (calculatedSignature !== copecartSignature) {
      console.error("IPN Error: Invalid signature.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
    console.log("IPN Signature VERIFIED successfully."); 

    const body = JSON.parse(rawBody); 
    console.log("IPN Parsed Body:", JSON.stringify(body, null, 2)); 

    // ---- REVERT Temporary name-based matching ----
    /*
    const ipnFirstName = body.buyer_firstname;
    const ipnLastName = body.buyer_lastname;

    if (!ipnFirstName || typeof ipnFirstName !== 'string' || !ipnLastName || typeof ipnLastName !== 'string') {
      console.error("IPN Error: buyer_firstname or buyer_lastname is missing or not a string in IPN payload.", body);
      return NextResponse.json({ error: "Missing or invalid buyer name fields" }, { status: 400 });
    }

    const normalizedIpnFirstName = ipnFirstName.trim().toLowerCase();
    const normalizedIpnLastName = ipnLastName.trim().toLowerCase();
    console.log(`IPN: Normalized names for matching - First: '${normalizedIpnFirstName}', Last: '${normalizedIpnLastName}'`);
    */
    // ---- END REVERT ----

    // ---- NEW Order ID Logic using 'metadata' field ----
    // Log the metadata field to understand its structure first.
    console.log("IPN body.metadata value:", body.metadata); 

    // Assuming body.metadata directly contains the orderId string. Adjust if it's nested or an object.
    const vendorOrderId = body.metadata; 

    if (!vendorOrderId || typeof vendorOrderId !== 'string') {
      console.error("IPN Error: 'metadata' field is missing, not a string, or not the expected order ID in IPN payload.", body.metadata);
      // Still return 200 to acknowledge IPN, but log error. We can't process without a valid ID.
      return new NextResponse("OK - Metadata order ID missing or invalid", { status: 200 }); 
    }
    console.log("IPN Extracted Vendor Order ID (from metadata):", vendorOrderId); 
    // ---- END NEW Order ID Logic ----

    const eventType = body.event_type;
    console.log("IPN Event Type:", eventType); 

    if (eventType === "payment.made" || eventType === "payment.trial_made" || eventType === "payment.successful") {
      // ---- Use vendorOrderId for matching ----
      console.log(`IPN: Processing successful payment event '${eventType}' for order ID: '${vendorOrderId}'.`);
      
      const existingOrder = await prismaClient.heizungsplakette.findUnique({
        where: { 
          id: vendorOrderId // Match using the ID from metadata
        },
      });

      if (!existingOrder) {
        console.error(`IPN Error: Order with ID '${vendorOrderId}' (from metadata) not found.`);
        return new NextResponse("OK - Order not found", { status: 200 }); 
      }
      
      if (existingOrder.paymentStatus) {
        console.log(`IPN Info: Order ${vendorOrderId} already marked as paid. Skipping update.`);
        return new NextResponse("OK - Order already paid", { status: 200 });
      }

      console.log(`IPN: Attempting to update order ${vendorOrderId} paymentStatus to true and status to 'Bezahlt'.`);
      try {
        const updatedOrder = await prismaClient.heizungsplakette.update({
          where: { id: vendorOrderId }, // Use ID from metadata
          data: {
            paymentStatus: true,
            status: "Bezahlt", 
          },
        });
        console.log(`IPN: Successfully updated order ${updatedOrder.id}. New paymentStatus: ${updatedOrder.paymentStatus}, status: ${updatedOrder.status}`);

        await sendConfirmationEmail({ 
          id: updatedOrder.id,
          email: updatedOrder.email,
          vorname: updatedOrder.vorname, 
          nachname: updatedOrder.nachname,
        });
        console.log(`IPN: Confirmation email sent for order ${updatedOrder.id}.`);
      } catch (dbError) {
        console.error(`IPN DB Update Error for order ${vendorOrderId} (from metadata):`, dbError);
        // Still return 200 to CopeCart
      } // Removed an extra closing brace that seemed to be a typo from merge
    } else {
      console.log(`IPN Info: Received event_type '${eventType}'. No action taken for this event.`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("IPN - General Error processing request:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 