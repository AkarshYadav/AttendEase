import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const email = payload.data.email_addresses[0]?.email_address;
    const googleProfileUsername = payload.data.username; // From Google if provided
    const generatedUsername = email.split('@')[0]; // Default to email prefix if no username is provided

    await prisma.user.create({
      data: {
        externalUserId: payload.data.id,
        email: email,
        username: googleProfileUsername || generatedUsername, // Use Google username or fallback to generated one
        imageUrl: payload.data.image_url,
      },
    });
  }

  if (eventType === 'user.updated') {
    await prisma.user.update({
      where: {
        externalUserId: payload.data.id,
      },
      data: {
        email: payload.data.email_addresses[0]?.email_address,
        username: payload.data.username || payload.data.email_addresses[0]?.email_address.split('@')[0],
        imageUrl: payload.data.image_url,
      },
    });
  }

  if (eventType === 'user.deleted') {
    await prisma.user.delete({
      where: {
        externalUserId: payload.data.id,
      },
    });
  }

  return new Response('', { status: 200 });
}
