const EditProfile = () => {
  return (
    <div className="my-6 rounded-xl bg-white p-6 lg:p-12">
      {/* form */}
      <div className=" flex flex-col gap-2 justify-center items-center">
        <div className="bg-gray-200 p-4 px-6 rounded-full w-fit">
          <i className="ri-camera-ai-fill ri-2x text-gray-800"></i>
        </div>
        <p className="text-sm text-blue-400">Upload Photo</p>
      </div>
      <form className="text-sm flex justify-between gap-8 flex-wrap pt-10">
        <div className="w-full lg:w-[48%] flex flex-col gap-2">
          <label>First Name</label>
          <input
            className="border bg-gray-100 p-2 rounded-lg outline-none"
            type="text"
            name="firstname"
            placeholder="Enter your first name"
          />
        </div>
        <div className="w-full lg:w-[48%] flex flex-col gap-2">
          <label>Last Name</label>
          <input
            className="border bg-gray-100 p-2 rounded-lg outline-none"
            type="text"
            name="firstname"
            placeholder="Enter your last name"
          />
        </div>
        <div className="w-full lg:w-[48%] flex flex-col gap-2">
          <label>Your email</label>
          <input
            className="border bg-gray-100 p-2 rounded-lg outline-none"
            type="text"
            name="firstname"
            placeholder="Enter your mail"
          />
        </div>
        <div className="w-full lg:w-[48%] flex flex-col gap-2">
          <label>Phone Number</label>
          <input
            className="border bg-gray-100 p-2 rounded-lg outline-none"
            type="text"
            name="firstname"
            placeholder="Enter your phone number"
          />
        </div>
        <div className="w-full lg:w-[48%] flex flex-col gap-2">
          <label>Role</label>
          <select className="border bg-gray-100 p-2 rounded-lg outline-none">
            <option value="" selected disabled>
              Select Role
            </option>
            <option value="admin">AIR INDIA</option>
            <option value="user">STAFF</option>
            <option value="user">SUPER ADMIN</option>
          </select>
        </div>
        <div className="w-full flex justify-center pt-4">
          <button className="text-white bg-blue-400 px-20 py-3 rounded-lg font-medium">
            Save Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
