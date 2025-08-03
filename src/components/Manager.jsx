import React, { useEffect, useState } from "react"
import { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { v4 as uuidv4 } from 'uuid';



const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([]);

    const getPasswords = async () => {
        let req = await fetch('https://passmate-5xqc.onrender.com/')
        let passwords = await req.json()
        setPasswordArray(passwords)
    }



    useEffect(() => {
        getPasswords()
    }, [])


    const copyText = (text) => {
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text)
    }

    const showPassword = () => {
        passwordRef.current.type = "text"
        console.log(ref.current.src)
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "password"
        }
        else {
            passwordRef.current.type = "text"
            ref.current.src = "icons/eyecross.png"
        }

    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

            // If any such id exists in the db, delete it 
            await fetch('https://passmate-5xqc.onrender.com/', { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })

            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            await fetch('https://passmate-5xqc.onrender.com/', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })

            // Otherwise clear the form and show toast
            setform({ site: "", username: "", password: "" })
            toast('Password saved!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else {
            toast('Error: Password not saved!');
        }

    }

    const deletePassword = async (id) => {
        console.log("Deleting password with id ", id)
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))
            
            await fetch('https://passmate-5xqc.onrender.com/', { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

            toast('Password Deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true, 
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }

    }

    const editPassword = (id) => {
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }


    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="fixed inset-0 -z-10 h-full w-full
         bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,
         transparent_1px),linear-gradient(to_bottom,#8080800a_1px,
         transparent_1px)] bg-[size:14px_24px]"><div className="absolute
          left-0 right-0 top-0 m-auto h-[310px] w-[310px]
           rounded-full bg-green-400 opacity-20 blur-[100px]"></div></div>

            <div className="p-2 md:mycontainer ">
                <h1 className='text-4xl text font-bold text-center'>
                    <span className='text-green-500'> &lt;</span>
                    Pass
                    <span className='text-green-500'>Mate/&gt;</span></h1>
                <p className='text-green-900 text-lg text-center'>Your own Password Manager</p>

                <div className=' flex flex-col p-4 text-black gap-4 items-center'>
                    <input value={form.site} onChange={handleChange} placeholder='Enter Website URL' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="site" id="site" />
                    <div className="flex flex-ol md:flex-row w-full justify-between gap-8">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="username" id="username" />
                        <div className="relative">

                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1 px-7' type="password" name="password" id="password" />
                            <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={28} src="/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className='flex justify-center gap-2 items-center bg-green-500 rounded-full px-4 py-1 w-fit hover:bg-green-400 border border-green-900'>
                        <lord-icon
                            src="https://cdn.lordicon.com/sbnjyzil.json"
                            trigger="hover"
                            colors="primary:#121331,secondary:#242424">
                        </lord-icon>Save</button>
                </div>
                <div className="passwords">
                    <h2 className="font-bold text-2xl py-3">Your Passwords</h2>
                    {passwordArray.length === 0 && <div> No passwords to show</div>}
                    {passwordArray.length != 0 &&
                        <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                            <thead className="bg-green-800 text-white">
                                <tr>
                                    <th className="py-2">Site</th>
                                    <th className="py-2">Username</th>
                                    <th className="py-2">Password</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-green-100">
                                {passwordArray.map((item, index) => {
                                    return <tr key={index}>
                                        <td className="py-2 border border-white text-center">
                                            <div className="flex items-center justify-center">
                                                <a href="{item.site}" target="_blank">{item.site}</a>
                                                <div className="size-7 cursor-pointer" onClick={() => { copyText(item.site) }}>
                                                    <FontAwesomeIcon
                                                        style={{
                                                            "width": "20px",
                                                            "height": "20px",
                                                            "paddingTop": "3px",
                                                            "paddingLeft": "10px"
                                                        }}
                                                        icon={faCopy} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 border border-white text-center">
                                            <div className="flex items-center justify-center">
                                                <span>{item.username}</span>
                                                <div className="size-7 cursor-pointer" onClick={() => { copyText(item.username) }}>
                                                    <FontAwesomeIcon
                                                        style={{
                                                            "width": "20px",
                                                            "height": "20px",
                                                            "paddingTop": "3px",
                                                            "paddingLeft": "10px"
                                                        }}
                                                        icon={faCopy} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 border border-white text-center">
                                            <div className="flex items-center justify-center">
                                                <span>{"*".repeat(item.password.length)}</span>
                                                <div className="size-7 cursor-pointer" onClick={() => { copyText(item.password) }} >
                                                    <FontAwesomeIcon
                                                        style={{
                                                            "width": "20px",
                                                            "height": "20px",
                                                            "paddingTop": "3px",
                                                            "paddingLeft": "10px"
                                                        }}
                                                        icon={faCopy} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="justify-center py-2 border border-white text-center">
                                            <span className="cursor-pointer mx-1" onClick={() => { editPassword(item.id) }}>
                                                <FontAwesomeIcon icon={faPenToSquare}
                                                    style={{
                                                        "width": "22px",
                                                        "height": "19px",
                                                        "paddingTop": "5px"
                                                    }} />

                                            </span>
                                            <span className="cursor-pointer mx-1" onClick={() => { deletePassword(item.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/jzinekkv.json"
                                                    trigger="hover"
                                                    style={{
                                                        "width": "25px",
                                                        "height": "25px",
                                                        "paddingTop": "5px"
                                                    }}>
                                                </lord-icon>
                                            </span>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>}
                </div>
            </div >
        </>
    )
}

export default Manager