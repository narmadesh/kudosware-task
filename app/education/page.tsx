"use client"
import { FormEvent, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/input";
import Button from "@/components/button";
import toast from 'react-hot-toast';
import Header from "@/components/header";
import Modal from "@/components/modal";
import { Education } from "@/schemas/educaton";

export default function UserEducation() {
    const session = useSession()
    const [state, setState] = useState(false);
    const [educations, setEducations] = useState([]);
    const [education, setEducation] = useState<Education>();
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState("add");
    const [id, setId] = useState<number | null>(null);
    const saveFormRef = useRef<HTMLFormElement>(null)
    const editFormRef = useRef<HTMLFormElement>(null)
    const getEducation = async () => {
        const response = await fetch(
            "/api/education",
            {
                method: "GET",
            }
        );

        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        setEducations(data.Data)
    }
    useEffect(() => {
        (async () => {
            await getEducation()
        })()
    }, [])

    const deleteEducation = async () => {
        setState(true)
        const del = await fetch(
            "/api/education/" + education?.id,
            {
                method: "DELETE",
            }
        );
        const response = await del.json();
        setState(false);
        if (response?.ApiResponse) {
            toast.success('Education added successfully');
            getEducation()
            return setShowModal(false)
        }
        return toast.error(response.message);
    }

    const saveEducation = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState(true)
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const save = await fetch('/api/education', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const response = await save.json();
        setState(false)
        if (response.id) {
            toast.success('Education added successfully');
            getEducation()
            return setShowModal(false)
        }
        return toast.error(response.message);
    }
    const editEducation = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState(true)
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const save = await fetch('/api/education/' + education?.id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const response = await save.json();
        setState(false)
        if (response.id) {
            toast.success('Education updated successfully');
            getEducation()
            return setShowModal(false)
        }
        return toast.error(response.message);
    }
    return (
        <>
            <Header />
            <main className="bg-slate-200 min-h-screen py-4 px-6 space-y-4">
                <div className="flex justify-between">
                    <h1 className="font-bold text-2xl">Education</h1>
                    <Button onClick={() => { setShowModal(!showModal); setType('add') }}>Add new</Button>
                </div>
                <hr className="border-b-2 border-gray-500" />
                <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <thead>
                            <tr>
                                <th scope="col" className="text-start">Degree / Course / Class</th>
                                <th scope="col" className="text-start">University / Board</th>
                                <th scope="col" className="text-start">Year of completion</th>
                                <th scope="col" className="text-start">Score</th>
                                <th scope="col" className="text-start">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-4 divide-gray-200 dark:divide-neutral-700">
                            {
                                educations.map((e: Education,key:number) => {
                                    return (
                                        <tr className="bg-white rounded-lg" key={key}>
                                            <td className="">{e.degree}</td>
                                            <td className="">{e.university}</td>
                                            <td className="">{e.yearOfCompletion}</td>
                                            <td className="">{e.score}</td>
                                            <td className="flex gap-4">
                                                <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400" onClick={() => { setShowModal(!showModal); setType('edit'); setEducation(e) }}>Edit</button>
                                                <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 focus:outline-none focus:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:hover:text-red-400 dark:focus:text-red-400" onClick={() => { setShowModal(!showModal); setType('delete');setEducation(e) }}>Delete</button>
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
                <Modal onClose={() => setShowModal(!showModal)} buttonAction={() => saveFormRef?.current?.requestSubmit()} headerText="Add education" footerButtonText="Save" state={state}>
                    <form onSubmit={saveEducation} className="flex flex-col space-y-4 sm:w-96 w-80" ref={saveFormRef}>
                        <Input name={"degree"} label="Degree / Course / Class" type="text" required />
                        <Input name={"university"} label="University / Board" type="text" required />
                        <Input name={"yearOfCompletion"} label="Year of completion" type="number" required />
                        <Input name={"score"} label="Score" type="number" required />
                        <input type="hidden" name="userId" value={session?.data?.user?.id} />
                    </form>
                </Modal>
                : null}
            {showModal && type == "edit"
                ?
                <Modal onClose={() => setShowModal(!showModal)} buttonAction={() => editFormRef?.current?.requestSubmit()} headerText="Edit education" footerButtonText="Update" state={state}>
                    <form onSubmit={editEducation} className="flex flex-col space-y-4 sm:w-96 w-80" ref={editFormRef}>
                        <Input name={"degree"} label="Degree / Course / Class" type="text" defaultValue={education?.degree} required />
                        <Input name={"university"} label="University / Board" type="text" defaultValue={education?.university} required />
                        <Input name={"yearOfCompletion"} label="Year of completion" type="number" defaultValue={education?.yearOfCompletion} required />
                        <Input name={"score"} label="Score" type="number" defaultValue={education?.score} required />
                    </form>
                </Modal>
                : null}
            {showModal && type == "delete"
                ?
                <Modal onClose={() => setShowModal(!showModal)} buttonAction={deleteEducation} headerText="Are you sure?" footerButtonText="Delete" state={state}>
                    <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                        Once deleted you will not be able to recover this data.
                    </p>
                </Modal>
                : null}
        </>
    );
}
