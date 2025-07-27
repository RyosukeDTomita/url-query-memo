const DOMPurify = {
  sanitize: jest.fn((html) => html),
};

module.exports = DOMPurify;
module.exports.default = DOMPurify;