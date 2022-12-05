import { Fragment, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import {
  CalendarIcon,
  FolderIcon,
  HomeIcon,
  UserIcon,
  InboxIcon,
  UsersIcon,
  PlusIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import DashBoard from "../DashBoard";
import Properties from "../Properties";
import Messages from "../Messages";
import { Link, useSearchParams } from "react-router-dom";
import NoData from "../NoData";
import LogOut from "../LogOut";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchUserInformation } from "../../../features/slices/userInformation";
import apiClient from "../../../utils/apiClient";
import PostProperty from "../../../pages/PostProperty";
import MyProperties from "../MyProperties";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SideBar = ({ menubutton }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useSearchParams(window.location.search);
  const query = params.get("section");

  const [navigation, setNavigation] = useState([
    { name: "My Profile", href: "profile", icon: UserIcon, current: true },
    {
      name: "Post Property",
      href: "post-property",
      icon: PlusIcon,
      current: false,
    },
    {
      name: "Favourite Properties",
      href: "favourites",
      icon: HeartIcon,
      current: false,
    },

    {
      name: "My Properties",
      href: "my-properties",
      icon: HomeIcon,
      current: false,
    },
    // { name: "Saved Searches", href: "saved", icon: FolderIcon, current: false },
    // { name: "Messages", href: "messages", icon: CalendarIcon, current: false },
    { name: "Logout", href: "logout", icon: InboxIcon, current: false },
  ]);

  const mainComponent = {
    profile: <DashBoard />,
    favourites: <Properties />,
    messages: <Messages />,
    // saved: <NoData />,
    "post-property": <PostProperty />,
    "my-properties": <MyProperties />,
    logout: <LogOut />,
  };
  const onInputChange = async (e) => {
    const files = e.target.files[0];
    setFile(e.target.files[0]);
    readURL(e.target);

    const formData = new FormData();
    const newData = { ...user.data, photo: files };

    Object.entries(newData).map((item) => {
      formData.append(item[0], item[1]);
    });
    setLoading(true);
    try {
      await apiClient.post("update-profile", formData).then((res) => {
        if (res.status === 200) {
          dispatch(fetchUserInformation());
          setLoading(false);
          toast.success(`Profile Photo  updated successfully.`);
        } else {
          setLoading(false);
          toast.error(res.message);
        }
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error(
        `There's an error updating profile photo. Please contact admin`
      );
    }
  };
  useEffect(() => {
    if (user?.data?.photo) {
      setImage(user?.data?.photo);
    }
  }, [user]);
  useEffect(() => {
    const section = params.get("section");
    if (section) {
      const newObject = navigation.map((item) => {
        if (item.href === section) return { ...item, current: true };
        else return { ...item, current: false };
      });
      setNavigation(newObject);
    }
  }, [params]);
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        setImage(e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  console.log(user);
  const { user_name, first_name, last_name } = user.data || {};

  let username;
  if (
    first_name &&
    last_name &&
    first_name !== "null" &&
    last_name !== "null"
  ) {
    username = `${first_name} ${last_name}`;
  } else {
    username = user_name;
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="hidden md:flex md:w-72 flex-col ">
            <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex flex-col items-center flex-shrink-0 px-4">
                  <div className={`relative m-4`}>
                    <img
                      className="w-full h-auto"
                      src={image ? image : "noUser.png"}
                      alt="Workflow"
                    />
                    <form>
                      <div className="absolute bottom-0 left-0 right-0 w-full bg-opacity-70 bg-black text-white py-2 flex space-x-2 justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute top-0 left-0 p-0 w-0 h-0 overflow-hidden opacity-0"
                          id="contained-button-file"
                          onChange={onInputChange}
                        />
                        <label htmlFor="contained-button-file">
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "#B91C1B",
                              color: "white",
                            }}
                            component="span"
                            disabled={loading}
                            className="w-full bg-opacity-70 bg-black text-white py-2 flex space-x-2 justify-center"
                          >
                            <span>
                              {loading ? (
                                <FaSpinner className="spin" />
                              ) : (
                                "Upload"
                              )}
                            </span>
                            <MdOutlineDriveFolderUpload className="w-5 h-5" />
                          </Button>
                        </label>
                      </div>
                    </form>
                  </div>
                  {user?.data?.first_name && user?.data?.last_name && (
                    <div className="text-red-700 text-xl font-medium">
                      {username}
                    </div>
                  )}
                </div>
                <nav className="mt-10 flex-1 px-2 bg-white space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={`/my-profile?section=${item.href}`}
                    >
                      <button
                        className={classNames(
                          item.current
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-3 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </button>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <main className="flex-1">
              {!query ? mainComponent["profile"] : mainComponent[query]}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
