import React from "react";
import TagInput from "./TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({
  onClose,
  noteData,
  type,
  getAllNotes,
  showToastMessage,
}) => {
  const [title, setTitle] = React.useState(noteData?.title || "");
  const [content, setContent] = React.useState(noteData?.content || "");
  const [tags, setTags] = React.useState(noteData?.tags || []);
  const [error, setError] = React.useState(null);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/notes/add", {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        console.log("Note added successfully:", response.data.note);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while adding the note.");
      }
    }
  };

  const editNote = async () => {
    const noteID = noteData._id;
    try {
      const response = await axiosInstance.put("/notes/edit/" + noteID, {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        console.log("Note added successfully:", response.data.note);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while adding the note.");
      }
    }
  };

  const handleAddNote = async () => {
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!content) {
      setError("Content is required");
      return;
    }
    if (tags.length === 0) {
      setError("Tags are required");
      return;
    }
    setError("");

    if (type === "edit") {
      await editNote();
      await getAllNotes();
      await onClose();
      await showToastMessage("Note edited successfully", "success")
    } else {
      await addNewNote();
      await getAllNotes();
      await onClose();
      await showToastMessage("Note added successfully", "success");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          console.log("Closing modal");
          onClose();
        }}
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-btn_hover"
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2 py-5">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-100 outline-none bg-base-300 rounded p-2"
          placeholder="Go To Gym at 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          className="text-sm text-slate-100 outline-none bg-base-300 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>
      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className="text-red-500 text-sm pt-4">{error}</p>}
      <button
        className="btn-secondary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "EDIT" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
