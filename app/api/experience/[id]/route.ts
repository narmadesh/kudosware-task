import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, id: { params: { id: number } }) {
  const body = await req.json();
  const experience = await prisma.userexperience.update({
    where: {
      id: Number(id.params.id),
    },
    data: {
      designation: body.designation,
      organization: body.organization,
      location: body.location,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      description: body.description,
    },
  });
  return NextResponse.json(experience);
}

export async function GET(req: NextRequest, id: { params: { id: number } }) {
  const experience = await prisma.userexperience.findFirstOrThrow({
    where: {
      id: Number(id.params.id),
    },
    include: {
      user: true,
    },
  });
  return NextResponse.json(experience);
}

export async function DELETE(req: NextRequest, id: { params: { id: number } }) {
  try {
    await prisma.userexperience.delete({
      where: {
        id: Number(id.params.id),
      },
    });
    return NextResponse.json({ ApiResponse: "Success" });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message });
  }
}
