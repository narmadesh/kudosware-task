"use client"
import { FormEvent, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/input";
import Button from "@/components/button";
import toast from 'react-hot-toast';
import Header from "@/components/header";
import Modal from "@/components/modal";
import { Resume } from "@/schemas/resume";

export default function UserResume() {
    const { data: session } = useSession()
    const [state, setState] = useState(false);
    const [resumes, setResumes] = useState([]);
    const [resume, setResume] = useState<Resume>();
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState("add");
    const [id, setId] = useState<number | null>(null);
    const saveFormRef = useRef<HTMLFormElement>(null)
    const editFormRef = useRef<HTMLFormElement>(null)
    const getResume = async () => {
        const response = await fetch(
            "/api/resume",
            {
                method: "GET",
            }
        );

        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        setResumes(data.Data)
    }
    useEffect(() => {
        (async () => {
            await getResume()
        })()
    }, [])

    const deleteResume = async () => {
        setState(true)
        const del = await fetch(
            "/api/resume/" + resume?.id,
            {
                method: "DELETE",
            }
        );
        const response = await del.json();
        setState(false);
        if (response?.ApiResponse) {
            toast.success('Resume added successfully');
            getResume()
            return setShowModal(false)
        }
        return toast.error(response.message);
    }

    const saveResume = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState(true)
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const save = await fetch('/api/resume', {
            method: "POST",
            body: new FormData(e.currentTarget),
        });
        const response = await save.json();
        setState(false)
        if (response.id) {
            toast.success('Resume added successfully');
            getResume()
            return setShowModal(false)
        }
        return toast.error(response.message);
    }
    return (
        <>
            <Header />
            <main className="bg-slate-200 min-h-screen py-4 px-6 space-y-4">
                <div className="flex justify-between">
                    <h1 className="font-bold text-2xl">Resume</h1>
                    <Button onClick={() => { setShowModal(!showModal); setType('add') }}>Add new</Button>
                </div>
                <hr className="border-b-2 border-gray-500" />
                <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <thead>
                            <tr>
                                <th scope="col" className="text-start">Name</th>
                                <th scope="col" className="text-start">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-4 divide-gray-200 dark:divide-neutral-700">
                            {
                                resumes.map((e: Resume,key:number) => {
                                    return (
                                        <tr className="bg-white rounded-lg" key={key}>
                                            <td className="">{e.name}</td>
                                            <td className="flex gap-4">
                                                <a href={`/upload/${e.name}`} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400" target="_blank">View</a>
                                                <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 focus:outline-none focus:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:hover:text-red-400 dark:focus:text-red-400" onClick={() => { setShowModal(!showModal); setType('delete'); setResume(e) }}>Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </main>
            {showModal && type == "add"
                ?
                <Modal onClose={() => setShowModal(!showModal)} buttonAction={() => saveFormRef?.current?.requestSubmit()} headerText="Add resume" footerButtonText="Save" state={state}>
                    <form onSubmit={saveResume} className="flex flex-col space-y-4 sm:w-96 w-80" encType="multipart/form-data" ref={saveFormRef}>
                        <Input name={"file"} label="Select file" type="file" required />
                        <input type="hidden" name="userId" value={session?.user?.id} />
                    </form>
                </Modal>
                : null}
            {showModal && type == "delete"
                ?
                <Modal onClose={() => setShowModal(!showModal)} buttonAction={deleteResume} headerText="Are you sure?" footerButtonText="Delete" state={state}>
                    <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                        Once deleted you will not be able to recover this data.
                    </p>
                </Modal>
                : null}
        </>
    );
}
