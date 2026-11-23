import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';

const RichTextEditer = ({ input, setInput}) => {
  const editor = useRef(null);
  const [setContent] = useState('');


  const handleChange = (content) => {
    setInput({ ...input, description: content });
  }

  return (
    <JoditEditor
      ref={editor}
      value={input.description}
      tabIndex={1} // tabIndex of textarea
      onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
      onChange={handleChange}
    />
  );
};
export default RichTextEditer