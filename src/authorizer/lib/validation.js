export const validateNoteInput = ({ title, text }) => {
  const errors = {};
  if (typeof title !== "string" || title.trim().length === 0) {
    errors.title = "Title is required";
  } else if (title.trim().length > 50) {
    errors.title = "Title max length is 50";
  }
  if (typeof text !== "string" || text.trim().length === 0) {
    errors.text = "Text is required";
  } else if (text.trim().length > 300) {
    errors.text = "Text max length is 300";
  }
  return { valid: Object.keys(errors).length === 0, errors };
};
