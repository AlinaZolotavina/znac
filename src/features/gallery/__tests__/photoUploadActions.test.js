import api from "../../../shared/utils/api";
import photoUploadActions from "../utils/photoUploadActions";

jest.mock("../../../shared/utils/api", () => ({
  __esModule: true,
  default: {
    uploadPhoto: jest.fn(),
    addPhoto: jest.fn(),
  },
}));

function createUploadActions(overrides = {}) {
  const props = {
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
    addPhotosToGallery: jest.fn(),
    openModal: jest.fn(),
    ...overrides,
  };

  return {
    props,
    actions: photoUploadActions(props),
  };
}

describe("photoUploadActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("starts photo uploads in parallel", async () => {
    const uploadResolvers = [];
    const { actions } = createUploadActions();

    api.uploadPhoto.mockImplementation(
      () =>
        new Promise((resolve) => {
          uploadResolvers.push(resolve);
        }),
    );
    api.addPhoto.mockResolvedValue({ _id: "photo-id" });

    const uploadPromise = actions.handlePhotoUpload({
      photoData: [
        { id: "first", file: new File(["first"], "first.webp") },
        { id: "second", file: new File(["second"], "second.webp") },
      ],
      hashtags: "summer",
      views: 0,
    });

    await Promise.resolve();

    expect(api.uploadPhoto).toHaveBeenCalledTimes(2);

    uploadResolvers.forEach((resolve, index) => {
      resolve({ data: [{ filename: `photo-${index}.webp` }] });
    });

    await uploadPromise;
  });

  test("returns partial uploads without opening a modal", async () => {
    const { props, actions } = createUploadActions();
    const onPhotoStatusChange = jest.fn();

    api.uploadPhoto
      .mockResolvedValueOnce({ data: [{ filename: "uploaded.webp" }] })
      .mockRejectedValueOnce(new Error("File is too large"));
    api.addPhoto.mockResolvedValueOnce({ _id: "uploaded-photo" });

    const result = await actions.handlePhotoUpload({
      photoData: [
        { id: "success", file: new File(["success"], "success.webp") },
        { id: "failed", file: new File(["failed"], "failed.webp") },
      ],
      hashtags: "summer",
      views: 0,
      onPhotoStatusChange,
    });

    expect(result.addedPhotos).toHaveLength(1);
    expect(result.failedCount).toBe(1);
    expect(props.addPhotosToGallery).toHaveBeenCalledWith([
      { _id: "uploaded-photo" },
    ]);
    expect(props.openModal).not.toHaveBeenCalled();
    expect(onPhotoStatusChange).toHaveBeenCalledWith("success", "uploading");
    expect(onPhotoStatusChange).toHaveBeenCalledWith("success", "success");
    expect(onPhotoStatusChange).toHaveBeenCalledWith("failed", "uploading");
    expect(onPhotoStatusChange).toHaveBeenCalledWith(
      "failed",
      "error",
      expect.any(Error),
    );
  });

  test("shows success modal with uploaded photos count", async () => {
    const { props, actions } = createUploadActions();

    api.uploadPhoto.mockResolvedValue({ data: [{ filename: "uploaded.webp" }] });
    api.addPhoto
      .mockResolvedValueOnce({ _id: "first-photo" })
      .mockResolvedValueOnce({ _id: "second-photo" });

    await actions.handlePhotoUpload({
      photoData: [
        { id: "first", file: new File(["first"], "first.webp") },
        { id: "second", file: new File(["second"], "second.webp") },
      ],
      hashtags: "summer",
      views: 0,
    });

    expect(props.openModal).toHaveBeenCalledWith({
      status: "success",
      message: "Successfully uploaded photos: 2",
    });
  });

  test("shows error modal when every photo fails", async () => {
    const { props, actions } = createUploadActions();

    api.uploadPhoto.mockRejectedValue(new Error("Upload failed"));

    await actions.handlePhotoUpload({
      photoData: [
        { id: "first", file: new File(["first"], "first.webp") },
        { id: "second", file: new File(["second"], "second.webp") },
      ],
      hashtags: "summer",
      views: 0,
    });

    expect(props.openModal).toHaveBeenCalledWith({
      status: "error",
      message: "No photos were uploaded.\nFailed photos: 2",
    });
  });
});
