import React, { useState } from "react";

export default function ImageUpload() {
  const [selectedfile, setselectedfile] = useState(null);
  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setselectedfile(reader.result);
  //   };
  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  //   const name = new Date().getTime() + file.name;
  // };
  return (
    <div>
      {/* <input
        type="file"
        className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg p-2 cursor-pointer focus:ring focus:ring-blue-300"
        accept="image/*"
        onChange={handleImageUpload}
      /> */}
      {/* {selectedfile && (
        <div>
          <img src={selectedfile} />
        </div>
      )} */}
    </div>
  );
}
