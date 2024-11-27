import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connect from "@/lib/mongodb/mongoose";
import AttendanceSession from "@/lib/models/attendance.model";

export async function GET(request, context) {
  await connect();

  // Get session and check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { classId } = await context.params; // Await the params

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      let intervalId;
      let closed = false;

      const sendEvent = (data) => {
        try {
          if (controller && controller.desiredSize !== null) {
            const formattedEvent = `data: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(new TextEncoder().encode(formattedEvent));
          }
        } catch (error) {
          console.error("Error while sending event:", error);
        }
      };

      const watchAttendance = async () => {
        try {
          const activeSession = await AttendanceSession.findOne({
            class: classId,
            status: 'active',
          }).populate('attendees.student', 'name collegeId');

          if (activeSession) {
            sendEvent({
              type: 'attendance-update',
              attendees: activeSession.attendees.map((attendee) => ({
                name: attendee.student.name,
                collegeId: attendee.student.collegeId,
                markedAt: attendee.markedAt,
              })),
            });
          }
        } catch (error) {
          console.error('Streaming error:', error);
        }
      };

      watchAttendance();
      intervalId = setInterval(watchAttendance, 5000);

      controller.close = () => {
        closed = true;
        if (intervalId) clearInterval(intervalId);
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

