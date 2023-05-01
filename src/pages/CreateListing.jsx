import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAllByTestId } from "@testing-library/react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebaseConfig";

function CreateListing() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: "1",
    bathrooms: "1",
    parking: false,
    furnished: false,
    adress: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    adress,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    location,
    longitude,
  } = formData;
  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("discounted price needs to be less than regular price");
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("max 6 images");
      return;
    }
    // Store images in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    );
    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    delete formData.adress;
    location && (formDataCopy.location = location);
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = await addDoc(collection(db, "listing"), formDataCopy);
    toast.success("Listing saved");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    setLoading(false);
  };
  const onMutate = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // Text Booleans Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };
  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create a listing</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">Sell/Rent</label>
          <div className="formButtons">
            <button
              className={type === "sale" ? "formButtonActive" : "formButton"}
              id="type"
              onClick={onMutate}
              value="sale"
              type="button"
            >
              Sell
            </button>
            <button
              className={type === "rent" ? "formButtonActive" : "formButton"}
              id="type"
              onClick={onMutate}
              type="button"
              value="rent"
            >
              Rent
            </button>
          </div>
          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="32"
            minLength="10"
            required
          />

          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
            <div>
              <label className="formLabel">Bathrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>
          <div className="formButtons">
            <button
              className={parking ? "formButtonActive" : "formButton"}
              type="button"
              id="parking"
              value={true}
              onClick={onMutate}
              min="1"
              max="50"
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="parking"
              value={false}
              onClick={onMutate}
              min="1"
              max="50"
            >
              No
            </button>
          </div>
          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              className={furnished ? "formButtonActive" : "formButton"}
              type="button"
              id="furnished"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
          </div>
          <div className="formButtons">
            <button
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="furnished"
              value={false}
              onClick={onMutate}
              required
            >
              Yes
            </button>
          </div>
          <label className="formLabel">Adress</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="adress"
            value={adress}
            onChange={onMutate}
            required
          ></textarea>
          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="50"
              max="75000000"
              required
            />
            {type === "rent" && <p className="formPriceText">$ / Month</p>}
          </div>
          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onMutate}
                min="50"
                max="7500000"
                required={offer}
              />
            </>
          )}
          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max & )
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,jpeg"
            multiple
            required
          ></input>
          <button className="primaryButton createListingButton" type="submit">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
