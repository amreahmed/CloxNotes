import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "../../components/cards/addEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import ToastMessage from "../../components/toastMessage/ToastMessage";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import addNote from "../../assets/downloadd.svg";
import noSearch from "../../assets/download.svg";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const navigate = useNavigate();

  const getUserInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/auth/user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoadingUser(false);
    }
  }, [navigate]);

  const handleClose = () => {
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
  };

  const handelEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const getAllNotes = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/notes/get");
      if (response.data && response.data.notes) {
        const sortedNotes = response.data.notes.sort((a, b) => {
          if (b.isPinned - a.isPinned !== 0) {
            return b.isPinned - a.isPinned;
          } else {
            return new Date(a.createdOn) - new Date(b.createdOn);
          }
        });
        setAllNotes(sortedNotes);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingNotes(false);
    }
  }, []);

  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({ isShown: true, message, type });
  };

  const handelDelete = async (noteID) => {
    // Optimistic UI update
    setAllNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteID));

    try {
      const response = await axiosInstance.delete("/notes/delete/" + noteID);
      if (response.data && response.data.message) {
        showToastMessage(response.data.message, "delete");
      }
    } catch (error) {
      console.log("error", error);
      // Revert UI update if API call fails
      getAllNotes();
    }
  };

  const onSearchNote = async (query) => {
    if (!query) {
      handelClearSearch();
      return;
    }
    try {
      const response = await axiosInstance.get("/notes/search", {
        params: { searchQuery: query },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handelClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const updateIsPinned = async (noteID) => {
    const noteId = noteID._id;

    // Optimistic UI update - Pre-emptively update UI
    setAllNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((note) =>
        note._id === noteId ? { ...note, isPinned: !note.isPinned } : note
      );
      return updatedNotes.sort((a, b) => {
        if (b.isPinned - a.isPinned !== 0) {
          return b.isPinned - a.isPinned;
        } else {
          return new Date(a.createdOn) - new Date(b.createdOn);
        }
      });
    });

    try {
      const response = await axiosInstance.put("/notes/pin/" + noteId, {
        isPinned: noteID.isPinned === false ? "true" : "false",
      });
      if (response.data && response.data.message) {
        showToastMessage("Note pinned successfully");
      }
      // Fetch updated notes after successful pin/unpin
      getAllNotes();
    } catch (error) {
      console.log("error", error);
      // Revert UI update if API call fails
      getAllNotes();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserInfo();
      await getAllNotes();
    };

    fetchData();
  }, [getUserInfo, getAllNotes]);

  useEffect(() => {
    if (!loadingUser && !loadingNotes) {
      setLoading(false);
    }
  }, [loadingUser, loadingNotes]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <AiOutlineLoading3Quarters className="text-6xl text-primary animate-spin" />
        </div>
      ) : (
        <>
          <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handelClearSearch={handelClearSearch} />
          <div className="px-8 mx-auto">
            {allNotes.length > 0 ? (
              <div className="grid grid-cols-4 gap-4 mt-8">
                {allNotes.map((item) => (
                  <NoteCard
                    key={item._id}
                    title={item.title}
                    date={item.createdOn}
                    content={item.content}
                    tags={item.tags}
                    isPinned={item.isPinned}
                    onEdit={() => {
                      handelEdit(item);
                    }}
                    onDelete={() => {
                      handelDelete(item._id);
                    }}
                    onPinNote={() => {
                      updateIsPinned(item);
                    }}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard
                imgSrc={isSearch ? noSearch : addNote}
                message={
                  isSearch
                    ? "Oops! No notes found matching your search query. Try searching with different keywords."
                    : "Start creating your first note! Click the 'Add' button to add your Ideas, thoughts and reminders. Let's get started! "
                }
              />
            )}
          </div>
          <button
            className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-btn_hover fixed right-10 bottom-10"
            onClick={() => {
              setOpenAddEditModal({ isShown: true, type: "add", data: null });
            }}>
            <MdAdd className="text-[32px] text-white" />
          </button>
          <Modal
            isOpen={openAddEditModal.isShown}
            onRequestClose={handleClose}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              },
            }}
            className="w-[40%] max-h-3/4 bg-base-100 rounded-md mx-auto mt-14 p-5">
            <AddEditNotes
              onClose={handleClose}
              type={openAddEditModal.type}
              noteData={openAddEditModal.data}
              getAllNotes={getAllNotes}
              showToastMessage={showToastMessage}
            />
          </Modal>
          <ToastMessage
            isShown={showToastMsg.isShown}
            message={showToastMsg.message}
            type={showToastMsg.type}
            onClose={handleCloseToast}></ToastMessage>
        </>
      )}
    </>
  );
};

export default Home;
