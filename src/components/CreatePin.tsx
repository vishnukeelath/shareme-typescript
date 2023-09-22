import React, { useState } from "react";
import { Category, User } from "@/shared/types";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { MdDelete } from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { ref, uploadBytesResumable, getDownloadURL } from "@firebase/storage";
import { firestore, storage } from "@/config/firebaseconfig";
import { v4 } from "uuid";
import { categories } from "@/utils/data";
import { collection, addDoc } from "firebase/firestore";

type Props = {
  user: User | undefined;
};

const CreatePin = ({ user }: Props) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fields, setFields] = useState<boolean>(false);
  const [wrongImageType, setWrongImageType] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [imageAsset, setImageAsset] = useState<string>("");
  const [compressedImgUrl, setCompressedImgUrl] = useState<string>("");

  // const compressAndResizeImage = async (
  //   file: File,
  //   maxWidth: number,
  //   maxHeight: number
  // ): Promise<Blob> => {
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const img = new Image();
  //       img.src = event.target?.result as string;
  //       img.onload = () => {
  //         const canvas = document.createElement("canvas");
  //         const ctx = canvas.getContext("2d");

  //         let targetWidth = img.width;
  //         let targetHeight = img.height;

  //         // Resize the image while maintaining its aspect ratio
  //         if (img.width > maxWidth) {
  //           targetWidth = maxWidth;
  //           targetHeight = (img.height * maxWidth) / img.width;
  //         }

  //         if (targetHeight > maxHeight) {
  //           targetHeight = maxHeight;
  //           targetWidth = (img.width * maxHeight) / img.height;
  //         }

  //         canvas.width = targetWidth;
  //         canvas.height = targetHeight;

  //         ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

  //         canvas.toBlob(
  //           (blob) => {
  //             resolve(blob as Blob);
  //           },
  //           file.type,
  //           0.7
  //         ); // Adjust compression quality as needed (0.7 means 70% quality)
  //       };
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };

  const compressAndResizeImage = async (
    file: File,
    maxWidth: number,
    maxHeight: number
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let targetWidth = img.width;
          let targetHeight = img.height;

          // Calculate the aspect ratio
          const aspectRatio = img.width / img.height;

          // Resize the image while maintaining its aspect ratio
          if (img.width > maxWidth) {
            targetWidth = maxWidth;
            targetHeight = maxWidth / aspectRatio;
          }

          if (targetHeight > maxHeight) {
            targetHeight = maxHeight;
            targetWidth = maxHeight * aspectRatio;
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

          canvas.toBlob(
            (blob) => {
              resolve(blob as Blob);
            },
            file.type,
            0.7
          ); // Adjust compression quality as needed (0.7 means 70% quality)
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      // you can display the error to the user
      console.error("Select a file");
      return;
    }
    const { type, name } = e.target.files[0];

    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/jpg" ||
      type === "image/gif" ||
      type === "image/tiff" ||
      type === "image/webp"
    ) {
      setWrongImageType(false);
      setLoading(true);

      const compressedImgBlob = await compressAndResizeImage(
        e.target.files[0],
        300,
        500
      );
      console.log("compressedImg", compressedImgBlob);

      const compressedStorageRef = ref(
        storage,
        `/files/images/${v4()}${name}-compressed`
      );
      const comUploadTask = await uploadBytesResumable(
        compressedStorageRef,
        compressedImgBlob
      );
      console.log("uploadTask", comUploadTask);
      const compressedPhotoUrl = await getDownloadURL(comUploadTask.ref).catch(
        (error) => {
          console.log("Image url error", error);
        }
      );
      console.log("compressedPhotoUrl", compressedPhotoUrl);
      if (compressedPhotoUrl) {
        setCompressedImgUrl(compressedPhotoUrl);
      }

      const storageRef = ref(storage, `/files/images/${v4()}${name}`);
      const uploadTask = await uploadBytesResumable(
        storageRef,
        e.target.files[0]
      );
      console.log("uploadTask", uploadTask);
      const photoUrl = await getDownloadURL(uploadTask.ref).catch((error) => {
        console.log("Image url error", error);
      });
      console.log("photoUrl", photoUrl);
      if (photoUrl) {
        setImageAsset(photoUrl);
        setLoading(false);
      }
    } else {
      setWrongImageType(true);
    }
  };

  const savePin = async () => {
    if (title && about && destination && imageAsset && category) {
      const pinDoc = {
        title: title,
        about: about,
        category: category,
        destination: destination,
        image: imageAsset,
        postedBy: user,
        status: "Pending",
        isApproved: false,
        thumbnailImage: compressedImgUrl,
      };
      const docRef = await addDoc(collection(firestore, "pins"), pinDoc).catch(
        (error) => {
          console.log("error while uploading data", error);
        }
      );

      console.log("cloud upload", docRef);
      if (docRef) {
        navigate("/");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-all duration-150 ease-in">
          Please fill in all the fields.
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full rounded-lg shadow-sm">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full rounded-lg">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-[420px]">
            {loading && <Spinner message="" />}
            {wrongImageType && <p className="text-red-500">Wrong Image type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center  h-full cursor-pointer">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload fontSize={45} />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Use high-quality JPG, SVG, PNG, GIF less than 20 MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full ">
                <img
                  src={imageAsset}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset("")}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          {user && (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
              <img
                src={user.photoURL}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user.displayName}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="What is your pin about"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col ">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl"></p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="other" className="bg-white">
                  Select Category
                </option>
                {categories.map((category) => (
                  <option
                    value={category.name}
                    key={category.name}
                    className="text-base border-0 outline-none capitalize bg-white text-black"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
