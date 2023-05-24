import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc, collectionGroup } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectFade,
} from "swiper";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import shareIcon from "../assets/svg/shareIcon.svg";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();
  SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

  console.log(listing);
  useEffect(() => {
    const fetchSingleListing = async () => {
      const docRef = doc(db, "listing", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchSingleListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }
  console.log(listing.imgUrls);
  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade]}
        spaceBetween={1}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        {listing.imgUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <img
                src={listing.imgUrls[index]}
                className="swiperSlideDiv"
              ></img>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt=""></img>
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied!s</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name}- $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          For {listing.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountedPrice}
            discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms}  Bedrooms`
              : `${listing.bedrooms} Bedroom`}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms}  Bathrooms`
              : `${listing.bathrooms} Bathroom`}
          </li>
          <li>{listing.parking && "Parking Spot"} </li>
          <li>{listing.furnished && "Furnished"} </li>
        </ul>
        <p className="listingLocationTitle"></p>
        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
