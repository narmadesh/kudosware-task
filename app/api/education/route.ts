import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const education = await prisma.usereducation.findMany();
    return NextResponse.json({ ApiResponse: 'Success', Data: education });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const education = await prisma.usereducation.create({
        data: {
            degree:body.degree,
            university:body.university,
            yearOfCompletion:body.yearOfCompletion,
            score:body.score,
            userId:Number(body.userId)
        },
    });
    return NextResponse.json(education);
}