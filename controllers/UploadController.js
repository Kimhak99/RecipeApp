import { collectionName, gfs, gridFSBucket } from "../utils/upload";

const UploadFile = async (req, res) => {
  res.status(201).send({ meta: 201, file: req.file });
};

const GetFile = async (req, res) => {
  let file = await gfs.files.findOne({ filename: req.params.filename });

  if (!file) return res.status(404).send({ meta: 404, message: "File no exist" });

  file = gridFSBucket.openDownloadStream(file._id);
  res.writeHead(200, { 'Content-Type': 'image/png' });
  file.pipe(res);
};

const GetFileObject = async (req, res) => {
  const file = await gfs.files.findOne({ filename: req.params.filename });
  res.status(200).send({ meta: 200, file: file });
};

const DeleteFile = async (req, res) => {
  const file = await gfs.files.findOne({ filename: req.params.filename });
  const err = await gfs.remove({ _id: file._id, root: collectionName });

  if (!file) return res.status(404).send({ meta: 404, message: "File no exist" });
  if (!err) return res.status(500).send({ meta: 500, message: "File delete error" });

  return res.status(200).send({ meta: 200, file: file });
};

export default {
  UploadFile,
  GetFile,
  GetFileObject,
  DeleteFile,
}