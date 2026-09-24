import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import "./_adminProjectForm.scss";

const API_URL = import.meta.env.VITE_API_URL;

function AdminProjectForm() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(slug);

  const [projectId, setProjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [images, setImages] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    technologies: "",
    challenge: "",
    solution: "",
    skills: "",
    github: "",
    liveUrl: "",
  });

  // ------------------------------------
  // LOAD PROJECT
  // ------------------------------------

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/projects/${slug}`
        );

        if (!response.ok) {
          throw new Error("Failed to load project");
        }

        const project = await response.json();

        setProjectId(project._id);

        setProjectData({
          title: project.title || "",
          description: project.description || "",
          technologies:
            project.technologies?.join(", ") || "",
          challenge: project.challenge || "",
          solution: project.solution || "",
          skills: project.skills?.join(", ") || "",
          github: project.github || "",
          liveUrl: project.liveUrl || "",
        });

        setImages(
          (project.images || []).map((image) => ({
            type: "existing",
            url: image.url,
            publicId: image.publicId,
            preview: image.url,
            clientId: `existing-${image.publicId}`,
          }))
        );
      } catch (error) {
        console.error(
          "Error loading project:",
          error
        );

        alert("Could not load the project.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [isEditMode, slug]);

  // ------------------------------------
  // TEXT INPUTS
  // ------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProjectData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // ------------------------------------
  // SELECT NEW IMAGES
  // ------------------------------------

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) {
      return;
    }

    const remainingSlots = 8 - images.length;

    if (remainingSlots <= 0) {
      alert(
        "You can upload a maximum of 8 images."
      );

      event.target.value = "";
      return;
    }

    const allowedFiles = files.slice(
      0,
      remainingSlots
    );

    if (files.length > remainingSlots) {
      alert(
        `Only ${remainingSlots} more image(s) can be added.`
      );
    }

    const newImages = allowedFiles.map(
      (file, index) => ({
        type: "new",
        file,
        preview: URL.createObjectURL(file),
        clientId: `new-${Date.now()}-${index}-${file.name}`,
      })
    );

    setImages((currentImages) => [
      ...currentImages,
      ...newImages,
    ]);

    event.target.value = "";
  };

  // ------------------------------------
  // REMOVE IMAGE
  // ------------------------------------

  const handleRemoveImage = (clientId) => {
    setImages((currentImages) => {
      const imageToRemove =
        currentImages.find(
          (image) =>
            image.clientId === clientId
        );

      if (
        imageToRemove?.type === "new" &&
        imageToRemove.preview
      ) {
        URL.revokeObjectURL(
          imageToRemove.preview
        );
      }

      return currentImages.filter(
        (image) =>
          image.clientId !== clientId
      );
    });
  };

  // ------------------------------------
  // DRAG & DROP
  // ------------------------------------

  const handleDragStart = (
    event,
    index
  ) => {
    setDraggedIndex(index);

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      String(index)
    );
  };

  const handleDragOver = (event) => {
    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";
  };

  const handleDrop = (
    event,
    dropIndex
  ) => {
    event.preventDefault();

    const sourceIndex =
      draggedIndex !== null
        ? draggedIndex
        : Number(
            event.dataTransfer.getData(
              "text/plain"
            )
          );

    if (
      Number.isNaN(sourceIndex) ||
      sourceIndex === dropIndex
    ) {
      setDraggedIndex(null);
      return;
    }

    setImages((currentImages) => {
      const reorderedImages = [
        ...currentImages,
      ];

      const [movedImage] =
        reorderedImages.splice(
          sourceIndex,
          1
        );

      reorderedImages.splice(
        dropIndex,
        0,
        movedImage
      );

      return reorderedImages;
    });

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // ------------------------------------
  // UPLOAD NEW IMAGES
  // ------------------------------------

  const uploadNewImages = async () => {
    const newImages = images.filter(
      (image) => image.type === "new"
    );

    if (newImages.length === 0) {
      return [];
    }

    const formData = new FormData();

    newImages.forEach((image) => {
      formData.append(
        "images",
        image.file
      );
    });

    const response = await fetch(
      `${API_URL}/api/uploads/projects`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to upload images"
      );
    }

    return data.images;
  };

  // ------------------------------------
  // SAVE PROJECT
  // ------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      const uploadedImages =
        await uploadNewImages();

      let uploadedIndex = 0;

      const finalImages = images.map(
        (image) => {
          if (image.type === "existing") {
            return {
              url: image.url,
              publicId: image.publicId,
            };
          }

          const uploadedImage =
            uploadedImages[
              uploadedIndex
            ];

          uploadedIndex += 1;

          return uploadedImage;
        }
      );

      const savedProject = {
        ...projectData,

        slug: projectData.title
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-"),

        technologies:
          projectData.technologies
            .split(",")
            .map((technology) =>
              technology.trim()
            )
            .filter(Boolean),

        skills: projectData.skills
          .split(",")
          .map((skill) =>
            skill.trim()
          )
          .filter(Boolean),

        images: finalImages,
      };

      const url = isEditMode
        ? `${API_URL}/api/projects/${projectId}`
        : `${API_URL}/api/projects`;

      const response = await fetch(url, {
        method: isEditMode
          ? "PUT"
          : "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        credentials: "include",

        body: JSON.stringify(
          savedProject
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save project"
        );
      }

      alert(
        isEditMode
          ? "Project updated successfully!"
          : "Project saved successfully!"
      );

      navigate("/admin");
    } catch (error) {
      console.error(
        "Error saving project:",
        error
      );

      alert(
        error.message ||
          "Something went wrong while saving the project."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------------------------
  // LOADING
  // ------------------------------------

  if (isLoading) {
    return (
      <main className="admin-project-form">
        <div className="admin-project-form__container">
          <p>Loading project...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-project-form">
      <div className="admin-project-form__container">

        <header className="admin-project-form__header">
          <div>
            <p className="admin-project-form__eyebrow">
              Project Management
            </p>

            <h1>
              {isEditMode
                ? "Edit"
                : "Add"}

              <span>project.</span>
            </h1>
          </div>

          <Link
            to="/admin"
            className="admin-project-form__back"
          >
            ← Back to dashboard
          </Link>
        </header>

        <form
          className="admin-project-form__form"
          onSubmit={handleSubmit}
        >

          {/* BASIC INFORMATION */}

          <div className="admin-project-form__section">
            <div className="admin-project-form__section-title">
              <span>01</span>

              <div>
                <h2>
                  Basic information
                </h2>

                <p>
                  Information displayed in
                  the project overview.
                </p>
              </div>
            </div>

            <div className="admin-project-form__fields">

              <div className="admin-project-form__field">
                <label htmlFor="title">
                  Project title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={
                    projectData.title
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. Kasa"
                  required
                />
              </div>

              <div className="admin-project-form__field">
                <label htmlFor="description">
                  Short description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={
                    projectData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Briefly describe the project..."
                  rows="4"
                  required
                />
              </div>

              <div className="admin-project-form__field">
                <label htmlFor="technologies">
                  Technologies
                </label>

                <input
                  id="technologies"
                  name="technologies"
                  type="text"
                  value={
                    projectData.technologies
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="React, SCSS, React Router"
                />

                <small>
                  Separate technologies
                  with commas.
                </small>
              </div>

            </div>
          </div>

          {/* IMAGES */}

          <div className="admin-project-form__section">
            <div className="admin-project-form__section-title">
              <span>02</span>

              <div>
                <h2>
                  Project images
                </h2>

                <p>
                  Drag images to reorder
                  them. The first image
                  becomes the project cover.
                </p>
              </div>
            </div>

            <div className="admin-project-form__fields">

              <div className="admin-project-form__field">

                <label
                  className="admin-project-form__upload"
                  htmlFor="project-images"
                >
                  <span>
                    + Choose images
                  </span>

                  <small>
                    JPG, PNG, WEBP or AVIF
                    · maximum 8 images
                  </small>
                </label>

                <input
                  id="project-images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  onChange={
                    handleImageChange
                  }
                  className="admin-project-form__file-input"
                />

              </div>

              {images.length > 0 && (
                <div className="admin-project-form__image-grid">

                  {images.map(
                    (image, index) => (
                      <div
                        key={
                          image.clientId
                        }
                        className={`admin-project-form__image-preview ${
                          draggedIndex ===
                          index
                            ? "admin-project-form__image-preview--dragging"
                            : ""
                        }`}
                        draggable
                        onDragStart={(
                          event
                        ) =>
                          handleDragStart(
                            event,
                            index
                          )
                        }
                        onDragOver={
                          handleDragOver
                        }
                        onDrop={(event) =>
                          handleDrop(
                            event,
                            index
                          )
                        }
                        onDragEnd={
                          handleDragEnd
                        }
                      >
                        <img
                          src={
                            image.preview
                          }
                          alt={`${projectData.title || "Project"} ${index + 1}`}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveImage(
                              image.clientId
                            )
                          }
                          className="admin-project-form__remove-image"
                        >
                          ×
                        </button>

                        <span className="admin-project-form__drag-handle">
                          ⋮⋮
                        </span>

                        <span className="admin-project-form__image-status">
                          {index === 0
                            ? "Cover"
                            : image.type ===
                                "existing"
                              ? "Uploaded"
                              : "New"}
                        </span>
                      </div>
                    )
                  )}

                </div>
              )}

              <div className="admin-project-form__image-info">
                <small>
                  {images.length} / 8 images
                </small>

                {images.length > 1 && (
                  <small>
                    Drag and drop to
                    change the order.
                  </small>
                )}
              </div>

            </div>
          </div>

          {/* CASE STUDY */}

          <div className="admin-project-form__section">
            <div className="admin-project-form__section-title">
              <span>03</span>

              <div>
                <h2>Case study</h2>

                <p>
                  Explain the problem and
                  how you solved it.
                </p>
              </div>
            </div>

            <div className="admin-project-form__fields">

              <div className="admin-project-form__field">
                <label htmlFor="challenge">
                  The Challenge
                </label>

                <textarea
                  id="challenge"
                  name="challenge"
                  value={
                    projectData.challenge
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="What were the main challenges?"
                  rows="6"
                  required
                />
              </div>

              <div className="admin-project-form__field">
                <label htmlFor="solution">
                  The Solution
                </label>

                <textarea
                  id="solution"
                  name="solution"
                  value={
                    projectData.solution
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="How did you solve them?"
                  rows="6"
                  required
                />
              </div>

              <div className="admin-project-form__field">
                <label htmlFor="skills">
                  Skills developed
                </label>

                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={
                    projectData.skills
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="REST API, Authentication, Responsive Design"
                />

                <small>
                  Separate skills with
                  commas.
                </small>
              </div>

            </div>
          </div>

          {/* LINKS */}

          <div className="admin-project-form__section">
            <div className="admin-project-form__section-title">
              <span>04</span>

              <div>
                <h2>
                  Project links
                </h2>

                <p>
                  Add source code and live
                  project links.
                </p>
              </div>
            </div>

            <div className="admin-project-form__fields">

              <div className="admin-project-form__field">
                <label htmlFor="github">
                  GitHub URL
                </label>

                <input
                  id="github"
                  name="github"
                  type="url"
                  value={
                    projectData.github
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="admin-project-form__field">
                <label htmlFor="liveUrl">
                  Live project URL
                </label>

                <input
                  id="liveUrl"
                  name="liveUrl"
                  type="url"
                  value={
                    projectData.liveUrl
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://..."
                />
              </div>

            </div>
          </div>

          <div className="admin-project-form__footer">
            <Link to="/admin">
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Save Project"}

              <span>→</span>
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}

export default AdminProjectForm;