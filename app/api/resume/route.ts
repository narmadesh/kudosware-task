import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  const resume = await prisma.userresume.findMany();
  return NextResponse.json({ ApiResponse: "Success", Data: resume });
}

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const f = body.get("file");
  const file = f as File;

  const fileArrayBuffer = await file.arrayBuffer();

  await fs.writeFile(
    "/tmp/" + file.name,
    Buffer.from(fileArrayBuffer)
  );
  const resume = await prisma.userresume.create({
    data: {
      name: file.name,
      userId: Number(body.get("userId")),
    },
  });
  return NextResponse.json(resume);
}
