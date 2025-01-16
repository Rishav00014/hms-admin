"use client";
import { ProgressState } from "@/components/common/ProgressState";
import { fetchService, deleteService } from "@/lib/redux/slice/service-slice";
import Cookies from "js-cookie";
import moment from "moment";

import { errorToast, successToast } from "@/utils/toastMessage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddService from "./AddService";

const Service = () => {

    const [model, setModel] = useState({
        visibility: false,
        updateData: {}
    });

    const { dataLoading, serviceList } = useSelector(
        (state) => state.service
    );
    const dispatch = useDispatch();

    const token = Cookies.get("access_token");

    const deleteTrolleyById = async (id) => {

        const isDelete = confirm("Are you sure want to delete this Designation ?");

        if (!isDelete) {
            return;
        }
        const resultAction = await dispatch(deleteService({ token, serviceId:id }));
        if (deleteService.fulfilled.match(resultAction)) {
            successToast("Designation Deleted");
            dispatch(fetchService({ token }));
        } else {
            const message = resultAction.payload || "Error in deleting hall";
            errorToast(message);
        };
    }

    useEffect(() => {
        token  && dispatch(fetchService({ token }));
        return () => { };
    }, [token]);
    return (
        <section className="bg-white rounded-xl text-gray-600 text-sm p-3 lg:p-10">
            <div>
                <div>
                    <div className="flex flex-col lg:flex-row gap-4 mt-3 justify-between items-center text-sm text-gray-50 w-full bg-blue-400 px-8 py-4 rounded-xl">
                        <div className="">
                            <h1 className="font-bold  text-4xl pb-2">
                                Add New Designation
                            </h1>
                            <p>Streamline Your Designation</p>
                        </div>
                        <button
                            className="bg-orange-400 font-bold px-4 py-2 h-fit rounded-lg text-white"
                            onClick={() => setModel({ visibility: true, updateData: {} })}
                        >
                            Add Designation
                        </button>
                    </div>
                    {/* history */}
                    {!dataLoading && serviceList?.length > 0 && (
                        <div className="w-full bg-blue-100 rounded-xl mt-3 pb-6 shadow">
                            <div className="p-5 flex flex-row gap-4 justify-between w-full">
                                <h1 className="font-semibold  text-xl">Designation</h1>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full font-medium text-nowrap">
                                    <thead className="bg-white text-sm">
                                        <tr>
                                            <th className="text-left font-medium px-4 py-3">
                                                S. No.
                                            </th>
                                            <th className="text-left font-medium  px-4 py-3">Title</th>
                                            <th className="text-left font-medium  px-4 py-3">Description</th>
                                            <th className="text-left font-medium px-4 py-3">Created</th>
                                            <th className="text-center font-medium px-4 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs">
                                        {serviceList?.map((data, index) => {
                                            const {
                                                _id,
                                                title,
                                                createdAt,
                                                description
                                            } = data;
                                            const date = moment(createdAt).format("D MMM YY");

                                            return (
                                                <tr key={_id} className="border-b border-b-white">
                                                    <td className="px-4 py-3 text-left">{index + 1}</td>

                                                    <td className="px-4 py-3 capitalize">
                                                        <ProgressState status={title} />
                                                    </td>
                                                    <td className="px-4 py-3 capitalize">
                                                        {description}
                                                    </td>
                                                    <td className="px-4 py-3 text-left">{date}</td>
                                                    <td className="px-4 py-3 flex items-center justify-center">
                                                        <div className="border py-1.5 w-fit rounded-full px-4">
                                                            <button
                                                                onClick={() => setModel({ visibility: true, updateData: data })}
                                                            >
                                                                <i className="ri-edit-box-line ri-lg border-r pe-2"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => deleteTrolleyById(_id)}
                                                            >
                                                                <i className="ri-delete-bin-6-line ri-lg text-red-400 ps-2"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
                {!dataLoading && serviceList?.length < 1 && (
                    <div className="text-center py-10 font-medium text-gray-300">
                        No History Found!
                    </div>
                )}

                {dataLoading && (
                    <div className="text-center py-10 font-medium text-gray-300">
                        Loading histories...
                    </div>
                )}
            </div>
            {
                model.visibility && <AddService
                    onClose={() => setModel({ visibility: false })}
                    initialState={model.updateData}
                />
            }
        </section>
    );
};

export default Service;
