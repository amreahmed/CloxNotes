import React from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((tag, tagIndex) => tagIndex !== index));
  };

  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-slate-100 bg-base-200 py-1 px-3 rounded"
            >
              # {tag}
              <button onClick={() => handleRemoveTag(index)}>
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 mt-4">
        <input
          type="text"
          placeholder="Add Tags"
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-primary hover:bg-btn_hover"
          onClick={addNewTag}
        >
          <MdAdd className="text-2xl text-primary hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
