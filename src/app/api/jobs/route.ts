import { mockJobs } from '@/lib/data';
import type { Job } from '@/lib/types';

export async function GET() {
  return Response.json(mockJobs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const requiredFields = ['title', 'company', 'location', 'salary', 'type', 'description', 'duration'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const id = Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    const newJob: Job = {
      id,
      title: body.title,
      company: body.company,
      location: body.location,
      salary: body.salary,
      type: body.type,
      description: body.description,
      duration: body.duration,
      workingPeriod: body.workingPeriod,
      contactPhone: body.contactPhone,
    };

    mockJobs.push(newJob);

    return Response.json(
      { success: true, id },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
