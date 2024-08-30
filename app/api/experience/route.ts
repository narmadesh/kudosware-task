import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const experience = await prisma.userexperience.findMany();
  return NextResponse.json({ ApiResponse: "Success", Data: experience });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const experience = await prisma.userexperience.create({
    data: {
      designation: body.designation,
      organization: body.organization,
      location: body.location,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      description: body.description,
      userId: Number(body.userId),
    },
  });
  return NextResponse.json(experience);
}
