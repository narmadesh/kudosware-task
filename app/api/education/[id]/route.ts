import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(req: NextRequest, id: { params: { id: number } }) {
    const body = await req.json();
    const education = await prisma.usereducation.update({
        where: {
            id: Number(id.params.id),
        },
        data: {
            degree:body.degree,
            university:body.university,
            yearOfCompletion:body.yearOfCompletion,
            score:body.score,
        },
    })
    return NextResponse.json(education)
}

export async function GET(req: NextRequest, id: { params: { id: number } }) {
    const education = await prisma.usereducation.findFirstOrThrow({
        where: {
            id: Number(id.params.id)
        },
        include: {
            user: true
        }
    })
    return NextResponse.json(education)
}

export async function DELETE(req: NextRequest, id: { params: { id: number } }) {
    try{
        await prisma.usereducation.delete({
            where: {
                id: Number(id.params.id)
            },
        })
        return NextResponse.json({ ApiResponse: 'Success' })
    }
    catch(e:any)
    {
        return NextResponse.json({ message: e?.message });
    }
}