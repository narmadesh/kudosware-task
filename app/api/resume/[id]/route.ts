import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function DELETE(req: NextRequest, id: { params: { id: number } }) {
  try {
    const resume = await prisma.userresume.findFirstOrThrow({
      where: {
        id: Number(id.params.id),
      },
      include: {
        user: true,
      },
    });
    const destinationDirPath = path.join(process.cwd(), "public/upload");
    fs.unlinkSync(path.join(destinationDirPath, resume.name));
    await prisma.userresume.delete({
      where: {
        id: Number(id.params.id),
      },
    });
    return NextResponse.json({ ApiResponse: "Success" });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message });
  }
}
