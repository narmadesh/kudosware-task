"use client"
import { FormEvent, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/input";
import Button from "@/components/button";
import toast from 'react-hot-toast';
import Header from "@/components/header";
import Modal from "@/components/modal";
import { Experience } from "@/schemas/experience";

export default function UserExperience() {
    const { data: session } = useSession()
    const [state, setState] = useState(false);
    const [experiences, setExperiences] = useState([]);
    const [experience, setExperience] = useState<Experience>();
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState("add");
    const [id, setId] = useState<number | null>(null);
    const saveFormRef = useRef<HTMLFormElement>(null)
    const editFormRef = useRef<HTMLFormElement>(null)
    const getExperience = async () => {
        const response = await fetch(
            "/api/experience",
            {
                method: "GET",
            }
        );

        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        setExperiences(data.Data)
    }
    useEffect(() => {
        (async () => {
            await getExperience()
        })()
    }, [])

    const deleteExperience = async () => {
        setState(true)
        const del = await fetch(
            "/api/experience/" + experience?.id,
            {
                method: "DELETE",
            }
        );
        const response = await del.json();
        setState(false);
        if (response?.ApiResponse) {
            toast.success('Experience added successfully');
            getExperience()
            return setShowModal(false)
        }
        return toast.error(response.message);
    }

    const saveExperience = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState(true)
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const save = await fetch('/api/experience', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const response = await save.json();
        setState(false)
        if (response.id) {
            toast.success('Experience added successfully');
            getExperience()
            return setShowModal(false)
        }
        return toast.error(response.message);
    }
    const editExperience = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState(true)
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const save = await fetch('/api/experience/' + experience?.id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const response = await save.json();
        setState(false)
        if (response.id) {
            toast.success('Experience updated successfully');
            getExperience()
            return setShowModal(false)
        }
        return toast.error(response.message);
    }
    return (
        <>
            <Header />
            <main className="bg-slate-200 min-h-screen py-4 px-6 space-y-4">
                <div className="flex justify-between">
                    <h1 className="font-bold text-2xl">Experience</h1>
                    <Button onClick={() => { setShowModal(!showModal); setType('add') }}>Add new</Button>
                </div>
                <hr className="border-b-2 border-gray-500" />
                <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <thead>
                            <tr>
                                <th scope="col" className="text-start">Designation</th>
                                <th scope="col" className="text-start">Organization</th>
                                <th scope="col" className="text-start">Location</th>
                                <th scope="col" className="text-start">Start date</th>
                                <th scope="col" className="text-start">End date</th>
                                <th scope="col" className="text-start">Description</th>
                                <th scope="col" className="text-start">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-4 divide-gray-200 dark:divide-neutral-700">
                            {
                                experiences.map((e: Experience) => {
                                    return (
                                        <tr className="bg-white rounded-lg">
                                            <td className="">{e.designation}</td>
                                            <td className="">{e.organization}</td>
                                            <td className="">{e.location}</td>
                                            <td className="">{e.startDate}</td>
                                            <td className="">{e.endDate}</td>
                                            <td className="">{e.description}</td>
                                            <td className="flex gap-4">
                                                <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400" onClick={() => { setShowModal(!showModal); setType('edit'); setExperience(e) }}>Edit</button>
                                                <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 focus:outline-none focus:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:hover:text-red-400 dark:focus:text-red-400" onClick={() => { setShowModal(!showModal); setType('delete'); setExperience(e) }}>Delete</button>
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
                <Modal onClose={() => setShowModal(!showModal)} buttonAction={() => saveFormRef?.current?.requestSubmit()} headerText="Add experience" footerButtonText="Save" state={state}>
                    <form onSubmit={saveExperience} className="flex flex-col space-y-4 sm:w-96 w-80" ref={saveFormRef}>
                        <Input name={"designation"} label="Designation" type="text" required />
                        <Input name={"organization"} label="Organization" type="text" required />
                        <Input name={"location"} label="Location" type="text" required />
                        <Input name={"startDate"} label="Start date" type="date" required />
                        <Input name={"endDate"} label="Start date" type="date" required />
                        <Input name={"description"} label="Describe your role" type="text" />
                        <input type="hidden" name="userId" value={session?.user?.id} />
                    </form>
                </Modal>
                : null}
            {showModal && type == "edit"
                ?
                <Modal onClose={() => setShowModal(!showModal)} buttonAction={() => editFormRef?.current?.requestSubmit()} headerText="Edit experience" footerButtonText="Update" state={state}>
                    <form onSubmit={editExperience} className="flex flex-col space-y-4 sm:w-96 w-80" ref={editFormRef}>
                        <Input name={"designation"} label="Designation" type="text" defaultValue={experience?.designation} required />
                        <Input name={"organization"} label="Organization" type="text" defaultValue={experience?.organization} required />
                        <Input name={"location"} label="Location" type="text" defaultValue={experience?.location} required />
                        <Input name={"startDate"} label="Start date" type="date" defaultValue={new Date(experience?.startDate as string).toISOString().split('T')[0]} required />
                        <Input name={"endDate"} label="Start date" type="date" defaultValue={new Date(experience?.endDate as string).toISOString().split('T')[0]} required />
                        <Input name={"description"} label="Describe your role" defaultValue={experience?.description} type="text" />
                    </form>
                </Modal>
                : null}
            {showModal && type == "delete"
                ?
                <Modal onClose={() => setShowModal(!showModal)} buttonAction={deleteExperience} headerText="Are you sure?" footerButtonText="Delete" state={state}>
                    <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                        Once deleted you will not be able to recover this data.
                    </p>
                </Modal>
                : null}
        </>
    );
}
