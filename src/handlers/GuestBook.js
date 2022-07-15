const commentToHtml = ({ username, date, comment }) => {
  const nameHtml = `<td>${username}</td>`;
  const commentHtml = `<td>${comment}</td>`;
  const dateHtml = `<td>${date}</td>`;
  return `<tr>${dateHtml}${nameHtml}${commentHtml}</tr>`;
};

class GuestBook {
  #comments;
  constructor(comments) {
    this.#comments = comments;
  }

  get comments() {
    return JSON.stringify(this.#comments);
  }

  update(comment) {
    this.#comments.unshift(comment);
  }

  toHtml() {
    if (!this.#comments.length) {
      return '';
    }
    const commentsHtml = this.#comments.map(commentToHtml);
    return commentsHtml.join('');
  }
};

module.exports = { GuestBook };
