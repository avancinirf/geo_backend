import fs from 'fs';

const baseUrl = { tmp: 'tmp/', img: 'uploads/img/', kml: 'uploads/img/'};

const createFile = async(path, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, err => {
      err ? reject(err) : resolve();
    });
  });
};

const moveFile = async(type = 'img', path) => {
  return new Promise((resolve, reject) => {
    let oldPath = baseUrl.tmp + path;
    let newPath = baseUrl[type] + path;
    fs.rename(oldPath, newPath, err => {
      err ? reject(err) : resolve();
    })
  });
};

const removeFile = async(type = 'img', path) => {
  return new Promise((resolve, reject) => {
    if (path && path.length) path = baseUrl[type] + path;
    fs.unlink(path, err => {
        err ? reject(err) : resolve();
    });
  });
};

export default {
  removeFile,
  createFile,
  moveFile
};