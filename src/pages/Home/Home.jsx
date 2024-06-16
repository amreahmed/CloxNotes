import React, { useState, useEffect } from "react";
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
  const navigate = useNavigate();

  const getUserInfo = async () => {
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
    }
  };

  const handleClose = () => {
    console.log("Closing modal");
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
  };

  const handelEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/notes/get");
      if (response.data && response.data.notes) {
        console.log("Fetched notes:", response.data.notes);
        const sortedNotes = response.data.notes.sort((a, b) => b.isPinned - a.isPinned);
        setAllNotes(sortedNotes);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({ isShown: true, message, type });
  };

  const handelDelete = async (noteID) => {
    try {
      const response = await axiosInstance.delete("/notes/delete/" + noteID);
      if (response.data && response.data.message) {
        console.log("Note deleted successfully:", response.data.message);
        showToastMessage(response.data.message, "delete");
        getAllNotes();
      }
    } catch (error) {
      console.log("error", error);
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
        console.log("Fetched notes:", response.data.notes);
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
    try {
      const response = await axiosInstance.put("/notes/pin/" + noteId, {
        isPinned: noteID.isPinned === false ? "true" : "false",
      });
      if (response.data && response.data.message) {
        console.log("Note pinned successfully:", response.data.message);
        showToastMessage("Note pinned successfully");
        getAllNotes(); // This will automatically sort the notes after fetching
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []);

  return (
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
          console.log("Opening modal");
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
  );
};

export default Home;
