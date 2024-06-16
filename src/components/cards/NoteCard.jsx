import React from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";
const NoteCard = ({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote
}) => {


    return (
      <div className="border border-gray-500 rounded p-4 bg-base-200 hover:shadow-xl transition-all ease-in-out">
        <div className="flex items-center justify-between ">
          <div>
            <h6 className="text-sm font-medium text-white">{title}</h6>
            <span className="text-xs text-slate-500">
              {moment(date).format("Do MM YYYY")}
            </span>
          </div>
          <MdOutlinePushPin
            className={`icon-btn ${
              isPinned ? "text-primary" : "text-slate-300"
            }`}
            onClick={onPinNote}
          />
        </div>
        <p className="text-xs mt-2 text-slate-200">{content?.slice(0, 60)}</p>
        <div className="flex items-center justify-between mt-2 ">
          <div className="text-xs text-slate-500">{tags.map((item) => `#${item} `)}</div>
          <div className="flex items-center gap-2">
            <MdCreate className="icon-btn " onClick={onEdit} />
            <MdDelete className="icon-btn " onClick={onDelete} />
          </div>
        </div>
      </div>
    );
};

export default NoteCard;
