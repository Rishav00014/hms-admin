"use client";

import { errorToast, successToast } from "@/utils/toastMessage";
import Cookies from "js-cookie";
import { createService, fetchService} from "@/lib/redux/slice/service-slice";
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddService = ({
    onClose,
    initialState = {}
}) => {
    const [updateId, setUpdateId] = useState("");
    const [requestData, setRequestData] = useState({
        title: "",
        description: ""
    });

    const token = Cookies.get("access_token");
    const dispatch = useDispatch();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRequestData((prev) => ({ ...prev, [name]: value }));
    };

    const sendRequest = async (event) => {
        event.preventDefault();
        const resultAction = await dispatch(
            createService({
                token,
                data: requestData,
                serviceId: updateId
            })
        );
        console.log(resultAction);
        if (createService.fulfilled.match(resultAction)) {
            onClose();
            setRequestData({
                title: "",
                description: ""
            });
            if (updateId !== "") {
                successToast("Request updated");
            }
            dispatch(fetchService ({ token }));
        } else {
            const message = resultAction.payload || "Error in creating Designation";
            errorToast(message);
        }
    };



    useEffect(() => {
        setRequestData(initialState);
        setUpdateId(initialState?._id || "");
        return () => { };
    }, [initialState]);


    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
            <section className="z-50 w-2/3 lg:w-1/3 bg-white text-gray-600 rounded-xl">
                <div className="bg-blue-400 text-white font-semibold p-4 rounded-t-xl flex items-center justify-between">
                    <h1>Add Designation</h1>{" "}
                </div>
                <form
                    onSubmit={sendRequest}
                    className="p-6 text-sm"
                >
                    <div className="w-full flex flex-col gap-2 pb-4">
                        <label>Title</label>
                        <input
                            className="border p-2 rounded-lg bg-gray-100 outline-none"
                            type="text"
                            required
                            name="title"
                            value={requestData?.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2 pb-4">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={requestData?.description}
                            onChange={handleChange}
                            className="border p-2 h-20 rounded-lg bg-gray-100 outline-none"
                            type="text"
                        />
                    </div>

                    <div className="flex justify-between gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-400 w-[48%] text-white rounded-lg p-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-400 w-[48%] text-white rounded-lg p-2"
                        >
                            Save
                        </button>
                    </div>
                </form>

            </section >
        </div>
    );
};

export default AddService;
