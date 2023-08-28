import { firestore } from "@/config/firebaseconfig";
import { Comment, Pins, User } from "@/shared/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { BiSolidDownload } from "react-icons/bi";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

type Props = {
  user: User | undefined;
};

const PinDetail = ({ user }: Props) => {
  const { pinId } = useParams();
  console.log("pinId", pinId);
  const [relatedPins, setRelatedPins] = useState<Pins[]>([]);
  const [isRelatedPins, setIsRelatedPins] = useState<boolean>(false);
  const [pinCategory, setPinCategory] = useState<string>("");
  const [isPin, setIsPin] = useState<boolean>(false);
  const [pinDetail, setPinDetail] = useState<Pins>();
  const [loading, setLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<string>();
  const [addingComment, setAddingComment] = useState<boolean>(false);

  const fetchPinDetail = async () => {
    setLoading(true);

    if (pinId) {
      //We are using Web Modular API in Firestore docs to implement API
      const pinRef = doc(firestore, "pins", `${pinId}`);
      const pin = await getDoc(pinRef);
      const pinData = pin.data() as Pins;
      console.log("pins data-", pin.data());
      // const pinCommentRef = doc(firestore, "pins", `${pinId}`, "comments")
      // const pinsData = pins.docs[0] as Pins;
      // console.log("pins odject-", pinsData);
      if (pinData) {
        setPinDetail(pinData);
        setIsPin(true);
        setPinCategory(pinData.category);
      }
      setLoading(false);
    }
  };

  const fetchPinComments = async () => {
    setAddingComment(true);
    const pinCommentRef = collection(firestore, "pins", `${pinId}`, "comments");
    const comment = await getDocs(pinCommentRef);
    console.log("comment", comment);
    console.log("comment docs", comment.docs);
    const commentData = comment.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Comment[];

    console.log("commentData", commentData);
    setComments(commentData);
    setAddingComment(false);
  };

  useEffect(() => {
    fetchPinDetail();
    fetchPinComments();
  }, [pinId]);

  const addComment = async () => {
    const commentRef = await addDoc(
      collection(firestore, "pins", `${pinId}`, "comments"),
      {
        comment: comment,
        postedBy: user,
      }
    ).catch((error) => {
      console.log("error while uploading data", error);
    });

    console.log("commentRef", commentRef);
    if (commentRef) {
      fetchPinComments();
      setComment("");
    }
  };

  const fetchRelatedPins = async () => {
    const pins = await getDocs(
      query(
        collection(firestore, "pins"),
        where("category", "==", pinCategory),
        limit(5)
      )
    );

    const pinsData: Pins[] = pins.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Pins[];

    if (pinsData.length > 0) {
      setRelatedPins(pinsData);
      setIsRelatedPins(pinsData.length > 0);
    }
  };

  useEffect(() => {
    if (pinCategory) {
      fetchRelatedPins();
    }
  }, [pinCategory]);

  return (
    <>
      {isPin && (
        <div
          className="flex xl:flex-row flex-col m-auto bg-white"
          style={{
            maxWidth: "1500px",
            height: "900px",
            borderRadius: "32px",
          }}
        >
          <div className="flex justify-center items-center p-2 md:items-start flex-initial xl:w-7/12 xl:p-[20px]">
            <img
              src={pinDetail?.image}
              className="rounded-t-3xl rounded-b-lg max-h-[600px]"
              alt="user-post"
            />
          </div>

          <div className="w-full p-2 xl:p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetail?.image}`}
                  download={`${pinDetail?.title}`}
                  className="bg-secondaryColor p-2 px-4 text-xl gap-x-1.5 rounded-full flex items-center text-dark opacity-75 hover:opacity-100"
                >
                  {/* <MdDownloadForOffline /> */}
                  <BiSolidDownload />
                  <p className="font-semibold text-base">Download</p>
                </a>
              </div>
            </div>
            <div className="">
              <h1 className="text-2xl xl:text-4xl font-bold break-words mt-3">
                {pinDetail?.title}
              </h1>
              <p className="mt-3">{pinDetail?.about}</p>
            </div>
            <Link
              to={`/user-profile/${pinDetail?.postedBy?.uid}`}
              className="flex gap-2 mt-5 items-center bg-white rounded-lg"
            >
              <img
                src={pinDetail?.postedBy.photoURL}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{pinDetail?.postedBy.displayName}</p>
            </Link>
            {/* Comments Section */}
            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
              {comments?.map((item) => (
                <div
                  className="flex gap-2 mt-5 bg-white rounded-lg"
                  key={item.comment}
                >
                  <img
                    src={item.postedBy?.photoURL}
                    className="w-8 h-8 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.postedBy.displayName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user?.uid}`}>
                <img
                  src={user?.photoURL}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  alt="user-profile"
                />
              </Link>
              <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? "Posting" : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isRelatedPins ? (
        <div>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this
          </h2>
          <MasonryLayout pins={relatedPins} />
        </div>
      ) : (
        <Spinner message="Loading more pins..." />
      )}
    </>
  );
};

export default PinDetail;
