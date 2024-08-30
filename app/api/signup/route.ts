import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
      },
    });
    return NextResponse.json(user);
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return NextResponse.json({
          message:
            "There is a unique constraint violation, a new user cannot be created with this email",
        });
      }
    }
    return NextResponse.json({ message: e?.message });
  }
}
