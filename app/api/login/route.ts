import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (user) {
      const valid = await bcrypt.compare(body.password, user?.password!);
      if(valid)
      {
        return NextResponse.json(user);
      }
      return NextResponse.json({ message: "Invalid email or password" });
    }
    return NextResponse.json({ message: "Invalid email or password" });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message });
  }
}
